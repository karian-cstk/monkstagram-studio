import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import "./globals.css";

export const metadata: Metadata = {
  title: "Design Monks — Design Ascendancy",
  description:
    "How Contentstack's design team makes decisions, governs its system, and uses AI to do both — in the open.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <header className="border-b border-shadow-border">
          <nav className="max-w-6xl mx-auto flex items-center justify-between px-4 sm:px-6 h-16">
            <Link href="/" className="flex items-center gap-2 sm:gap-3 shrink-0">
              <Image src="/logomark.svg" alt="" width={20} height={24} priority />
              <span className="hidden sm:inline font-semibold tracking-tight whitespace-nowrap">
                Monkstagram Studio
              </span>
            </Link>
            <div className="flex items-center gap-4 sm:gap-6 text-sm text-subtle">
              <Link href="/leaderboard" className="hidden md:inline hover:text-crystal-clear transition-colors">
                Design Leaderboard
              </Link>
              <Link href="/ui-kit" className="hidden md:inline hover:text-crystal-clear transition-colors">
                UI Kit
              </Link>
              <Link href="/upcoming" className="hidden md:inline hover:text-crystal-clear transition-colors">
                Upcoming Design
              </Link>
              <Link href="/blog" className="hidden md:inline hover:text-crystal-clear transition-colors">
                Blogs
              </Link>
              <Link
                href="/internal"
                className="rounded-full border border-amethyst px-3 sm:px-4 py-1.5 text-amethyst hover:bg-amethyst hover:text-shadow-heavy transition-colors whitespace-nowrap"
              >
                <span className="hidden sm:inline">Designer sign-in</span>
                <span className="sm:hidden">Sign in</span>
              </Link>
            </div>
          </nav>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-shadow-border">
          <div className="max-w-6xl mx-auto px-6 py-8 flex items-center justify-between text-xs text-caption">
            <span>© 2026 Contentstack. Monkstagram Studio is an internal design-governance project.</span>
            <span>Built with Venus 2.1 RF</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
