import { NextResponse } from "next/server";
import { asOf, leaderboardPeople, scopedBoards } from "@/content/leaderboard";
import { readPhotoOverrides } from "@/lib/photoOverrides";
import { fetchLiveLeaderboard, isJiraConfigured } from "@/lib/jiraLive";

// If JIRA_BASE_URL / JIRA_EMAIL / JIRA_API_TOKEN are set (see .env.local),
// this re-queries Jira directly on every request — "Refresh" on the page
// is a real live re-query, not a cache. Without those env vars it falls
// back to the static snapshot in content/leaderboard.ts.
export async function GET() {
  const overrides = readPhotoOverrides();
  let people = leaderboardPeople;
  let live = false;
  let liveError: string | null = null;
  let fetchedAt = asOf;

  if (isJiraConfigured()) {
    try {
      people = await fetchLiveLeaderboard();
      live = true;
      fetchedAt = new Date().toISOString();
    } catch (err) {
      liveError = err instanceof Error ? err.message : "Live Jira fetch failed";
    }
  }

  const withPhotos = people.map((person) =>
    overrides[person.accountId]
      ? { ...person, photo: overrides[person.accountId] }
      : person
  );

  return NextResponse.json({
    asOf: fetchedAt,
    scopedBoards,
    people: withPhotos,
    live,
    liveError,
  });
}
