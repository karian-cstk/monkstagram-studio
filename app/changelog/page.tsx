import { changelog } from "@/content/changelog";

export const metadata = { title: "Changelog — Monkstagram Studio" };

export default function ChangelogPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <p className="ledger-line text-sm text-amethyst tracking-widest uppercase mb-4">Changelog</p>
      <h1 className="text-3xl md:text-4xl font-semibold tracking-tight max-w-2xl">
        What changed, and when.
      </h1>

      <ol className="mt-12 space-y-10">
        {changelog.map((entry) => (
          <li key={entry.version} className="grid md:grid-cols-[160px_1fr] gap-4 md:gap-8">
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
    </div>
  );
}
