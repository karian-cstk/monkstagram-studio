"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ongoingTickets as initialOngoing,
  reopenedTickets,
  staleAgeBuckets,
  staleTickets20d,
  topPerformers30d as initialTop30d,
  unassignedByProject,
  unassignedOpen,
  type OngoingItem,
  type TopPerformerEntry,
} from "@/content/dashboard";
import { leaderboardPeople } from "@/content/leaderboard";

// Chrome (text/surface/border/accent) uses the same tokens as the rest of
// the site (app/globals.css) so this page matches the global light/dark
// toggle and stays visually consistent with every other page. The chart
// MARK colors below (CAT, SEQ_BLUE) are intentionally separate — they're
// the dataviz skill's validated categorical/sequential palette, chosen for
// data-encoding distinguishability (CVD-safe multi-series contrast), not
// brand matching. Mixing the two would break the charts' ability to tell
// categories apart.
const INK = "var(--crystal-clear)";
const INK_SECONDARY = "var(--slate)";
const MUTED = "var(--muted)";
const SURFACE = "var(--shadow-card)";
const PAGE_BG = "var(--shadow-heavy)";
const GRID = "var(--shadow-border)";
const BORDER = "var(--shadow-border)";
const ACCENT = "var(--amethyst-accessible)";
const ACCENT_FILL = "var(--amethyst)";
const ON_ACCENT = "var(--on-accent)";
const ACCENT_SOFT = "var(--shadow-border)";
const CAT = { blue: "#2a78d6", orange: "#eb6834", aqua: "#1baf7a", yellow: "#eda100" };
const SEQ_BLUE = ["#86b6ef", "#5598e7", "#2a78d6", "#1c5cab", "#104281"];

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

function photoFor(accountId: string) {
  return leaderboardPeople.find((p) => p.accountId === accountId)?.photo ?? null;
}

const EASE = "cubic-bezier(0.34, 1.56, 0.64, 1)";

function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const raf = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);
  return mounted;
}

