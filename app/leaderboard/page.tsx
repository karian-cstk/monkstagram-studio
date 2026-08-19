"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  asOf as initialAsOf,
  leaderboardPeople as initialPeople,
  scopedBoards,
  score,
  type LeaderboardPerson,
  type StatusBucket,
} from "@/content/leaderboard";

type TimeWindow = "allTime" | "last90d";

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function bucketFor(person: LeaderboardPerson, timeWindow: TimeWindow): StatusBucket {
  return timeWindow === "allTime" ? person.allTime : person.last90d;
}

function rankPeople(people: LeaderboardPerson[], timeWindow: TimeWindow) {
  return [...people]
    .map((person) => ({ person, score: score(bucketFor(person, timeWindow)) }))
    .sort((a, b) => b.score - a.score)
    .map((entry, index) => ({ ...entry, rank: index + 1 }));
}

function rationale(
  person: LeaderboardPerson,
  timeWindow: TimeWindow,
  rank: number,
  pts: number
) {
  const b = bucketFor(person, timeWindow);
  const windowLabel = timeWindow === "allTime" ? "all-time" : "over the last 90 days";
  const scopeNote =
    timeWindow === "allTime"
      ? "across Product Design, UI/UX Team, UX Experience, and PX - Product Experience"
      : "across any Jira project, based on tickets touched or resolved in the window";
  if (b.total === 0) {
    const scopeDetail =
      timeWindow === "allTime"
        ? "in the scoped boards (PD, UT, UE, PXD)"
        : "touched or resolved anywhere in Jira";
    return `${person.name} has no tickets ${scopeDetail} ${windowLabel}. That usually means a lead/reviewer role rather than an individual contributor, or work that's tracked outside this scope — not a data error.`;
  }
  const clauses: string[] = [];
  if (b.done > 0)
    clauses.push(`shipped ${b.done} ticket${b.done === 1 ? "" : "s"} to Done`);
  if (b.inProgress > 0)
    clauses.push(
      `has ${b.inProgress} actively in progress`
    );
  if (b.backlog > 0)
    clauses.push(
      `${b.backlog} more sitting in backlog (not scored, but part of their load)`
    );
  const body = clauses.length ? clauses.join(", ") : "has no scored activity";
  return `Ranked #${rank} ${windowLabel} with ${pts} points. ${person.name} ${body}, ${scopeNote}.`;
}

const MEDAL = ["🥇", "🥈", "🥉"];

