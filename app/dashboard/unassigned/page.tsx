"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { unassignedByProject, unassignedOpen, type UnassignedItem } from "@/content/dashboard";

// Chrome matches the site tokens (app/globals.css); CAT is the dataviz
// skill's validated categorical palette for the per-board legend chips —
// kept separate from brand color on purpose (see dashboard/page.tsx).
const INK = "var(--crystal-clear)";
const INK_SECONDARY = "var(--slate)";
const MUTED = "var(--muted)";
const SURFACE = "var(--shadow-card)";
const PAGE_BG = "var(--shadow-heavy)";
const BORDER = "var(--shadow-border)";
const ACCENT = "var(--amethyst-accessible)";
const ACCENT_SOFT = "var(--shadow-border)";
const CAT = { blue: "#2a78d6", orange: "#eb6834", aqua: "#1baf7a", yellow: "#eda100" };

function daysAgo(iso: string) {
  return Math.floor((Date.now() - new Date(iso).getTime()) / (1000 * 60 * 60 * 24));
}

export default function UnassignedDrilldownPage() {
  const [data, setData] = useState(unassignedOpen);

  useEffect(() => {
    fetch("/api/dashboard", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => setData(d.unassignedOpen))
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen" style={{ background: PAGE_BG, color: INK, fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif" }}>
      <div className="max-w-4xl mx-auto px-6 py-16">
        <Link href="/dashboard" className="text-sm font-medium" style={{ color: ACCENT }}>
          ← Back to dashboard
        </Link>
        <p className="text-sm tracking-widest uppercase mt-6 mb-2 font-medium" style={{ color: ACCENT }}>
          Unassigned Tickets
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">{data.totalCount.toLocaleString()} open, no assignee</h1>
        <p className="mt-2 text-sm max-w-2xl" style={{ color: INK_SECONDARY }}>
          Across PD/UT/UE/PXD — includes contributors beyond the tracked design roster and years
          of backlog. Showing the {Math.min(data.listTruncatedTo, data.items.length)} oldest.
        </p>

        <div className="flex flex-wrap gap-2 mt-4">
          {unassignedByProject.map((p, i) => {
            const colors = [CAT.blue, CAT.orange, CAT.aqua, CAT.yellow];
            return (
              <span
                key={p.project}
                className="text-xs rounded-full px-3 py-1 font-medium"
                style={{ background: `${colors[i % colors.length]}1a`, color: colors[i % colors.length] }}
              >
                {p.project} · {p.count.toLocaleString()}
              </span>
            );
          })}
        </div>

        <ul className="mt-6 space-y-2">
          {data.items.map((item: UnassignedItem) => (
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
                <span className="flex-1" style={{ color: INK }}>
                  {item.summary}
                </span>
                <span
                  className="shrink-0 text-xs rounded-full px-2 py-0.5"
                  style={{ background: BORDER, color: INK }}
                >
                  {item.status}
                </span>
                <span className="shrink-0 text-xs" style={{ color: MUTED }}>
                  {daysAgo(item.created)}d old
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