export default function DashboardPage() {
  const mounted = useMounted();
  const [top30d, setTop30d] = useState<TopPerformerEntry[]>(initialTop30d);
  const [ongoing, setOngoing] = useState<OngoingItem[]>(initialOngoing);
  const [asOf, setAsOf] = useState<string | null>(null);
  const [live, setLive] = useState(false);
  const [liveError, setLiveError] = useState<string | null>(null);
  const [refreshState, setRefreshState] = useState<"idle" | "loading" | "done">("idle");

  async function load() {
    const res = await fetch("/api/dashboard", { cache: "no-store" });
    const data = await res.json();
    setTop30d(data.topPerformers30d);
    setOngoing(data.ongoingTickets);
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

  const ranked = [...top30d].sort((a, b) => b.score - a.score).slice(0, 5);
  const maxScore = Math.max(...ranked.map((r) => r.score), 1);

  const unassignedTotal = unassignedByProject.reduce((s, p) => s + p.count, 0);
  const staleTotal = staleAgeBuckets.reduce((s, b) => s + b.count, 0);
  const maxStale = Math.max(...staleAgeBuckets.map((b) => b.count), 1);

  const ongoingByStatus = (() => {
    const known = ["In Progress", "Selected for Development", "Review", "QA"];
    const counts = new Map<string, number>();
    for (const item of ongoing) {
      const bucket = known.includes(item.status) ? item.status : "Other";
      counts.set(bucket, (counts.get(bucket) ?? 0) + 1);
    }
    const colors: Record<string, string> = {
      "In Progress": CAT.blue,
      "Selected for Development": CAT.orange,
      Review: CAT.aqua,
      QA: CAT.yellow,
      Other: MUTED,
    };
    return [...known, "Other"]
      .map((status) => ({ status, count: counts.get(status) ?? 0, color: colors[status] }))
      .filter((s) => s.count > 0);
  })();
  const maxOngoing = Math.max(...ongoingByStatus.map((s) => s.count), 1);

  const classificationCounts = [
    { label: "unclear", count: reopenedTickets.items.filter((i) => i.classification === "unclear").length, color: MUTED },
    { label: "bug/defect", count: reopenedTickets.items.filter((i) => i.classification === "bug/defect").length, color: CAT.orange },
    { label: "design/scope change", count: reopenedTickets.items.filter((i) => i.classification === "design/scope change").length, color: CAT.blue },
    { label: "new feature request", count: reopenedTickets.items.filter((i) => i.classification === "new feature request").length, color: CAT.aqua },
  ].filter((c) => c.count > 0);
  const maxClass = Math.max(...classificationCounts.map((c) => c.count), 1);

  return (
    <div className="min-h-screen" style={{ background: PAGE_BG, color: INK, fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif" }}>
      <div className="max-w-5xl mx-auto px-6 py-16">
        <p className="text-sm tracking-widest uppercase mb-4 font-medium" style={{ color: ACCENT }}>
          Design Team Dashboard
        </p>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight max-w-2xl">
              What&rsquo;s moving, what&rsquo;s stuck.
            </h1>
            <p className="mt-3 max-w-2xl text-sm" style={{ color: INK_SECONDARY }}>
              Live-pulled from Jira boards PD, UT, UE, PXD. Click any chart for the full list.
            </p>
          </div>
          <button
            type="button"
            onClick={handleRefresh}
            disabled={refreshState === "loading"}
            className="rounded-lg px-4 py-2 text-sm font-medium border transition-all hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{ borderColor: BORDER, background: SURFACE, color: INK, outlineColor: ACCENT }}
          >
            {refreshState === "loading" ? "Refreshing…" : refreshState === "done" ? "Up to date" : "Refresh"}
          </button>
        </div>

        {/* Top performer — emphasis bar chart */}
        <Link
          href="/leaderboard"
          className="mt-10 block rounded-2xl border p-6 transition-all hover:-translate-y-1 hover:shadow-lg"
          style={{ borderColor: BORDER, background: SURFACE }}
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-xs uppercase tracking-wide font-medium" style={{ color: ACCENT }}>
                Top performers · last 30 days
              </p>
              <p className="text-xs mt-0.5" style={{ color: MUTED }}>
                Score = done×10 + in-progress×2. Click to open the full leaderboard →
              </p>
            </div>
            {photoFor(ranked[0]?.accountId ?? "") ? (
              <Image
                src={photoFor(ranked[0].accountId)!}
                alt={ranked[0].name}
                width={56}
                height={56}
                className="rounded-full object-cover"
                style={{ width: 56, height: 56, border: `1px solid ${BORDER}` }}
              />
            ) : (
              <div
                className="rounded-full flex items-center justify-center font-semibold"
                style={{ width: 56, height: 56, background: ACCENT_SOFT, color: ACCENT }}
              >
                {ranked[0] && initials(ranked[0].name)}
              </div>
            )}
          </div>
          <div className="space-y-2.5">
            {ranked.map((p, i) => (
              <div key={p.accountId} className="flex items-center gap-3">
                <span className="text-xs w-32 shrink-0 truncate font-medium" style={{ color: i === 0 ? INK : INK_SECONDARY }}>
                  {p.name}
                </span>
                <div className="flex-1 h-6 rounded-full overflow-hidden" style={{ background: GRID }}>
                  <div
                    className="h-full rounded-full flex items-center justify-end px-2"
                    style={{
                      width: mounted ? `${(p.score / maxScore) * 100}%` : "0%",
                      background: i === 0 ? ACCENT_FILL : BORDER,
                      transition: `width 900ms ${EASE}`,
                      transitionDelay: `${i * 80}ms`,
                    }}
                  >
                    <span
                      className="text-[11px] font-semibold whitespace-nowrap"
                      style={{ color: i === 0 ? ON_ACCENT : INK }}
                    >
                      {p.score}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Link>

        {/* Widgets grid */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Unassigned — stacked bar part-to-whole */}
          <Link
            href="/dashboard/unassigned"
            className="rounded-2xl border p-6 transition-all hover:-translate-y-1 hover:shadow-lg"
            style={{ borderColor: BORDER, background: SURFACE }}
          >
            <p className="text-xs uppercase tracking-wide font-medium" style={{ color: ACCENT }}>
              Unassigned tickets
            </p>
            <p className="text-4xl font-semibold mt-2" style={{ color: INK }}>
              {unassignedTotal.toLocaleString()}
            </p>
            <p className="text-xs mt-1 mb-4" style={{ color: MUTED }}>
              Open, no assignee — by board. Click for the full list →
            </p>
            <div className="h-8 rounded-lg overflow-hidden flex" style={{ background: GRID }}>
              {unassignedByProject.map((p, i) => {
                const pct = (p.count / unassignedTotal) * 100;
                const colors = [CAT.blue, CAT.orange, CAT.aqua, CAT.yellow];
                return (
                  <div
                    key={p.project}
                    className="h-full flex items-center justify-center relative"
                    style={{
                      width: mounted ? `${pct}%` : "0%",
                      background: colors[i % colors.length],
                      transition: `width 900ms ${EASE}`,
                      transitionDelay: `${i * 60}ms`,
                      borderRight: i < unassignedByProject.length - 1 ? `2px solid ${SURFACE}` : "none",
                    }}
                    title={`${p.project}: ${p.count}`}
                  />
                );
              })}
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3">
              {unassignedByProject.map((p, i) => {
                const colors = [CAT.blue, CAT.orange, CAT.aqua, CAT.yellow];
                return (
                  <span key={p.project} className="flex items-center gap-1.5 text-xs" style={{ color: INK_SECONDARY }}>
                    <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: colors[i % colors.length] }} />
                    {p.project} · {p.count.toLocaleString()}
                  </span>
                );
              })}
            </div>
          </Link>

          {/* Stale — sequential histogram */}
          <Link
            href="/dashboard/stale"
            className="rounded-2xl border p-6 transition-all hover:-translate-y-1 hover:shadow-lg"
            style={{ borderColor: BORDER, background: SURFACE }}
          >
            <p className="text-xs uppercase tracking-wide font-medium" style={{ color: ACCENT }}>
              Pending &gt; 20 days
            </p>
            <p className="text-4xl font-semibold mt-2" style={{ color: INK }}>
              {staleTotal.toLocaleString()}
            </p>
            <p className="text-xs mt-1 mb-4" style={{ color: MUTED }}>
              Not Done, by age since created. Click for the full list →
            </p>
            <div className="flex items-end gap-2 h-24">
              {staleAgeBuckets.map((b, i) => (
                <div key={b.label} className="flex-1 flex flex-col items-center justify-end h-full gap-1">
                  <span className="text-[10px] font-medium" style={{ color: INK_SECONDARY }}>
                    {b.count}
                  </span>
                  <div
                    className="w-full rounded-t-md"
                    style={{
                      height: mounted ? `${(b.count / maxStale) * 100}%` : "0%",
                      minHeight: mounted ? 3 : 0,
                      background: SEQ_BLUE[i],
                      transition: `height 900ms ${EASE}`,
                      transitionDelay: `${i * 70}ms`,
                    }}
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-2">
              {staleAgeBuckets.map((b) => (
                <span key={b.label} className="flex-1 text-center text-[10px]" style={{ color: MUTED }}>
                  {b.label}
                </span>
              ))}
            </div>
          </Link>
        </div>

        {/* Ongoing — categorical bar by status */}
        <Link
          href="/dashboard/ongoing"
          className="mt-5 block rounded-2xl border p-6 transition-all hover:-translate-y-1 hover:shadow-lg"
          style={{ borderColor: BORDER, background: SURFACE }}
        >
          <p className="text-xs uppercase tracking-wide font-medium" style={{ color: ACCENT }}>
            Ongoing today
          </p>
          <p className="text-4xl font-semibold mt-2" style={{ color: INK }}>
            {ongoing.length}
          </p>
          <p className="text-xs mt-1 mb-4" style={{ color: MUTED }}>
            Currently active tickets across PD/UT/UE/PXD, any assignee, as of today. Click for
            owner + status on every ticket →
          </p>
          <div className="space-y-2">
            {ongoingByStatus.map((s, i) => (
              <div key={s.status} className="flex items-center gap-3">
                <span className="text-xs w-44 shrink-0" style={{ color: INK_SECONDARY }}>
                  {s.status}
                </span>
                <div className="flex-1 h-5 rounded-full overflow-hidden" style={{ background: GRID }}>
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: mounted ? `${(s.count / maxOngoing) * 100}%` : "0%",
                      background: s.color,
                      transition: `width 900ms ${EASE}`,
                      transitionDelay: `${i * 80}ms`,
                    }}
                  />
                </div>
                <span className="text-xs font-semibold w-8 text-right shrink-0" style={{ color: INK }}>
                  {s.count}
                </span>
              </div>
            ))}
          </div>
        </Link>

        {/* Reopened — categorical bar */}
        <Link
          href="/dashboard/reopened"
          className="mt-5 block rounded-2xl border p-6 transition-all hover:-translate-y-1 hover:shadow-lg"
          style={{ borderColor: BORDER, background: SURFACE }}
        >
          <p className="text-xs uppercase tracking-wide font-medium" style={{ color: ACCENT }}>
            Reopened after Done
          </p>
          <p className="text-4xl font-semibold mt-2" style={{ color: INK }}>
            {reopenedTickets.totalCount}
          </p>
          <p className="text-xs mt-1 mb-4" style={{ color: MUTED }}>
            By inferred reason (Claude&rsquo;s read of each ticket — verify before treating as
            fact). Click for details →
          </p>
          <div className="space-y-2">
            {classificationCounts.map((c, i) => (
              <div key={c.label} className="flex items-center gap-3">
                <span className="text-xs w-40 shrink-0" style={{ color: INK_SECONDARY }}>
                  {c.label}
                </span>
                <div className="flex-1 h-5 rounded-full overflow-hidden" style={{ background: GRID }}>
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: mounted ? `${(c.count / maxClass) * 100}%` : "0%",
                      background: c.color,
                      transition: `width 900ms ${EASE}`,
                      transitionDelay: `${i * 80}ms`,
                    }}
                  />
                </div>
                <span className="text-xs font-semibold w-6 text-right shrink-0" style={{ color: INK }}>
                  {c.count}
                </span>
              </div>
            ))}
          </div>
        </Link>

        {/* Caveats */}
        <div className="mt-8 text-xs space-y-1.5 max-w-3xl" style={{ color: MUTED }}>
          <p>Snapshot as of {asOf ?? "…"}.</p>
          <p>
            {live
              ? "Refresh re-queries Jira directly for the top-performer, unassigned, stale, and ongoing widgets — a live snapshot, not cached."
              : liveError
                ? `Refresh attempted a live Jira query and failed (${liveError}) — showing the last known-good snapshot.`
                : "Refresh re-fetches the last generated snapshot — live re-query needs JIRA_BASE_URL / JIRA_EMAIL / JIRA_API_TOKEN configured on the server."}
          </p>
          <p>
            Unassigned and stale counts include contributors beyond the 12 tracked designers and
            years of backlog — that&rsquo;s real, not a bug.
          </p>
        </div>
      </div>
    </div>
  );
}
