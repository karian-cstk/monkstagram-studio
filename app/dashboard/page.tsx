"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  dashboardAsOf as initialAsOf,
  reopenedTickets as initialReopened,
  staleTickets20d as initialStale,
  topPerformers30d as initialTop30d,
  unassignedOpen as initialUnassigned,
  type ReopenedItem,
  type StaleItem,
  type TopPerformerEntry,
  type UnassignedItem,
} from "@/content/dashboard";
import { leaderboardPeople } from "@/content/leaderboard";

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function daysAgo(iso: string) {
  const ms = Date.now() - new Date(iso).getTime();
  return Math.floor(ms / (1000 * 60 * 60 * 24));
}

function photoFor(accountId: string) {
  return leaderboardPeople.find((p) => p.accountId === accountId)?.photo ?? null;
}

const CLASSIFICATION_COLOR: Record<ReopenedItem["classification"], string> = {
  "new feature request": "#7FB8D9",
  "design/scope change": "#AC75FF",
  "bug/defect": "#E08A8A",
  unclear: "#9C8A6E",
};

export default function DashboardPage() {
  const [asOf, setAsOf] = useState(initialAsOf);
  const [live, setLive] = useState(false);
  const [liveError, setLiveError] = useState<string | null>(null);
  const [refreshState, setRefreshState] = useState<"idle" | "loading" | "done">("idle");

  const [top30d, setTop30d] = useState<TopPerformerEntry[]>(initialTop30d);
  const [unassigned, setUnassigned] = useState(initialUnassigned);
  const [stale, setStale] = useState(initialStale);
  const [reopened, setReopened] = useState<{
    totalCount: number;
    items: ReopenedItem[];
    countChangedSinceAnalysis?: boolean;
  }>(initialReopened);

  async function load() {
    const res = await fetch("/api/dashboard", { cache: "no-store" });
    const data = await res.json();
    setTop30d(data.topPerformers30d);
    setUnassigned(data.unassignedOpen);
    setStale(data.staleTickets20d);
    setReopened(data.reopenedTickets);
    setAsOf(data.asOf);
    setLive(data.live);
    setLiveError(data.liveError);
  }

  useEffect(() => {
    load().catch(() => {});
  }, []);

  async function handleRefresh() {
    setRefreshState("loading");
    try {
      await load();
    } finally {
      setRefreshState("done");
      setTimeout(() => setRefreshState("idle"), 2500);
    }
  }

  const ranked = [...top30d].sort((a, b) => b.score - a.score);
  const topPerformer = ranked[0];

  return (
    <div className="min-h-screen" style={{ background: "#1A1919", color: "#F1E4CC" }}>
      <div
        className="max-w-5xl mx-auto px-6 py-16"
        style={{ fontFamily: "Inter, system-ui, sans-serif" }}
      >
        <p className="text-sm tracking-widest uppercase mb-4" style={{ color: "#AC75FF" }}>
          Design Team Dashboard
        </p>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight max-w-2xl">
              What&rsquo;s moving, what&rsquo;s stuck.
            </h1>
            <p className="mt-3 max-w-2xl text-sm" style={{ color: "#9C8A6E" }}>
              Live-pulled from Jira boards PD, UT, UE, PXD.
            </p>
          </div>
          <button
            type="button"
            onClick={handleRefresh}
            disabled={refreshState === "loading"}
            className="rounded-lg px-4 py-2 text-sm font-medium border transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{
              borderColor: "#3D2C1A",
              background: "#292928",
              color: "#F1E4CC",
              outlineColor: "#AC75FF",
            }}
          >
            {refreshState === "loading"
              ? "Refreshing…"
              : refreshState === "done"
                ? "Snapshot is current ✓"
                : "Refresh"}
          </button>
        </div>

        {/* Top performer teaser */}
        {topPerformer && (
          <Link
            href="/leaderboard"
            className="mt-10 flex items-center gap-5 rounded-2xl border p-6 transition-transform hover:-translate-y-0.5"
            style={{
              borderColor: "#AC75FF",
              background: "#292928",
              boxShadow: "0 0 32px rgba(172,117,255,0.2)",
            }}
          >
            {photoFor(topPerformer.accountId) ? (
              <Image
                src={photoFor(topPerformer.accountId)!}
                alt={topPerformer.name}
                width={72}
                height={72}
                className="rounded-full object-cover"
                style={{ width: 72, height: 72, border: "1px solid #3D2C1A" }}
              />
            ) : (
              <div
                className="rounded-full flex items-center justify-center font-semibold shrink-0"
                style={{ width: 72, height: 72, background: "#3D2C1A", color: "#AC75FF", fontSize: 24 }}
              >
                {initials(topPerformer.name)}
              </div>
            )}
            <div className="flex-1">
              <p className="text-xs uppercase tracking-wide" style={{ color: "#AC75FF" }}>
                Top performer · last 30 days
              </p>
              <p className="text-xl font-semibold mt-1">{topPerformer.name}</p>
              <p className="text-sm mt-0.5" style={{ color: "#9C8A6E" }}>
                {topPerformer.done} done · {topPerformer.inProgress} in progress · {topPerformer.score} pts
              </p>
            </div>
            <span className="text-sm shrink-0" style={{ color: "#AC75FF" }}>
              View full leaderboard →
            </span>
          </Link>
        )}

        {/* Widgets grid */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Unassigned tickets */}
          <div className="rounded-xl border p-5" style={{ borderColor: "#3D2C1A", background: "#292928" }}>
            <div className="flex items-baseline justify-between">
              <h2 className="text-sm font-medium" style={{ color: "#F1E4CC" }}>
                Unassigned tickets
              </h2>
              <span className="text-2xl font-semibold" style={{ color: "#AC75FF" }}>
                {unassigned.totalCount}
              </span>
            </div>
            <p className="text-xs mt-1" style={{ color: "#9C8A6E" }}>
              Open (not Done), no assignee, across PD/UT/UE/PXD — includes contributors beyond
              the tracked design roster and years of backlog.
            </p>
            <ul className="mt-3 space-y-1.5 max-h-72 overflow-y-auto pr-1">
              {unassigned.items.map((item: UnassignedItem) => (
                <li key={item.key}>
                  <a
                    href={item.webUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-2 rounded-lg px-2.5 py-1.5 text-xs transition-colors hover:brightness-110"
                    style={{ background: "#1A1919" }}
                  >
                    <span
                      className="shrink-0 font-mono rounded px-1 py-0.5"
                      style={{ background: "#3D2C1A", color: "#AC75FF" }}
                    >
                      {item.key}
                    </span>
                    <span className="flex-1" style={{ color: "#C7B79A" }}>
                      {item.summary}
                    </span>
                    <span className="shrink-0" style={{ color: "#6B5A42" }}>
                      {daysAgo(item.created)}d old
                    </span>
                  </a>
                </li>
              ))}
            </ul>
            {unassigned.totalCount > unassigned.listTruncatedTo && (
              <p className="text-[11px] mt-2" style={{ color: "#6B5A42" }}>
                Showing the {unassigned.listTruncatedTo} oldest of {unassigned.totalCount} total.
              </p>
            )}
          </div>

          {/* Stale tickets */}
          <div className="rounded-xl border p-5" style={{ borderColor: "#3D2C1A", background: "#292928" }}>
            <div className="flex items-baseline justify-between">
              <h2 className="text-sm font-medium" style={{ color: "#F1E4CC" }}>
                Pending &gt; 20 days
              </h2>
              <span className="text-2xl font-semibold" style={{ color: "#AC75FF" }}>
                {stale.totalCount}
              </span>
            </div>
            <p className="text-xs mt-1" style={{ color: "#9C8A6E" }}>
              Not Done, created 20+ days ago — measures backlog age, not recent stagnation.
            </p>
            <ul className="mt-3 space-y-1.5 max-h-72 overflow-y-auto pr-1">
              {stale.items.map((item: StaleItem) => (
                <li key={item.key}>
                  <a
                    href={item.webUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-2 rounded-lg px-2.5 py-1.5 text-xs transition-colors hover:brightness-110"
                    style={{ background: "#1A1919" }}
                  >
                    <span
                      className="shrink-0 font-mono rounded px-1 py-0.5"
                      style={{ background: "#3D2C1A", color: "#AC75FF" }}
                    >
                      {item.key}
                    </span>
                    <span className="flex-1" style={{ color: "#C7B79A" }}>
                      {item.summary}
                    </span>
                    <span className="shrink-0" style={{ color: "#6B5A42" }}>
                      {daysAgo(item.created)}d
                    </span>
                  </a>
                </li>
              ))}
            </ul>
            {stale.totalCount > stale.listTruncatedTo && (
              <p className="text-[11px] mt-2" style={{ color: "#6B5A42" }}>
                Showing the {stale.listTruncatedTo} oldest of {stale.totalCount} total.
              </p>
            )}
          </div>
        </div>

        {/* Reopened tickets */}
        <div
          className="mt-5 rounded-xl border p-5"
          style={{ borderColor: "#3D2C1A", background: "#292928" }}
        >
          <div className="flex items-baseline justify-between">
            <h2 className="text-sm font-medium" style={{ color: "#F1E4CC" }}>
              Reopened after Done
            </h2>
            <span className="text-2xl font-semibold" style={{ color: "#AC75FF" }}>
              {reopened.totalCount}
            </span>
          </div>
          <p className="text-xs mt-1" style={{ color: "#9C8A6E" }}>
            Tickets that left a Done-family status (Done, Ready to Deploy, Archived) and are
            active again. The reason is Claude&rsquo;s read of each ticket&rsquo;s comments — not
            a Jira field — verify before treating it as fact.
          </p>
          {reopened.countChangedSinceAnalysis && (
            <p className="text-[11px] mt-1" style={{ color: "#E08A8A" }}>
              Live count ({reopened.totalCount}) differs from the last full analysis — some of
              these reasons may be stale or a new reopened ticket may be missing below.
            </p>
          )}
          <ul className="mt-3 space-y-2">
            {reopened.items.map((item) => (
              <li
                key={item.key}
                className="rounded-lg p-3"
                style={{ background: "#1A1919" }}
              >
                <div className="flex items-start justify-between gap-3">
                  <a
                    href={item.webUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm hover:brightness-110"
                  >
                    <span
                      className="shrink-0 font-mono text-xs rounded px-1.5 py-0.5"
                      style={{ background: "#3D2C1A", color: "#AC75FF" }}
                    >
                      {item.key}
                    </span>
                    <span style={{ color: "#F1E4CC" }}>{item.summary}</span>
                  </a>
                  <span
                    className="shrink-0 text-[10px] rounded-full px-2 py-0.5 whitespace-nowrap"
                    style={{
                      background: "#292928",
                      color: CLASSIFICATION_COLOR[item.classification],
                      border: `1px solid ${CLASSIFICATION_COLOR[item.classification]}`,
                    }}
                  >
                    {item.classification}
                  </span>
                </div>
                <p className="text-xs mt-2" style={{ color: "#9C8A6E" }}>
                  {item.inferredReason}
                </p>
              </li>
            ))}
          </ul>
        </div>

        {/* Caveats */}
        <div className="mt-8 text-xs space-y-1.5 max-w-3xl" style={{ color: "#6B5A42" }}>
          <p>Snapshot as of {asOf}.</p>
          <p>
            {live
              ? "Refresh re-queries Jira directly — a live snapshot, not a cached one. Reopened-ticket reasons are the exception: only their count re-checks live."
              : liveError
                ? `Refresh attempted a live Jira query and failed (${liveError}) — showing the last known-good snapshot.`
                : "Refresh re-fetches the last generated snapshot — live re-query needs JIRA_BASE_URL / JIRA_EMAIL / JIRA_API_TOKEN configured on the server, same as the leaderboard page."}
          </p>
        </div>
      </div>
    </div>
  );
}
