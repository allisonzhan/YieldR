import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "YieldR | Swipe. Chat. Invest.",
  description: "Stock discovery with swipe interactions, AI chat, and leaderboards.",
};

const navItems = [
  { href: "/", label: "Swipe Deck" },
  { href: "/inbox", label: "Inbox" },
  { href: "/leaderboard", label: "Leaderboard" },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-slate-100">
        <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 pb-10 pt-6 sm:px-8">
          <header className="flex flex-col gap-4 border-b border-white/5 pb-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.4em] text-slate-400">StockR</p>
              <h1 className="text-3xl font-semibold text-slate-50">Swipe. Chat. Lead.</h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-400">
                Discover equities through a Tinder-inspired deck, save favorites to your inbox,
                and interrogate them with a dedicated AI co-pilot.
              </p>
            </div>

            <nav className="flex flex-wrap gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-full border border-white/10 px-5 py-2 text-sm font-medium text-slate-300 transition hover:border-white/40 hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </header>

          <main className="flex-1 py-8">{children}</main>
        </div>
      </body>
    </html>
  );
}
