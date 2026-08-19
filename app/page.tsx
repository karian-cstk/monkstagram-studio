import Link from "next/link";
import Image from "next/image";
import { ledger } from "@/content/ledger";
import { uiKitComponents } from "@/content/ui-kit";
import { changelog } from "@/content/changelog";
import TeamSection from "./TeamSection";
import HeroSky from "./HeroSky";

export default function Home() {
  return (
    <div>
      {/* Hero — the whole thesis in a single breath */}
      <section className="relative min-h-[calc(100svh-65px)] w-full overflow-hidden flex items-center justify-center py-16">
        <div aria-hidden className="hero-base" />
        <div aria-hidden className="hero-stars-far" />
        <div aria-hidden className="hero-stars-near" />
        <HeroSky />
        <div aria-hidden className="hero-vignette" />

        <div className="relative z-10 flex flex-col items-center text-center px-6 gap-5">
          <p className="label-eyebrow text-xs text-periwinkle uppercase">
            7 Years Old &middot; Blended &middot; Contentstack
          </p>
          <div className="relative flex flex-col items-center">
            <div aria-hidden className="bottle-glow" />
            <Image
              src="/design-monks-bottle.png"
              alt="Design Monks — 7 Years Old Blended"
              width={592}
              height={574}
              priority
              className="bottle-float bottle-blend relative w-[clamp(220px,40vmin,560px)] h-auto drop-shadow-[0_20px_60px_rgba(196,67,46,0.35)]"
            />
            <div
              aria-hidden
              className="bottle-reflection-wrap w-[clamp(220px,40vmin,560px)] overflow-hidden -mt-1"
              style={{ height: "clamp(40px,8vmin,110px)" }}
            >
              <Image
                aria-hidden
                src="/design-monks-bottle.png"
                alt=""
                width={592}
                height={574}
                className="bottle-reflection w-full h-auto"
              />
            </div>
          </div>
          <h1 className="font-display font-extrabold tracking-tight leading-[1.15] text-[clamp(30px,6.2vh,68px)]">
            Design
            <br />
            <span className="text-amethyst-accessible">Ascendancy</span>
          </h1>
          <p className="max-w-lg text-subtle leading-relaxed text-[clamp(13px,1.8vh,18px)]">
            Monkstagram Studio is Contentstack design&rsquo;s public ledger:
            what we built, why we built it that way, and where AI did the
            heavy lifting. It&rsquo;s also home to the Venus UI Kit, its
            changelog, and — for our own designers only — a governance
            portal and an AI consultant trained on our system.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-2">
            <Link
              href="/ui-kit"
              className="rounded-full bg-amethyst text-on-accent font-medium px-6 py-3 hover:opacity-90 transition-opacity"
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
                <div className="ledger-line text-sm text-amethyst-accessible">{entry.date}</div>
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
            <Link href="/ui-kit" className="text-sm text-amethyst-accessible hover:underline">
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
            <Link href="/ui-kit#changelog" className="text-sm text-amethyst-accessible hover:underline">
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
    Beta: "bg-amethyst/10 text-amethyst-accessible border-amethyst/30",
    Deprecated: "bg-caption/10 text-muted border-shadow-border",
  };
  return (
    <span className={`text-xs rounded-full border px-2 py-0.5 ${styles[status]}`}>{status}</span>
  );
}
