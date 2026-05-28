import Link from "next/link";
import { Logo } from "@/components/Logo";
import { Check, Sparkles } from "lucide-react";

const tiers = [
  { name: "Free", price: "$0", per: "/mo", features: ["3 AI trips per month", "Basic eco score", "Public safety data", "Community support"], cta: "Start free" },
  { name: "Plus", price: "$9", per: "/mo", features: ["Unlimited AI trips", "Live carbon offset", "Hotel & flight booking", "Priority support"], cta: "Upgrade", featured: true },
  { name: "Pro", price: "$24", per: "/mo", features: ["Plus features", "Group trips (up to 12)", "Concierge bookings", "API access"], cta: "Go Pro" }
];

export default function Pricing() {
  return (
    <div className="min-h-screen bg-bg">
      <header className="px-6 lg:px-12 h-16 flex items-center justify-between bg-white border-b border-line">
        <Link href="/"><Logo /></Link>
        <Link href="/app/planner" className="btn-primary text-sm">Open App</Link>
      </header>
      <section className="max-w-5xl mx-auto px-6 py-14">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="pill bg-brand-green-soft text-brand-green-600 mb-3"><Sparkles size={14}/> Simple pricing</span>
          <h1 className="text-3xl md:text-4xl font-extrabold">Plans that scale with your wanderlust</h1>
          <p className="text-muted mt-2">Start free. Upgrade when you're ready for unlimited.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {tiers.map((t) => (
            <div
              key={t.name}
              className={`card p-6 ${t.featured ? "ring-2 ring-brand-green-500 shadow-pop relative" : ""}`}
            >
              {t.featured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 pill bg-brand-green-500 text-white">Most popular</span>
              )}
              <p className="font-semibold">{t.name}</p>
              <p className="mt-1"><span className="text-3xl font-extrabold">{t.price}</span><span className="text-muted">{t.per}</span></p>
              <ul className="mt-4 space-y-2">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check size={16} className="text-brand-green-500 shrink-0 mt-0.5" /> {f}
                  </li>
                ))}
              </ul>
              <button className={`mt-6 w-full ${t.featured ? "btn-primary" : "btn-outline"}`}>{t.cta}</button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
