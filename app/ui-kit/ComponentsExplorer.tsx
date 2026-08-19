"use client";

import { useEffect, useRef, useState } from "react";
import type { UIKitComponent } from "@/content/ui-kit";
import ComponentPreview from "./ComponentPreview";
import HandoffPanel from "./HandoffPanel";

export default function ComponentsExplorer({ components }: { components: UIKitComponent[] }) {
  const [active, setActive] = useState(components[0]?.slug ?? "");
  const [panelOpen, setPanelOpen] = useState(false);
  const [panelFile, setPanelFile] = useState<string | null>(null);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: 0 }
    );
    components.forEach((c) => {
      const el = sectionRefs.current[c.slug];
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [components]);

  const openHandoff = (file: string) => {
    setPanelFile(file);
    setPanelOpen(true);
  };

  return (
    <div className="mt-10 grid md:grid-cols-[220px_1fr] gap-10 items-start">
      <nav className="hidden md:block sticky top-24 space-y-1 text-sm">
        {components.map((c) => (
          <a
            key={c.slug}
            href={`#${c.slug}`}
            className={`block px-3 py-1.5 rounded-md transition-colors ${
              active === c.slug ? "bg-shadow-card text-crystal-clear" : "text-muted hover:text-subtle"
            }`}
          >
            {c.name}
          </a>
        ))}
      </nav>

      <div className="space-y-14">
        {components.map((c) => (
          <article
            key={c.slug}
            id={c.slug}
            ref={(el) => {
              sectionRefs.current[c.slug] = el;
            }}
            className="scroll-mt-24"
          >
            <div className="flex items-center justify-between gap-4 mb-1">
              <h2 className="text-xl font-semibold">{c.name}</h2>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs text-muted">{c.category}</span>
                <StatusPill status={c.status} />
              </div>
            </div>
            <p className="text-subtle">{c.description}</p>
            <p className="text-sm text-mint mt-2">
              <span className="text-muted">Why — </span>
              {c.rationale}
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              {c.variants.map((v) => (
                <span
                  key={v}
                  className="text-xs rounded-full border border-shadow-border px-2 py-0.5 text-muted"
                >
                  {v}
                </span>
              ))}
            </div>

            <div className="mt-5 rounded-xl bg-shadow-card border border-shadow-border p-6">
              <ComponentPreview slug={c.slug} />
            </div>

            <button
              onClick={() => openHandoff(c.handoffFile)}
              className="mt-4 inline-flex items-center gap-1.5 text-sm text-amethyst hover:underline"
            >
              View Storybook handoff
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </article>
        ))}
      </div>

      <HandoffPanel open={panelOpen} file={panelFile} onClose={() => setPanelOpen(false)} />
    </div>
  );
}

function StatusPill({ status }: { status: "Stable" | "Beta" | "Deprecated" }) {
  const styles: Record<string, string> = {
    Stable: "bg-mint/10 text-mint border-mint/30",
    Beta: "bg-amethyst/10 text-amethyst border-amethyst/30",
    Deprecated: "bg-caption/10 text-muted border-shadow-border",
  };
  return <span className={`text-xs rounded-full border px-2 py-0.5 ${styles[status]}`}>{status}</span>;
}
