import { scopedBoardKeys, type StatusBucket } from "@/content/leaderboard";

export function isJiraConfigured() {
  return Boolean(
    process.env.JIRA_BASE_URL &&
      process.env.JIRA_EMAIL &&
      process.env.JIRA_API_TOKEN
  );
}

function authHeader() {
  const auth = Buffer.from(
    `${process.env.JIRA_EMAIL}:${process.env.JIRA_API_TOKEN}`
  ).toString("base64");
  return { Authorization: `Basic ${auth}`, Accept: "application/json" };
}

export async function runJqlCount(jql: string): Promise<number> {
  const baseUrl = process.env.JIRA_BASE_URL!;
  const url = `${baseUrl}/rest/api/3/search?jql=${encodeURIComponent(
    jql
  )}&maxResults=0`;
  const res = await fetch(url, { headers: authHeader(), cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Jira request failed (${res.status}): ${await res.text()}`);
  }
  const data = await res.json();
  return data.total as number;
}

export async function runJqlSearch(
  jql: string,
  fields: string[],
  maxResults: number
): Promise<any[]> {
  const baseUrl = process.env.JIRA_BASE_URL!;
  const url = `${baseUrl}/rest/api/3/search?jql=${encodeURIComponent(
    jql
  )}&fields=${fields.join(",")}&maxResults=${maxResults}`;
  const res = await fetch(url, { headers: authHeader(), cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Jira request failed (${res.status}): ${await res.text()}`);
  }
  const data = await res.json();
  return data.issues as any[];
}

// Paginated variant of runJqlSearch — the classic search endpoint caps a
// single page at 100 regardless of the requested maxResults, so anything
// expecting more than ~100 results needs this instead. Capped at 500 total
// as a safety valve (well above any of this dashboard's real result sizes).
export async function runJqlSearchAll(
  jql: string,
  fields: string[]
): Promise<any[]> {
  const baseUrl = process.env.JIRA_BASE_URL!;
  const all: any[] = [];
  let startAt = 0;
  const pageSize = 100;
  while (all.length < 500) {
    const url = `${baseUrl}/rest/api/3/search?jql=${encodeURIComponent(
      jql
    )}&fields=${fields.join(",")}&maxResults=${pageSize}&startAt=${startAt}`;
    const res = await fetch(url, { headers: authHeader(), cache: "no-store" });
    if (!res.ok) {
      throw new Error(`Jira request failed (${res.status}): ${await res.text()}`);
    }
    const data = await res.json();
    all.push(...data.issues);
    if (startAt + pageSize >= data.total || data.issues.length === 0) break;
    startAt += pageSize;
  }
  return all;
}

export const scopedBoardsJql = `project in (${scopedBoardKeys.join(", ")})`;

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
export async function correctedBuckets(base: string): Promise<StatusBucket> {
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
