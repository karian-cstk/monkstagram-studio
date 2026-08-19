"use client";

import { useMemo, useState } from "react";
import type { IconEntry } from "@/content/icons-core";

export default function IconLibrary({ icons }: { icons: IconEntry[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return icons;
    return icons.filter(
      (icon) => icon.name.toLowerCase().includes(q) || icon.category.toLowerCase().includes(q)
    );
  }, [icons, query]);

  const grouped = useMemo(() => {
    const map = new Map<string, IconEntry[]>();
    for (const icon of filtered) {
      const list = map.get(icon.category) ?? [];
      list.push(icon);
      map.set(icon.category, list);
    }
    return Array.from(map.entries());
  }, [filtered]);

  return (
    <div className="mt-10">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search icons by name or category…"
        className="w-full max-w-sm rounded-lg border border-shadow-border bg-shadow-card px-4 py-2 text-sm placeholder:text-muted focus:outline-none focus:border-amethyst"
      />

      <p className="mt-3 text-xs text-muted">
        {filtered.length} of {icons.length} icons
        {icons.length < 200 && " · large icon sets (Flags, Actions, and others) are being exported separately"}
      </p>

      <div className="mt-8 space-y-10">
        {grouped.map(([category, categoryIcons]) => (
          <div key={category}>
            <h3 className="text-sm font-semibold text-periwinkle uppercase tracking-wide mb-4">
              {category}
              <span className="text-muted font-normal normal-case ml-2">({categoryIcons.length})</span>
            </h3>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(96px,1fr))] gap-3">
              {categoryIcons.map((icon) => (
                <div
                  key={icon.slug}
                  className="flex flex-col items-center gap-2 rounded-lg border border-shadow-border bg-shadow-card p-3"
                  title={icon.name}
                >
                  <div className="w-10 h-10 rounded-md bg-crystal-clear/95 flex items-center justify-center overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={icon.path} alt={icon.name} className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] text-subtle text-center leading-tight line-clamp-2">
                    {icon.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
        {grouped.length === 0 && (
          <p className="text-subtle">No icons match &ldquo;{query}&rdquo;.</p>
        )}
      </div>
    </div>
  );
}
