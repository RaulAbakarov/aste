"use client";
import {
  Sparkles,
  Compass,
  Leaf,
  ShieldCheck,
  Ticket,
  Bookmark,
  User,
  HelpCircle
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const top = [
  { href: "/app/planner", label: "Planner", icon: Sparkles },
  { href: "/app/experiences", label: "Experiences", icon: Compass },
  { href: "/app/eco-travel", label: "Eco", icon: Leaf },
  { href: "/app/safety", label: "Safety", icon: ShieldCheck },
  { href: "/app/bookings", label: "Bookings", icon: Ticket },
  { href: "/app/saved", label: "Saved", icon: Bookmark },
  { href: "/app/profile", label: "Profile", icon: User }
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="hidden md:flex w-[88px] flex-col items-center bg-brand-ink text-white py-5 shrink-0 sticky top-0 h-screen">
      <Link href="/app/planner" className="mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 via-emerald-400 to-violet-500 flex items-center justify-center font-extrabold text-brand-ink">
          A
        </div>
      </Link>
      <nav className="flex flex-col gap-1 flex-1 w-full px-2">
        {top.map((item) => {
          const active = pathname?.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 py-2.5 rounded-xl transition-all relative",
                active
                  ? "bg-brand-green-500/15 text-brand-green-500 shadow-[inset_0_0_0_1px_rgba(34,197,94,0.35)]"
                  : "text-white/70 hover:text-white hover:bg-white/5"
              )}
            >
              <Icon size={20} strokeWidth={1.75} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <Link
        href="/app/help"
        className="text-white/60 hover:text-white flex flex-col items-center gap-1 py-2"
      >
        <HelpCircle size={20} strokeWidth={1.75} />
        <span className="text-[10px]">Help</span>
      </Link>
    </aside>
  );
}
