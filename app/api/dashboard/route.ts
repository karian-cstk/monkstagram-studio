import { NextResponse } from "next/server";
import {
  dashboardAsOf,
  reopenedTickets,
  staleTickets20d,
  topPerformers30d,
  unassignedOpen,
} from "@/content/dashboard";
import { isJiraConfigured } from "@/lib/jira";
import { fetchLiveDashboard } from "@/lib/dashboardLive";

// Same live/fallback pattern as /api/leaderboard. Widgets 1-3 fully
// re-query Jira when configured; widget 4 (reopened, with inferred
// reasons) only re-checks the count live — the reasons themselves are
// an analysis pull, not something a plain JQL call can regenerate. See
// lib/dashboardLive.ts.
export async function GET() {
  if (isJiraConfigured()) {
    try {
      const liveData = await fetchLiveDashboard();
      return NextResponse.json({
        asOf: new Date().toISOString(),
        live: true,
        liveError: null,
        topPerformers30d: liveData.topPerformers30d,
        unassignedOpen: liveData.unassignedOpen,
        staleTickets20d: liveData.staleTickets20d,
        reopenedTickets: {
          totalCount: liveData.reopenedCount,
          items: reopenedTickets.items,
          countChangedSinceAnalysis: liveData.reopenedCount !== reopenedTickets.totalCount,
        },
      });
    } catch (err) {
      const liveError = err instanceof Error ? err.message : "Live Jira fetch failed";
      return NextResponse.json({
        asOf: dashboardAsOf,
        live: false,
        liveError,
        topPerformers30d,
        unassignedOpen,
        staleTickets20d,
        reopenedTickets: { ...reopenedTickets, countChangedSinceAnalysis: false },
      });
    }
  }

  return NextResponse.json({
    asOf: dashboardAsOf,
    live: false,
    liveError: null,
    topPerformers30d,
    unassignedOpen,
    staleTickets20d,
    reopenedTickets: { ...reopenedTickets, countChangedSinceAnalysis: false },
  });
}