export default function LeaderboardPage() {
  const [timeWindow, setTimeWindow] = useState<TimeWindow>("allTime");
  const [people, setPeople] = useState(initialPeople);
  const [asOf, setAsOf] = useState(initialAsOf);
  const [refreshState, setRefreshState] = useState<
    "idle" | "loading" | "done"
  >("idle");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [live, setLive] = useState(false);
  const [liveError, setLiveError] = useState<string | null>(null);

  const allTimeRanked = useMemo(() => rankPeople(people, "allTime"), [people]);
  const last90dRanked = useMemo(() => rankPeople(people, "last90d"), [people]);
  const ranked = timeWindow === "allTime" ? allTimeRanked : last90dRanked;
  const otherRanked = timeWindow === "allTime" ? last90dRanked : allTimeRanked;
  const maxScore = Math.max(...ranked.map((r) => r.score), 1);

  const selectedEntry = ranked.find((r) => r.person.accountId === selectedId);

  // Pick up any photos uploaded through the modal in a previous visit —
  // those live server-side in content/leaderboard-photos.json, not in the
  // bundled content/leaderboard.ts, so they only show up via this fetch.
  // If JIRA_* env vars are configured server-side, this also pulls live
  // counts straight from Jira on load.
  useEffect(() => {
    fetch("/api/leaderboard", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        setPeople(data.people);
        setLive(data.live);
        setLiveError(data.liveError);
      })
      .catch(() => {});
  }, []);

  async function handleRefresh() {
    setRefreshState("loading");
    try {
      const res = await fetch("/api/leaderboard", { cache: "no-store" });
      const data = await res.json();
      setPeople(data.people);
      setAsOf(data.asOf);
      setLive(data.live);
      setLiveError(data.liveError);
    } finally {
      setRefreshState("done");
      setTimeout(() => setRefreshState("idle"), 2500);
    }
  }

  function handlePhotoUploaded(accountId: string, photo: string) {
    setPeople((prev) =>
      prev.map((p) => (p.accountId === accountId ? { ...p, photo } : p))
    );
  }

  return (
    <div
      className="min-h-screen"
      style={{ background: "#1A1919", color: "#F1E4CC" }}
    >
      <div
        className="max-w-5xl mx-auto px-6 py-16"
        style={{ fontFamily: "Inter, system-ui, sans-serif" }}
      >
        <p
          className="text-sm tracking-widest uppercase mb-4"
          style={{ color: "#AC75FF" }}
        >
          Design Team Leaderboard
        </p>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight max-w-2xl">
              Who&rsquo;s shipping, ranked by Jira.
            </h1>
            <p className="mt-3 max-w-2xl text-sm" style={{ color: "#9C8A6E" }}>
              Live-pulled from Jira boards{" "}
              {scopedBoards.map((b) => b.key).join(", ")} (
              {scopedBoards.map((b) => b.name).join(" · ")}), for the 12
              tracked design-team members. Click a card or row for the full
              story.
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

        {/* Window toggle */}
        <div
          role="tablist"
          aria-label="Time window"
          className="mt-8 inline-flex rounded-lg border p-1 gap-1"
          style={{ borderColor: "#3D2C1A", background: "#292928" }}
        >
          {(["allTime", "last90d"] as TimeWindow[]).map((w) => (
            <button
              key={w}
              role="tab"
              aria-selected={timeWindow === w}
              onClick={() => setTimeWindow(w)}
              className="rounded-md px-4 py-1.5 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              style={{
                background: timeWindow === w ? "#AC75FF" : "transparent",
                color: timeWindow === w ? "#1A1919" : "#C7B79A",
                outlineColor: "#AC75FF",
              }}
            >
              {w === "allTime" ? "All-time" : "Last 90 days"}
            </button>
          ))}
        </div>

        {/* Podium */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
          {[1, 0, 2].map((idx) => {
            const entry = ranked[idx];
            if (!entry) return <div key={idx} />;
            const isFirst = entry.rank === 1;
            return (
              <button
                key={entry.person.accountId}
                type="button"
                onClick={() => setSelectedId(entry.person.accountId)}
                className="rounded-xl border p-5 flex flex-col items-center text-center relative text-left transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                style={{
                  borderColor: isFirst ? "#AC75FF" : "#3D2C1A",
                  background: "#292928",
                  order: entry.rank === 1 ? 0 : entry.rank,
                  paddingTop: isFirst ? "2rem" : "1.25rem",
                  boxShadow: isFirst
                    ? "0 0 32px rgba(172,117,255,0.35)"
                    : undefined,
                  outlineColor: "#AC75FF",
                }}
              >
                <span className="text-3xl" aria-hidden="true">
                  {MEDAL[entry.rank - 1]}
                </span>
                <HoverAvatar person={entry.person} size={isFirst ? 96 : 76} />
                <p className="mt-3 font-semibold">{entry.person.name}</p>
                <p className="text-xs mt-1" style={{ color: "#9C8A6E" }}>
                  Rank #{entry.rank}
                </p>
                <p
                  className="mt-2 text-lg font-semibold"
                  style={{ color: "#AC75FF" }}
                >
                  {entry.score} pts
                </p>
              </button>
            );
          })}
        </div>

        {/* Scoring formula, transparent */}
        <div
          className="mt-8 rounded-lg border px-4 py-3 text-sm"
          style={{ borderColor: "#3D2C1A", background: "#292928", color: "#C7B79A" }}
        >
          <span className="font-medium" style={{ color: "#F1E4CC" }}>
            Score formula:
          </span>{" "}
          (tickets done × 10) + (tickets in progress × 2). Backlog tickets
          don&rsquo;t add points. Ranked descending, no hidden weighting.
        </div>

        {/* Full table */}
        <div className="mt-8 overflow-x-auto">
          <table className="w-full text-sm border-separate border-spacing-y-2">
            <caption className="sr-only">
              Design team leaderboard, {timeWindow === "allTime" ? "all-time" : "last 90 days"}
            </caption>
            <thead>
              <tr className="text-left" style={{ color: "#9C8A6E" }}>
                <th className="px-3 py-2 font-medium">Rank</th>
                <th className="px-3 py-2 font-medium">Designer</th>
                <th className="px-3 py-2 font-medium">Score</th>
                <th className="px-3 py-2 font-medium">Done</th>
                <th className="px-3 py-2 font-medium">In progress</th>
                <th className="px-3 py-2 font-medium">Backlog</th>
                <th className="px-3 py-2 font-medium">Total</th>
              </tr>
            </thead>
            <tbody>
              {ranked.map((entry) => {
                const bucket = bucketFor(entry.person, timeWindow);
                const otherRank = otherRanked.find(
                  (o) => o.person.accountId === entry.person.accountId
                )?.rank;
                const delta =
                  otherRank !== undefined ? otherRank - entry.rank : 0;
                const noData = entry.person.allTime.total === 0;
                return (
                  <tr
                    key={entry.person.accountId}
                    tabIndex={0}
                    role="button"
                    aria-label={`View details for ${entry.person.name}`}
                    onClick={() => setSelectedId(entry.person.accountId)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setSelectedId(entry.person.accountId);
                      }
                    }}
                    className="rounded-lg transition-colors cursor-pointer hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                    style={{
                      background: "#292928",
                      outlineColor: "#AC75FF",
                    }}
                  >
                    <td className="px-3 py-3 rounded-l-lg">
                      <span className="font-medium">{entry.rank}</span>
                      {delta !== 0 && (
                        <span
                          className="ml-2 text-xs"
                          style={{ color: delta > 0 ? "#7FD98A" : "#E08A8A" }}
                          title={`${delta > 0 ? "Up" : "Down"} ${Math.abs(delta)} vs the other window`}
                        >
                          {delta > 0 ? "▲" : "▼"}
                          {Math.abs(delta)}
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-3">
                        <HoverAvatar person={entry.person} size={44} />
                        <span>{entry.person.name}</span>
                        {noData && (
                          <span
                            className="text-xs rounded-full px-2 py-0.5"
                            style={{
                              background: "#3D2C1A",
                              color: "#C7B79A",
                            }}
                          >
                            no scoped tickets
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold" style={{ color: "#AC75FF" }}>
                          {entry.score}
                        </span>
                        <div
                          className="h-1.5 w-24 rounded-full overflow-hidden"
                          style={{ background: "#3D2C1A" }}
                        >
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${(entry.score / maxScore) * 100}%`,
                              background: "#AC75FF",
                            }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3">{bucket.done}</td>
                    <td className="px-3 py-3">{bucket.inProgress}</td>
                    <td className="px-3 py-3">{bucket.backlog}</td>
                    <td className="px-3 py-3 rounded-r-lg">{bucket.total}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Caveats */}
        <div
          className="mt-10 text-xs space-y-1.5 max-w-3xl"
          style={{ color: "#6B5A42" }}
        >
          <p>
            Snapshot as of {asOf}. Scoring is ticket-count based — Jira has
            no story-points field on these boards, so effort per ticket
            isn&rsquo;t weighted.
          </p>
          <p>
            &ldquo;All-time&rdquo; and &ldquo;Last 90 days&rdquo; are scoped
            differently on purpose. All-time is current ownership within the
            4 tracked design boards (PD, UT, UE, PXD) only. Last 90 days is
            broader — anyone ever assigned to a ticket touched or resolved
            in the window, anywhere in Jira, matching what Jira&rsquo;s own
            search returns for &ldquo;how many tickets has X worked on in
            the last 90 days.&rdquo; That means a person&rsquo;s 90-day
            total isn&rsquo;t a subset of their all-time total, and a few
            people with large all-time counts can show little 90-day
            activity if their recent Jira activity has been outside the
            tracked boards or is mostly new backlog rather than completions.
          </p>
          <p>
            George Karian shows 0 scoped tickets — likely a lead/reviewer
            role on these boards rather than an IC, not a data error.
          </p>
          <p>
            Jira has two accounts matching &ldquo;Kaustubh&rdquo; — only
            Kaustubh Gharat is tracked here, since Kaustubh Jadhav isn&rsquo;t
            a designer on this team.
          </p>
          <p>
            {live
              ? "Refresh re-queries Jira directly — this is a live snapshot, not a cached one."
              : liveError
                ? `Refresh attempted a live Jira query and failed (${liveError}) — showing the last known-good snapshot instead.`
                : "Refresh re-fetches the last generated snapshot — live re-query needs JIRA_BASE_URL / JIRA_EMAIL / JIRA_API_TOKEN configured on the server (see .env.local.example), which isn't set up yet."}
          </p>
          <p>
            Evidence tickets (the &ldquo;why they&rsquo;re ranked here&rdquo;
            links) come from the last snapshot pull, even when scores are
            live — they&rsquo;re illustrative examples, not necessarily the
            most recent ticket right now.
          </p>
        </div>
      </div>

      {selectedEntry && (
        <PersonModal
          entry={selectedEntry}
          timeWindow={timeWindow}
          onClose={() => setSelectedId(null)}
          onPhotoUploaded={handlePhotoUploaded}
        />
      )}
    </div>
  );
}

function HoverAvatar({
  person,
  size,
}: {
  person: LeaderboardPerson;
  size: number;
}) {
  const zoomSize = Math.round(size * 3.2);
  return (
    <div
      className="group relative inline-flex"
      style={{ width: size, height: size }}
    >
      <Avatar person={person} size={size} />
      <div
        className="pointer-events-none absolute left-1/2 bottom-full mb-3 opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all duration-150 origin-bottom z-20"
        style={{ transform: "translateX(-50%)" }}
      >
        <div
          className="rounded-xl overflow-hidden border shadow-2xl"
          style={{
            width: zoomSize,
            height: zoomSize,
            borderColor: "#AC75FF",
            background: "#292928",
            boxShadow: "0 12px 40px rgba(0,0,0,0.6), 0 0 0 1px #AC75FF",
          }}
        >
          <Avatar person={person} size={zoomSize} square />
        </div>
      </div>
    </div>
  );
}

function Avatar({
  person,
  size,
  square = false,
}: {
  person: LeaderboardPerson;
  size: number;
  square?: boolean;
}) {
  if (person.photo) {
    return (
      <Image
        src={person.photo}
        alt={person.name}
        width={size}
        height={size}
        className={square ? "object-cover" : "rounded-full object-cover"}
        style={{
          width: size,
          height: size,
          border: square ? "none" : "1px solid #3D2C1A",
        }}
      />
    );
  }
  return (
    <div
      role="img"
      aria-label={person.name}
      className={square ? "flex items-center justify-center font-semibold" : "rounded-full flex items-center justify-center font-semibold"}
      style={{
        width: size,
        height: size,
        background: "#3D2C1A",
        color: "#AC75FF",
        fontSize: size * 0.32,
        border: square ? "none" : "1px solid #3D2C1A",
      }}
    >
      {initials(person.name)}
    </div>
  );
}

function PersonModal({
  entry,
  timeWindow,
  onClose,
  onPhotoUploaded,
}: {
  entry: { person: LeaderboardPerson; score: number; rank: number };
  timeWindow: TimeWindow;
  onClose: () => void;
  onPhotoUploaded: (accountId: string, photo: string) => void;
}) {
  const { person, score: pts, rank } = entry;
  const bucket = bucketFor(person, timeWindow);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.7)" }}
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="person-modal-title"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-3xl rounded-2xl border overflow-hidden flex flex-col sm:flex-row"
        style={{
          background: "#1A1919",
          borderColor: "#3D2C1A",
          color: "#F1E4CC",
          fontFamily: "Inter, system-ui, sans-serif",
          maxHeight: "90vh",
        }}
      >
        {/* Left: full-height portrait */}
        <div
          className="relative shrink-0 sm:w-64 h-56 sm:h-auto"
          style={{ background: "#292928" }}
        >
          {person.photo ? (
            <Image
              src={person.photo}
              alt={person.name}
              fill
              sizes="256px"
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-3 p-4">
              <div
                className="font-semibold text-5xl"
                style={{ color: "#AC75FF" }}
              >
                {initials(person.name)}
              </div>
              <PhotoUpload
                accountId={person.accountId}
                onUploaded={onPhotoUploaded}
              />
            </div>
          )}
          <span
            className="absolute top-3 left-3 text-2xl drop-shadow"
            aria-hidden="true"
          >
            {rank <= 3 ? MEDAL[rank - 1] : null}
          </span>
        </div>

        {/* Right: content */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex items-start justify-between p-6 pb-0">
            <div>
              <h2 id="person-modal-title" className="text-xl font-semibold">
                {person.name}
              </h2>
              <p className="text-sm mt-1" style={{ color: "#9C8A6E" }}>
                Rank #{rank} · {timeWindow === "allTime" ? "All-time" : "Last 90 days"}
              </p>
              <p className="text-lg font-semibold mt-1" style={{ color: "#AC75FF" }}>
                {pts} pts
              </p>
            </div>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="rounded-full w-8 h-8 flex items-center justify-center text-lg shrink-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              style={{ background: "#292928", color: "#F1E4CC", outlineColor: "#AC75FF" }}
            >
              ×
            </button>
          </div>

          <div className="p-6 pt-4 overflow-y-auto" style={{ maxHeight: "calc(90vh - 100px)" }}>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-5">
              {[
                {
                  label: "Done",
                  value: bucket.done,
                  hint: "Completed tickets · +10 pts each",
                },
                {
                  label: "In progress",
                  value: bucket.inProgress,
                  hint: "Actively being worked · +2 pts each",
                },
                {
                  label: "Backlog",
                  value: bucket.backlog,
                  hint: "Not started yet · 0 pts",
                },
                {
                  label: "Total",
                  value: bucket.total,
                  hint: "All scoped tickets assigned",
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-lg px-3 py-2.5"
                  style={{ background: "#292928" }}
                >
                  <p className="text-lg font-semibold leading-none">
                    {stat.value}
                  </p>
                  <p
                    className="text-[11px] font-medium mt-1"
                    style={{ color: "#F1E4CC" }}
                  >
                    {stat.label}
                  </p>
                  <p className="text-[10px] mt-0.5 leading-tight" style={{ color: "#9C8A6E" }}>
                    {stat.hint}
                  </p>
                </div>
              ))}
            </div>

            <h3 className="text-sm font-medium mb-2" style={{ color: "#F1E4CC" }}>
              Why they&rsquo;re ranked here
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: "#C7B79A" }}>
              {rationale(person, timeWindow, rank, pts)}
            </p>

            <h3 className="text-sm font-medium mt-5 mb-2" style={{ color: "#F1E4CC" }}>
              Evidence — recent completed tickets
            </h3>
            {person.evidence.length > 0 ? (
              <ul className="space-y-2">
                {person.evidence.map((ev) => (
                  <li key={ev.key}>
                    <a
                      href={ev.webUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                      style={{ background: "#292928", outlineColor: "#AC75FF" }}
                    >
                      <span
                        className="shrink-0 font-mono text-xs rounded px-1.5 py-0.5"
                        style={{ background: "#3D2C1A", color: "#AC75FF" }}
                      >
                        {ev.key}
                      </span>
                      <span style={{ color: "#F1E4CC" }}>{ev.summary}</span>
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm" style={{ color: "#6B5A42" }}>
                No completed tickets in scope to show as evidence.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function PhotoUpload({
  accountId,
  onUploaded,
}: {
  accountId: string;
  onUploaded: (accountId: string, photo: string) => void;
}) {
  const [status, setStatus] = useState<"idle" | "uploading" | "error">(
    "idle"
  );
  const [errorMsg, setErrorMsg] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setStatus("uploading");
    setErrorMsg("");
    try {
      const form = new FormData();
      form.append("accountId", accountId);
      form.append("file", file);
      const res = await fetch("/api/leaderboard/photo", {
        method: "POST",
        body: form,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Upload failed");
      onUploaded(accountId, data.photo);
      setStatus("idle");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Upload failed");
    }
  }

  return (
    <div className="flex flex-col items-center gap-1.5">
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="sr-only"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={status === "uploading"}
        className="text-xs font-medium rounded-lg px-3 py-1.5 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
        style={{
          background: "#3D2C1A",
          color: "#AC75FF",
          outlineColor: "#AC75FF",
        }}
      >
        {status === "uploading" ? "Uploading…" : "Upload photo"}
      </button>
      {status === "error" && (
        <p className="text-[10px] text-center px-2" style={{ color: "#E08A8A" }}>
          {errorMsg}
        </p>
      )}
    </div>
  );
}
