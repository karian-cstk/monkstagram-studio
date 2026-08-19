import { uiKitComponents } from "@/content/ui-kit";

export const metadata = { title: "UI Kit — Monkstagram Studio" };

export default function UIKitPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <p className="ledger-line text-sm text-amethyst tracking-widest uppercase mb-4">
        Venus UI Kit
      </p>
      <h1 className="text-3xl md:text-4xl font-semibold tracking-tight max-w-2xl">
        Every component, and why it exists.
      </h1>
      <p className="mt-4 max-w-2xl text-subtle">
        This is the public face of Venus, our internal design system. Each entry
        includes the rationale behind it — not just what it does.
      </p>

      <div className="mt-12 grid md:grid-cols-2 gap-6">
        {uiKitComponents.map((c) => (
          <article key={c.name} className="rounded-xl bg-shadow-card border border-shadow-border p-6">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-lg font-semibold">{c.name}</h2>
              <span className="text-xs text-muted">{c.category}</span>
            </div>
            <p className="text-subtle mb-4">{c.description}</p>
            <p className="text-sm text-mint">
              <span className="text-muted">Why — </span>
              {c.rationale}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
