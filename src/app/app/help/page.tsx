import { PageHeader } from "@/components/PageHeader";

const faqs = [
  { q: "How does the AI itinerary generator work?", a: "We blend your dates, budget, and travel style with destination data and curated POIs to produce a structured day-by-day plan." },
  { q: "What is the Eco Score?", a: "A 0-100 number summarizing the carbon impact of your trip — transport, lodging, and activities — relative to a baseline trip." },
  { q: "Is my data private?", a: "Yes. ASTE is GDPR/CCPA compliant and lets you export or delete your data at any time." },
  { q: "Can I book directly?", a: "Plus and Pro members can book flights, hotels and experiences inside ASTE via our partners." }
];

export default function HelpPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <PageHeader title="Help & Support" subtitle="Answers to common questions. Need more? team@aste.travel" />
      <div className="space-y-3">
        {faqs.map((f) => (
          <details key={f.q} className="card p-4 group">
            <summary className="font-semibold cursor-pointer list-none flex items-center justify-between">
              {f.q}
              <span className="text-brand-green-500 group-open:rotate-45 transition-transform text-xl leading-none">+</span>
            </summary>
            <p className="text-muted mt-2 text-sm">{f.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
