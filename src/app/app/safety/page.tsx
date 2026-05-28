import { PageHeader } from "@/components/PageHeader";
import { ShieldCheck, Phone, Hospital, Siren, Globe } from "lucide-react";

const countries = [
  { c: "Türkiye", emerg: "112", level: "Safe", score: 78 },
  { c: "Japan", emerg: "110", level: "Very Safe", score: 92 },
  { c: "France", emerg: "112", level: "Safe", score: 74 },
  { c: "Spain", emerg: "112", level: "Safe", score: 76 },
  { c: "USA", emerg: "911", level: "Caution", score: 62 },
  { c: "Indonesia", emerg: "112", level: "Safe", score: 71 }
];

export default function SafetyPage() {
  return (
    <div className="max-w-6xl mx-auto">
      <PageHeader title="Global Safety Dashboard" subtitle="Country safety scores, emergency numbers, and live advisories." />

      <div className="grid md:grid-cols-3 gap-3 mb-5">
        <Tile icon={<ShieldCheck size={18} />} title="Safe Zone Coverage" value="184 countries" />
        <Tile icon={<Phone size={18} />} title="Emergency DB" value="290+ regions" />
        <Tile icon={<Globe size={18} />} title="Live Advisories" value="US, UK, CA, AU" />
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-bg text-muted text-xs uppercase">
            <tr>
              <th className="text-left p-3">Country</th>
              <th className="text-left p-3">Emergency</th>
              <th className="text-left p-3">Level</th>
              <th className="text-left p-3">Score</th>
            </tr>
          </thead>
          <tbody>
            {countries.map((r) => (
              <tr key={r.c} className="border-t border-line">
                <td className="p-3 font-medium">{r.c}</td>
                <td className="p-3"><span className="pill bg-brand-blue-soft text-brand-blue-500">{r.emerg}</span></td>
                <td className="p-3">
                  <span className={`pill ${r.level === "Caution" ? "bg-amber-100 text-amber-700" : "bg-brand-green-soft text-brand-green-600"}`}>
                    {r.level}
                  </span>
                </td>
                <td className="p-3 font-semibold">{r.score}/100</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Tile({ icon, title, value }: { icon: React.ReactNode; title: string; value: string }) {
  return (
    <div className="card p-5 flex items-center gap-3">
      <div className="w-11 h-11 rounded-xl bg-brand-blue-soft text-brand-blue-500 flex items-center justify-center">
        {icon}
      </div>
      <div>
        <p className="text-xs text-muted">{title}</p>
        <p className="font-bold text-lg">{value}</p>
      </div>
    </div>
  );
}
