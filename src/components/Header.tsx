"use client";
import Link from "next/link";
import { Heart, Search, ChevronDown } from "lucide-react";
import { Logo } from "./Logo";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/app", label: "Home" },
  { href: "/app/experiences", label: "Explore" },
  { href: "/app/experiences", label: "Experiences" },
  { href: "/app/eco-travel", label: "Eco Travel" },
  { href: "/app/safety", label: "Safety" },
  { href: "/pricing", label: "Pricing" }
];

export function Header() {
  const pathname = usePathname();
  return (
    <header className="bg-white border-b border-line sticky top-0 z-30">
      <div className="px-6 h-16 flex items-center justify-between gap-6">
        <Link href="/app/planner" className="flex items-center">
          <Logo size={30} />
        </Link>
        <nav className="hidden lg:flex items-center gap-1">
          {nav.map((n, i) => (
            <Link
              key={i}
              href={n.href}
              className={cn(
                "px-3 py-2 rounded-btn text-sm font-medium transition",
                (n.href === "/app" ? pathname === "/app" : pathname?.startsWith(n.href))
                  ? "text-brand-ink bg-bg"
                  : "text-muted hover:text-brand-ink hover:bg-bg"
              )}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <button
            aria-label="Search"
            className="w-9 h-9 rounded-full hover:bg-bg flex items-center justify-center text-muted"
          >
            <Search size={18} />
          </button>
          <button
            aria-label="Favorites"
            className="w-9 h-9 rounded-full hover:bg-bg flex items-center justify-center text-muted"
          >
            <Heart size={18} />
          </button>
          <button className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full hover:bg-bg">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-green-500 to-brand-blue-500 text-white flex items-center justify-center font-bold text-xs">
              EA
            </div>
            <ChevronDown size={14} className="text-muted" />
          </button>
        </div>
      </div>
    </header>
  );
}
