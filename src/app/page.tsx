import Link from "next/link";
import { Logo } from "@/components/Logo";
import { Sparkles, Leaf, ShieldCheck, ArrowRight, CheckCircle2 } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-bg to-white">
      <header className="px-6 lg:px-12 h-16 flex items-center justify-between">
        <Logo />
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link href="/app/experiences" className="text-muted hover:text-brand-ink">Explore</Link>
          <Link href="/app/eco-travel" className="text-muted hover:text-brand-ink">Eco</Link>
          <Link href="/app/safety" className="text-muted hover:text-brand-ink">Safety</Link>
          <Link href="/pricing" className="text-muted hover:text-brand-ink">Pricing</Link>
        </nav>
        <Link href="/app/planner" className="btn-primary text-sm">
          Open App <ArrowRight size={16} />
        </Link>
      </header>

      <section className="px-6 lg:px-12 pt-12 pb-20 max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="pill bg-brand-green-soft text-brand-green-600 mb-5">
              <Sparkles size={14} /> AI Smart Travel Ecosystem
            </div>
            <h1 className="text-3xl md:text-[44px] leading-tight font-extrabold text-brand-ink">
              Plan your perfect trip <span className="text-brand-green-500">with AI.</span>
            </h1>
            <p className="mt-5 text-md text-muted max-w-lg">
              Personalized multi-day itineraries, live eco impact scoring, and real-time safety
              intelligence — all in one beautifully simple workspace.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/app/planner" className="btn-primary">
                <Sparkles size={16} /> Generate My Trip Plan
              </Link>
              <Link href="/pricing" className="btn-outline">See pricing</Link>
            </div>
            <ul className="mt-8 grid sm:grid-cols-2 gap-3 text-sm text-brand-ink">
              {[
                "Day-by-day plans in seconds",
                "Eco score & carbon footprint",
                "Geo-localized safety center",
                "Budget you can actually trust"
              ].map((b) => (
                <li key={b} className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-brand-green-500" /> {b}
                </li>
              ))}
            </ul>
          </div>
          <div className="card p-3">
            <img
              src="https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1200&q=80"
              alt="Travel preview"
              className="rounded-xl w-full h-[420px] object-cover"
            />
          </div>
        </div>
      </section>

      <section className="px-6 lg:px-12 pb-20 max-w-6xl mx-auto grid md:grid-cols-3 gap-5">
        {[
          { icon: Sparkles, t: "AI Itinerary", d: "Destination, budget, and style-aware day-by-day plans." },
          { icon: Leaf, t: "Eco Score", d: "Carbon footprint, green tips, and offset options." },
          { icon: ShieldCheck, t: "Safety Center", d: "Local emergency numbers, hospitals, and safe zones." }
        ].map((f, i) => {
          const Ic = f.icon;
          return (
            <div key={i} className="card p-6">
              <div className="w-10 h-10 rounded-xl bg-brand-green-soft flex items-center justify-center text-brand-green-600 mb-3">
                <Ic size={20} />
              </div>
              <h3 className="font-semibold text-lg">{f.t}</h3>
              <p className="text-muted mt-1">{f.d}</p>
            </div>
          );
        })}
      </section>

      <footer className="px-6 lg:px-12 py-8 border-t border-line text-center text-xs text-faint">
        © {new Date().getFullYear()} ASTE — AI Smart Travel Ecosystem. All rights reserved.
      </footer>
    </div>
  );
}
