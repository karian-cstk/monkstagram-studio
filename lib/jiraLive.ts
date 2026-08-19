import { leaderboardPeople, scopedBoardKeys, type StatusBucket } from "@/content/leaderboard";

export function isJiraConfigured() {
  return Boolean(
    process.env.JIRA_BASE_URL &&
      process.env.JIRA_EMAIL &&
      process.env.JIRA_API_TOKEN
  );
}

async function runJqlCount(jql: string): Promise<number> {
  const baseUrl = process.env.JIRA_BASE_URL!;
  const auth = Buffer.from(
    `${process.env.JIRA_EMAIL}:${process.env.JIRA_API_TOKEN}`
  ).toString("base64");

  const url = `${baseUrl}/rest/api/3/search?jql=${encodeURIComponent(
    jql
  )}&maxResults=0`;
  const res = await fetch(url, {
    headers: { Authorization: `Basic ${auth}`, Accept: "application/json" },
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`Jira request failed (${res.status}): ${await res.text()}`);
  }
  const data = await res.json();
  return data.total as number;
}

// Bucketing override (found 2026-08-19): Jira's own `statusCategory`
// misclassifies two statuses relative to how this team actually works —
//   - "Selected for Development": native category "To Do", but it's been
//     picked up, so it counts as In Progress here.
//   - "On Hold": native category "In Progress" (indeterminate), but paused
//     work isn't active, so it counts as Backlog/To Do here.
// Verified against a user-supplied Jira report — every number matched
// once this override was applied. Compute corrected buckets from the raw
// statusCategory counts plus the two override counts, rather than querying
// `status in (...)` lists directly, so nothing silently falls through if
// a project introduces a new status name later — Done stays untouched,
// and In Progress/To Do are always derived by moving exactly these two
// named statuses between the native buckets.
async function correctedBuckets(base: string): Promise<StatusBucket> {
  const [done, nativeInProgress, nativeToDo, onHold, selectedForDev] =
    await Promise.all([
      runJqlCount(`${base} AND statusCategory = Done`),
      runJqlCount(`${base} AND statusCategory = "In Progress"`),
      runJqlCount(`${base} AND statusCategory = "To Do"`),
      runJqlCount(`${base} AND status = "On Hold"`),
      runJqlCount(`${base} AND status = "Selected for Development"`),
    ]);
  const inProgress = nativeInProgress - onHold + selectedForDev;
  const backlog = nativeToDo - selectedForDev + onHold;
  return { done, inProgress, backlog, total: done + inProgress + backlog };
}

// allTime: current ownership only, within the 4 tracked design boards.
// (assignee = X, project in (PD, UT, UE, PXD))
async function fetchAllTimeBucket(accountId: string): Promise<StatusBucket> {
  return correctedBuckets(
    `project in (${scopedBoardKeys.join(", ")}) AND assignee = "${accountId}"`
  );
}

// last90d: anyone ever assigned (assignee WAS), on tickets touched/resolved
// in the last 90 days, anywhere in Jira — no project filter. See the header
// comment in content/leaderboard.ts for why this is scoped differently from
// allTime (matches Jira's own "how many tickets has X worked on in the last
// 90 days" answer; unbounded `assignee WAS` without the date filter is
// unreliable — it picks up bulk-reassignment history noise).
async function fetchLast90dBucket(accountId: string): Promise<StatusBucket> {
  return correctedBuckets(`assignee WAS "${accountId}" AND updated >= -90d`);
}

export async function fetchLiveLeaderboard() {
  return Promise.all(
    leaderboardPeople.map(async (person) => {
      const [allTime, last90d] = await Promise.all([
        fetchAllTimeBucket(person.accountId),
        fetchLast90dBucket(person.accountId),
      ]);
      return { ...person, allTime, last90d };
    })
  );
}
