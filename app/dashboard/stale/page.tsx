"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { staleAgeBuckets, staleTickets20d, type StaleItem } from "@/content/dashboard";

const INK = "#0b0b0b";
const INK_SECONDARY = "#52514e";
const MUTED = "#898781";
const SURFACE = "#ffffff";
const PAGE_BG = "#f9f9f7";
const BORDER = "rgba(11,11,11,0.10)";
const ACCENT = "#AC75FF";
const SEQ_BLUE = ["#86b6ef", "#5598e7", "#2a78d6", "#1c5cab", "#104281"];

function daysAgo(iso: string) {
  return Math.floor((Date.now() - new Date(iso).getTime()) / (1000 * 60 * 60 * 24));
}

export default function StaleDrilldownPage() {
  const [data, setData] = useState(staleTickets20d);

  useEffect(() => {
    fetch("/api/dashboard", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => setData(d.staleTickets20d))
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen" style={{ background: PAGE_BG, color: INK, fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif" }}>
      <div className="max-w-4xl mx-auto px-6 py-16">
        <Link href="/dashboard" className="text-sm font-medium" style={{ color: ACCENT }}>
          ← Back to dashboard
        </Link>
        <p className="text-sm tracking-widest uppercase mt-6 mb-2 font-medium" style={{ color: ACCENT }}>
          Pending Completion
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">
          {data.totalCount.toLocaleString()} tickets open 20+ days
        </h1>
        <p className="mt-2 text-sm max-w-2xl" style={{ color: INK_SECONDARY }}>
          Measures backlog age since creation, not recent stagnation. Showing the{" "}
          {Math.min(data.listTruncatedTo, data.items.length)} oldest.
        </p>

        <div className="flex flex-wrap gap-2 mt-4">
          {staleAgeBuckets.map((b, i) => (
            <span
              key={b.label}
              className="text-xs rounded-full px-3 py-1 font-medium text-white"
              style={{ background: SEQ_BLUE[i] }}
            >
              {b.label} · {b.count.toLocaleString()}
            </span>
          ))}
        </div>

        <ul className="mt-6 space-y-2">
          {data.items.map((item: StaleItem) => (
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
                  style={{ background: "#f0e9ff", color: ACCENT }}
                >
                  {item.key}
                </span>
                <span className="flex-1" style={{ color: INK }}>
                  {item.summary}
                </span>
                <span className="shrink-0 text-xs" style={{ color: MUTED }}>
                  {item.assigneeName}
                </span>
                <span
                  className="shrink-0 text-xs rounded-full px-2 py-0.5"
                  style={{ background: "#f2f1ee", color: INK_SECONDARY }}
                >
                  {item.status}
                </span>
                <span className="shrink-0 text-xs" style={{ color: MUTED }}>
                  {daysAgo(item.created)}d
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
