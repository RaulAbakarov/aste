"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
import { cn } from "@/lib/utils";

const nav = [
  { href: "/app/planner", label: "Planner", icon: Sparkles },
  { href: "/app/experiences", label: "Experiences", icon: Compass },
  { href: "/app/eco-travel", label: "Eco", icon: Leaf },
  { href: "/app/safety", label: "Safety", icon: ShieldCheck },
  { href: "/app/bookings", label: "Bookings", icon: Ticket },
  { href: "/app/saved", label: "Saved", icon: Bookmark },
  { href: "/app/profile", label: "Profile", icon: User },
  { href: "/app/help", label: "Help", icon: HelpCircle }
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-line">
      <div className="flex gap-2 px-2 py-1 overflow-x-auto no-scrollbar">
        {nav.map((item) => {
          const active = pathname?.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 py-2 px-2 text-[10px] font-medium min-w-[64px]",
                active ? "text-brand-green-600" : "text-muted"
              )}
            >
              <Icon size={18} strokeWidth={1.75} />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
