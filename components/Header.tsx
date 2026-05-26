"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LanguageToggle from "@/components/LanguageToggle";
import NotificationButton from "@/components/NotificationButton";

const NAV = [
  { href: "/", label: "Today" },
  { href: "/broadcast", label: "播報" },
  { href: "/settings", label: "Settings" },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-white/5">
      <div className="max-w-xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="shrink-0">
          <span className="font-display text-lg font-bold text-white tracking-tight">
            StartupLens
          </span>
        </Link>

        {/* Nav */}
        <nav className="flex items-center gap-1 text-sm">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                pathname === n.href
                  ? "text-white bg-white/10"
                  : "text-white/50 hover:text-white hover:bg-white/5"
              }`}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3 shrink-0">
          <LanguageToggle />
          <NotificationButton />
        </div>
      </div>
    </header>
  );
}
