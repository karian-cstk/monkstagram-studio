"use client";

import { useEffect, useState } from "react";
import type { UIKitComponent } from "@/content/ui-kit";
import type { ChangelogEntry } from "@/content/changelog";
import type { IconEntry } from "@/content/icons-core";
import ComponentsExplorer from "./ComponentsExplorer";
import IconLibrary from "./IconLibrary";

const TABS = ["Components", "Icon Library", "Changelog"] as const;
type Tab = (typeof TABS)[number];

export default function UIKitTabs({
  components,
  changelog,
  icons,
}: {
  components: UIKitComponent[];
  changelog: ChangelogEntry[];
  icons: IconEntry[];
}) {
  const [tab, setTab] = useState<Tab>("Components");

  useEffect(() => {
    if (window.location.hash === "#changelog") setTab("Changelog");
    if (window.location.hash === "#icons") setTab("Icon Library");
  }, []);

  return (
    <div id="changelog">
      <div className="mt-10 flex gap-2 border-b border-shadow-border">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
              tab === t
                ? "border-amethyst text-crystal-clear"
                : "border-transparent text-muted hover:text-subtle"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Components" && <ComponentsExplorer components={components} />}

      {tab === "Icon Library" && <IconLibrary icons={icons} />}

      {tab === "Changelog" && (
        <ol className="mt-10 space-y-10">
          {changelog.map((entry) => (
            <li
              key={entry.version}
              className="grid md:grid-cols-[160px_1fr] gap-4 md:gap-8"
            >
              <div>
                <div className="ledger-line text-amethyst">v{entry.version}</div>
                <div className="ledger-line text-xs text-muted mt-1">{entry.date}</div>
              </div>
              <div className="border-l border-shadow-border pl-6">
                <h2 className="font-semibold text-lg">{entry.title}</h2>
                <p className="mt-2 text-subtle leading-relaxed">{entry.summary}</p>
                <div className="mt-3 flex gap-2 flex-wrap">
                  {entry.tags.map((t) => (
                    <span
                      key={t}
                      className="text-xs rounded-full border border-shadow-border px-2 py-0.5 text-muted"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
