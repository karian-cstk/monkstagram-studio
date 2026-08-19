"use client";

import { useEffect, useState } from "react";
import { renderMarkdown } from "@/lib/markdown";

export default function HandoffPanel({
  open,
  file,
  onClose,
}: {
  open: boolean;
  file: string | null;
  onClose: () => void;
}) {
  const [content, setContent] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !file) return;
    setContent(null);
    let cancelled = false;
    fetch(file)
      .then((res) => res.text())
      .then((text) => {
        if (!cancelled) setContent(text);
      });
    return () => {
      cancelled = true;
    };
  }, [open, file]);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  return (
    <div
      className={`fixed inset-0 z-50 ${open ? "" : "pointer-events-none"}`}
      aria-hidden={!open}
    >
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-shadow-heavy transition-opacity duration-300 ${
          open ? "opacity-70" : "opacity-0"
        }`}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Storybook handoff"
        className={`absolute top-0 right-0 h-full w-full sm:w-[480px] bg-shadow-card border-l border-shadow-border shadow-2xl overflow-y-auto transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="sticky top-0 bg-shadow-card border-b border-shadow-border px-6 py-4 flex items-center justify-between">
          <span className="label-eyebrow text-xs text-periwinkle uppercase">Storybook Handoff</span>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-muted hover:text-crystal-clear transition-colors rounded-full p-1"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <div className="px-6 py-6">
          {content === null ? (
            <div className="animate-pulse space-y-3">
              <div className="h-5 bg-shadow-heavy rounded w-2/3" />
              <div className="h-3 bg-shadow-heavy rounded w-full" />
              <div className="h-3 bg-shadow-heavy rounded w-5/6" />
            </div>
          ) : (
            renderMarkdown(content)
          )}
        </div>
      </aside>
    </div>
  );
}
