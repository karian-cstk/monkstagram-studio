"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ongoingTickets as initialOngoing, type OngoingItem } from "@/content/dashboard";

// Chrome matches the site tokens (app/globals.css); CAT is the dataviz
// skill's validated categorical palette for the status badges — kept
// separate from brand color on purpose (see dashboard/page.tsx).
const INK = "var(--crystal-clear)";
const INK_SECONDARY = "var(--slate)";
const MUTED = "var(--muted)";
const SURFACE = "var(--shadow-card)";
const PAGE_BG = "var(--shadow-heavy)";
const BORDER = "var(--shadow-border)";
const ACCENT = "var(--amethyst-accessible)";
const ACCENT_SOFT = "var(--shadow-border)";
const CAT = { blue: "#2a78d6", orange: "#eb6834", aqua: "#1baf7a", yellow: "#eda100" };

const STATUS_COLOR: Record<string, string> = {
  "In Progress": CAT.blue,
  "Selected for Development": CAT.orange,
  Review: CAT.aqua,
  QA: CAT.yellow,
};

function statusColor(status: string) {
  return STATUS_COLOR[status] ?? MUTED;
}

type SortKey = "status" | "assignee" | "project";

export default function OngoingDrilldownPage() {
  const [items, setItems] = useState<OngoingItem[]>(initialOngoing);
  const [sortKey, setSortKey] = useState<SortKey>("status");
  const [filter, setFilter] = useState<string>("");

  useEffect(() => {
    fetch("/api/dashboard", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => setItems(d.ongoingTickets))
      .catch(() => {});
  }, []);

  const filtered = filter
    ? items.filter(
        (i) =>
          i.assignee.toLowerCase().includes(filter.toLowerCase()) ||
          i.status.toLowerCase().includes(filter.toLowerCase()) ||
          i.summary.toLowerCase().includes(filter.toLowerCase()) ||
          i.key.toLowerCase().includes(filter.toLowerCase())
      )
    : items;

  const sorted = [...filtered].sort((a, b) => a[sortKey].localeCompare(b[sortKey]));

  return (
    <div className="min-h-screen" style={{ background: PAGE_BG, color: INK, fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif" }}>
      <div className="max-w-4xl mx-auto px-6 py-16">
        <Link href="/dashboard" className="text-sm font-medium" style={{ color: ACCENT }}>
          ← Back to dashboard
        </Link>
        <p className="text-sm tracking-widest uppercase mt-6 mb-2 font-medium" style={{ color: ACCENT }}>
          Ongoing Today
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">{items.length} tickets currently active</h1>
        <p className="mt-2 text-sm max-w-2xl" style={{ color: INK_SECONDARY }}>
          Across PD/UT/UE/PXD, any assignee — currently In Progress, in Review, in QA, or Selected
          for Development. &ldquo;On Hold&rdquo; is excluded (paused, not active).
        </p>

        <div className="flex items-center gap-3 mt-5">
          <input
            type="text"
            placeholder="Filter by owner, status, or ticket…"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="flex-1 rounded-lg border px-3 py-2 text-sm outline-none"
            style={{ borderColor: BORDER, background: SURFACE, color: INK }}
          />
          <div className="flex rounded-lg border p-1 gap-1 shrink-0" style={{ borderColor: BORDER, background: SURFACE }}>
            {(["status", "assignee", "project"] as SortKey[]).map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => setSortKey(k)}
                className="rounded-md px-3 py-1 text-xs font-medium transition-colors"
                style={{
                  background: sortKey === k ? ACCENT_SOFT : "transparent",
                  color: sortKey === k ? INK : INK_SECONDARY,
                }}
              >
                Sort: {k}
              </button>
            ))}
          </div>
        </div>

        <ul className="mt-4 space-y-2">
          {sorted.map((item) => (
            <li key={item.key}>
              <a
                href={item.webUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-xl border p-3 text-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                style={{ borderColor: BORDER, background: SURFACE }}
              >
                <span
                  className="shrink-0 font-mono text-xs rounded px-1.5 py-0.5"
                  style={{ background: ACCENT_SOFT, color: ACCENT }}
                >
                  {item.key}
                </span>
                <span className="flex-1 truncate" style={{ color: INK }}>
                  {item.summary}
                </span>
                <span className="shrink-0 text-xs w-36 truncate text-right" style={{ color: INK_SECONDARY }}>
                  {item.assignee}
                </span>
                <span
                  className="shrink-0 text-xs rounded-full px-2 py-0.5 font-medium whitespace-nowrap flex items-center gap-1.5"
                  style={{ background: `${statusColor(item.status)}1a`, color: statusColor(item.status) }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full inline-block"
                    style={{ background: statusColor(item.status) }}
                    aria-hidden="true"
                  />
                  {item.status}
                </span>
              </a>
            </li>
          ))}
        </ul>
        {sorted.length === 0 && (
          <p className="text-sm mt-6" style={{ color: MUTED }}>
            No tickets match &ldquo;{filter}&rdquo;.
          </p>
        )}
      </div>
    </div>
  );
}
