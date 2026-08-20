import { leaderboardPeople } from "@/content/leaderboard";
import {
  correctedBuckets,
  runJqlCount,
  runJqlSearch,
  runJqlSearchAll,
  scopedBoardsJql,
} from "@/lib/jira";
import type {
  OngoingItem,
  ReopenedItem,
  StaleItem,
  TopPerformerEntry,
  UnassignedItem,
} from "@/content/dashboard";

// "Ongoing" JQL — same corrected bucketing used everywhere: "Selected for
// Development" counts as active even though its native statusCategory is
// "To Do"; "On Hold" is excluded even though its native statusCategory is
// "In Progress". See content/dashboard.ts and lib/jira.ts's
// correctedBuckets for the same rule applied elsewhere.
export async function fetchOngoingTicketsLive(): Promise<OngoingItem[]> {
  const jql = `${scopedBoardsJql} AND ((statusCategory = "In Progress" AND status != "On Hold") OR status = "Selected for Development")`;
  const issues = await runJqlSearchAll(`${jql} ORDER BY updated DESC`, [
    "summary",
    "status",
    "assignee",
    "project",
  ]);
  return issues.map((issue) => ({
    key: issue.key,
    summary: issue.fields.summary,
    status: issue.fields.status.name,
    assignee: issue.fields.assignee?.displayName ?? "Unassigned",
    project: issue.fields.project.key,
    webUrl: `${process.env.JIRA_BASE_URL}/browse/${issue.key}`,
  }));
}

// Widget 1: top performer, last 30 days — current assignee, scoped boards,
// same corrected-bucket scoring as the leaderboard's all-time view.
export async function fetchTopPerformers30dLive(): Promise<TopPerformerEntry[]> {
  return Promise.all(
    leaderboardPeople.map(async (person) => {
      const bucket = await correctedBuckets(
        `${scopedBoardsJql} AND assignee = "${person.accountId}" AND updated >= -30d`
      );
      return {
        accountId: person.accountId,
        name: person.name,
        done: bucket.done,
        inProgress: bucket.inProgress,
        backlog: bucket.backlog,
        score: bucket.done * 10 + bucket.inProgress * 2,
      };
    })
  );
}

// Widget 2: unassigned open tickets, oldest first.
export async function fetchUnassignedOpenLive(): Promise<{
  totalCount: number;
  listTruncatedTo: number;
  items: UnassignedItem[];
}> {
  const jql = `${scopedBoardsJql} AND assignee is EMPTY AND statusCategory != Done`;
  const [totalCount, issues] = await Promise.all([
    runJqlCount(jql),
    runJqlSearch(`${jql} ORDER BY created ASC`, ["summary", "status", "created", "project"], 15),
  ]);
  return {
    totalCount,
    listTruncatedTo: 15,
    items: issues.map((issue) => ({
      key: issue.key,
      summary: issue.fields.summary,
      status: issue.fields.status.name,
      project: issue.fields.project.key,
      created: issue.fields.created,
      webUrl: `${process.env.JIRA_BASE_URL}/browse/${issue.key}`,
    })),
  };
}

// Widget 3: stale tickets — created 20+ days ago, still not Done.
export async function fetchStaleTickets20dLive(): Promise<{
  totalCount: number;
  listTruncatedTo: number;
  items: StaleItem[];
}> {
  const jql = `${scopedBoardsJql} AND statusCategory != Done AND created <= -20d`;
  const [totalCount, issues] = await Promise.all([
    runJqlCount(jql),
    runJqlSearch(
      `${jql} ORDER BY created ASC`,
      ["summary", "status", "created", "project", "assignee"],
      15
    ),
  ]);
  return {
    totalCount,
    listTruncatedTo: 15,
    items: issues.map((issue) => ({
      key: issue.key,
      summary: issue.fields.summary,
      status: issue.fields.status.name,
      project: issue.fields.project.key,
      created: issue.fields.created,
      assigneeName: issue.fields.assignee?.displayName ?? "Unassigned",
      webUrl: `${process.env.JIRA_BASE_URL}/browse/${issue.key}`,
    })),
  };
}

// Widget 4: reopened tickets — count only. The inferred reasons require
// reading each ticket's description/comments and judging intent, which
// isn't something a plain Jira query call can redo — those stay as the
// last analysis pull (see content/dashboard.ts). Live refresh here just
// confirms whether the count has changed since that pull.
export async function fetchReopenedCountLive(): Promise<number> {
  return runJqlCount(
    `${scopedBoardsJql} AND status was in ("Done", "Ready to Deploy", "Archived") AND statusCategory != Done`
  );
}

export async function fetchLiveDashboard() {
  const [topPerformers30d, unassignedOpen, staleTickets20d, reopenedCount, ongoingTickets] =
    await Promise.all([
      fetchTopPerformers30dLive(),
      fetchUnassignedOpenLive(),
      fetchStaleTickets20dLive(),
      fetchReopenedCountLive(),
      fetchOngoingTicketsLive(),
    ]);
  return { topPerformers30d, unassignedOpen, staleTickets20d, reopenedCount, ongoingTickets };
}

export type { ReopenedItem };
