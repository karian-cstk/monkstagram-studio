import { leaderboardPeople, scopedBoardKeys, type StatusBucket } from "@/content/leaderboard";
import { correctedBuckets, isJiraConfigured } from "@/lib/jira";

export { isJiraConfigured };

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
