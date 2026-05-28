import { PageHeader } from "@/components/PageHeader";
import { Leaf } from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="max-w-3xl mx-auto">
      <PageHeader title="Profile" subtitle="Account, preferences, payment and eco goals." />
      <div className="card p-6 flex items-center gap-4 mb-4">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brand-green-500 to-brand-blue-500 text-white flex items-center justify-center font-bold text-xl">
          EA
        </div>
        <div className="flex-1">
          <p className="font-bold text-lg">Elvin A.</p>
          <p className="text-muted text-sm">elvin@aste.travel · Plus Plan</p>
        </div>
        <button className="btn-outline">Edit</button>
      </div>

      <div className="card p-6">
        <div className="flex items-center gap-2 mb-3">
          <Leaf className="text-brand-green-500" size={18} />
          <p className="font-semibold">Eco Goal — 2026</p>
        </div>
        <p className="text-muted text-sm mb-2">Target: stay under <strong>800 kg CO₂</strong> from travel this year.</p>
        <div className="h-3 rounded-pill bg-bg overflow-hidden">
          <div className="h-full bg-brand-green-500 rounded-pill" style={{ width: "42%" }} />
        </div>
        <p className="text-xs text-muted mt-2">336 / 800 kg used so far</p>
      </div>
    </div>
  );
}
