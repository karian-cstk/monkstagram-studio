import Link from "next/link";
import Image from "next/image";
import { ledger } from "@/content/ledger";
import { uiKitComponents } from "@/content/ui-kit";
import { changelog } from "@/content/changelog";
import TeamSection from "./TeamSection";

export default function Home() {
  return (
    <div>
      {/* Hero — the thesis, built around the Design Monks label */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 50% 20%, rgba(196,67,46,0.14), transparent 70%), radial-gradient(ellipse 50% 40% at 80% 10%, rgba(200,162,74,0.10), transparent 70%)",
          }}
        />
        <div className="relative max-w-6xl mx-auto px-6 pt-16 pb-8 grid md:grid-cols-[1fr_320px] gap-12 items-center">
          <div>
            <p className="label-eyebrow text-xs text-periwinkle uppercase mb-4">
              7 Years Old &middot; Blended &middot; Contentstack
            </p>
            <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tight leading-[1.02]">
              Design
              <br />
              <span className="text-amethyst">Ascendancy</span>
            </h1>
            <p className="mt-6 max-w-lg text-lg text-subtle leading-relaxed">
              Monkstagram Studio is Contentstack design&rsquo;s public ledger:
              what we built, why we built it that way, and where AI did the
              heavy lifting. It&rsquo;s also home to the Venus UI Kit, its
              changelog, and — for our own designers only — a governance
              portal and an AI consultant trained on our system.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/ui-kit"
                className="rounded-full bg-amethyst text-shadow-heavy font-medium px-6 py-3 hover:opacity-90 transition-opacity"
              >
                Browse the UI Kit
              </Link>
              <Link
                href="/changelog"
                className="rounded-full border border-shadow-border px-6 py-3 hover:border-amethyst transition-colors"
              >
                Read the changelog
              </Link>
            </div>
          </div>
          <div className="justify-self-center">
            <Image
              src="/design-monks-bottle.png"
              alt="Design Monks — 7 Years Old Blended"
              width={320}
              height={480}
              priority
              className="drop-shadow-[0_20px_60px_rgba(196,67,46,0.25)]"
            />
          </div>
        </div>
      </section>

      <TeamSection />

      {/* The Ledger — signature element */}
      <section className="border-t border-shadow-border">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="flex items-baseline justify-between mb-10">
            <h2 className="text-2xl font-semibold">The Ledger</h2>
            <span className="text-sm text-muted">Recent design decisions, reasoned in full</span>
          </div>
          <ol className="space-y-8">
            {ledger.map((entry) => (
              <li key={entry.date} className="grid md:grid-cols-[120px_1fr] gap-4 md:gap-8">
                <div className="ledger-line text-sm text-amethyst">{entry.date}</div>
                <div className="border-l border-shadow-border pl-6">
                  <h3 className="font-semibold text-lg">{entry.decision}</h3>
                  <p className="mt-2 text-subtle leading-relaxed">{entry.rationale}</p>
                  <p className="mt-3 text-sm text-mint">
                    <span className="text-muted">AI&rsquo;s role — </span>
                    {entry.aiRole}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* UI Kit teaser */}
      <section className="border-t border-shadow-border">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="flex items-baseline justify-between mb-10">
            <h2 className="text-2xl font-semibold">Venus UI Kit</h2>
            <Link href="/ui-kit" className="text-sm text-amethyst hover:underline">
              View all components →
            </Link>
          </div>
          <div className="grid md:grid-cols-4 gap-4">
            {uiKitComponents.slice(0, 4).map((c) => (
              <div key={c.name} className="rounded-xl bg-shadow-card border border-shadow-border p-5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">{c.name}</h3>
                  <StatusPill status={c.status} />
                </div>
                <p className="text-sm text-subtle">{c.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Changelog teaser */}
      <section className="border-t border-shadow-border">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="flex items-baseline justify-between mb-10">
            <h2 className="text-2xl font-semibold">Latest changes</h2>
            <Link href="/changelog" className="text-sm text-amethyst hover:underline">
              Full changelog →
            </Link>
          </div>
          <ul className="space-y-4">
            {changelog.slice(0, 3).map((entry) => (
              <li key={entry.version} className="flex gap-4">
                <span className="ledger-line text-sm text-muted w-16 shrink-0">v{entry.version}</span>
                <span>{entry.title}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}

function StatusPill({ status }: { status: "Stable" | "Beta" | "Deprecated" }) {
  const styles: Record<string, string> = {
    Stable: "bg-mint/10 text-mint border-mint/30",
    Beta: "bg-amethyst/10 text-amethyst border-amethyst/30",
    Deprecated: "bg-caption/10 text-muted border-shadow-border",
  };
  return (
    <span className={`text-xs rounded-full border px-2 py-0.5 ${styles[status]}`}>{status}</span>
  );
}
