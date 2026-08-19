import { upcoming } from "@/content/upcoming";

export const metadata = { title: "Upcoming Design — Monkstagram Studio" };

const STATUS_STYLES: Record<string, string> = {
  Exploring: "bg-caption/10 text-muted border-shadow-border",
  "In progress": "bg-amethyst/10 text-amethyst border-amethyst/30",
  Planned: "bg-mint/10 text-mint border-mint/30",
};

export default function UpcomingPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <p className="ledger-line text-sm text-amethyst tracking-widest uppercase mb-4">
        Upcoming Design
      </p>
      <h1 className="text-3xl md:text-4xl font-semibold tracking-tight max-w-2xl">
        What we&rsquo;re building next.
      </h1>
      <p className="mt-4 max-w-2xl text-subtle">
        The roadmap, in the open — what&rsquo;s exploratory, what&rsquo;s
        committed, and roughly when it lands.
      </p>

      <ol className="mt-12 space-y-6">
        {upcoming.map((item) => (
          <li
            key={item.title}
            className="rounded-xl bg-shadow-card border border-shadow-border p-6"
          >
            <div className="flex items-center justify-between gap-4 mb-2">
              <h2 className="font-semibold text-lg">{item.title}</h2>
              <span
                className={`text-xs rounded-full border px-2 py-0.5 shrink-0 ${STATUS_STYLES[item.status]}`}
              >
                {item.status}
              </span>
            </div>
            <p className="text-subtle leading-relaxed">{item.description}</p>
            <p className="ledger-line text-xs text-muted mt-3">{item.eta}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
