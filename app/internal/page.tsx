import { getServerSession } from "next-auth";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { ledger } from "@/content/ledger";

export default async function InternalHome() {
  const session = await getServerSession(authOptions);

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-semibold tracking-tight">
        Welcome{session?.user?.name ? `, ${session.user.name.split(" ")[0]}` : ""}.
      </h1>
      <p className="mt-2 text-subtle max-w-2xl">
        This is design governance HQ — the full ledger, in-progress rationale,
        and the AI Design Consultant. Nothing here is public.
      </p>

      <div className="mt-10 grid md:grid-cols-2 gap-6">
        <Link
          href="/internal/consultant"
          className="rounded-xl bg-shadow-card border border-shadow-border p-6 hover:border-amethyst transition-colors"
        >
          <h2 className="font-semibold text-lg mb-1">AI Design Consultant</h2>
          <p className="text-subtle text-sm">
            Ask about Venus components, WCAG requirements, or how to argue a
            design decision to stakeholders.
          </p>
        </Link>
        <div className="rounded-xl bg-shadow-card border border-shadow-border p-6">
          <h2 className="font-semibold text-lg mb-1">Full ledger</h2>
          <p className="text-subtle text-sm">{ledger.length} decisions recorded to date.</p>
        </div>
      </div>
    </div>
  );
}
