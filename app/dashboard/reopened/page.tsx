"use client";

import Link from "next/link";
import { reopenedTickets, type ReopenedItem } from "@/content/dashboard";

// Chrome matches the site tokens (app/globals.css); CAT is the dataviz
// skill's validated categorical palette for classification tags — kept
// separate from brand color on purpose (see dashboard/page.tsx).
const INK = "var(--crystal-clear)";
const INK_SECONDARY = "var(--slate)";
const MUTED = "var(--muted)";
const SURFACE = "var(--shadow-card)";
const PAGE_BG = "var(--shadow-heavy)";
const BORDER = "var(--shadow-border)";
const ACCENT = "var(--amethyst-accessible)";
const ACCENT_SOFT = "var(--shadow-border)";
const CAT = { blue: "#2a78d6", orange: "#eb6834", aqua: "#1baf7a" };

const CLASSIFICATION_COLOR: Record<ReopenedItem["classification"], string> = {
  "new feature request": CAT.aqua,
  "design/scope change": CAT.blue,
  "bug/defect": CAT.orange,
  unclear: MUTED,
};

export default function ReopenedDrilldownPage() {
  return (
    <div className="min-h-screen" style={{ background: PAGE_BG, color: INK, fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif" }}>
      <div className="max-w-4xl mx-auto px-6 py-16">
        <Link href="/dashboard" className="text-sm font-medium" style={{ color: ACCENT }}>
          ← Back to dashboard
        </Link>
        <p className="text-sm tracking-widest uppercase mt-6 mb-2 font-medium" style={{ color: ACCENT }}>
          Reopened After Done
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">
          {reopenedTickets.totalCount} tickets reopened
        </h1>
        <p className="mt-2 text-sm max-w-2xl" style={{ color: INK_SECONDARY }}>
          Left a Done-family status (Done, Ready to Deploy, Archived) and are active again. Each
          reason below is Claude&rsquo;s read of the ticket&rsquo;s description and comments —{" "}
          <strong>not a Jira field</strong> — verify via the link before treating it as fact.
        </p>

        <ul className="mt-6 space-y-3">
          {reopenedTickets.items.map((item) => (
            <li
              key={item.key}
              className="rounded-xl border p-4"
              style={{ borderColor: BORDER, background: SURFACE }}
            >
              <div className="flex items-start justify-between gap-3">
                <a
                  href={item.webUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm font-medium hover:underline"
                  style={{ color: INK }}
                >
                  <span
                    className="shrink-0 font-mono text-xs rounded px-1.5 py-0.5"
                    style={{ background: ACCENT_SOFT, color: ACCENT }}
                  >
                    {item.key}
                  </span>
                  {item.summary}
                </a>
                <span
                  className="shrink-0 text-xs rounded-full px-2.5 py-0.5 font-medium whitespace-nowrap"
                  style={{
                    background: `${CLASSIFICATION_COLOR[item.classification]}1a`,
                    color: CLASSIFICATION_COLOR[item.classification],
                  }}
                >
                  {item.classification}
                </span>
              </div>
              <p className="text-sm mt-2" style={{ color: INK_SECONDARY }}>
                {item.inferredReason}
              </p>
              <p className="text-xs mt-2" style={{ color: MUTED }}>
                {item.project} · currently {item.status}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
