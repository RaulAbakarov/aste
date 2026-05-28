import { PageHeader } from "@/components/PageHeader";
import { Plane, Hotel, Ticket } from "lucide-react";

const bookings = [
  { type: "Flight", t: "IST → CDG", date: "2026-06-12", price: 412, status: "Confirmed", icon: Plane },
  { type: "Hotel", t: "Le Marais Boutique · 4 nights", date: "2026-06-12", price: 720, status: "Confirmed", icon: Hotel },
  { type: "Experience", t: "Seine River Cruise", date: "2026-06-14", price: 36, status: "Confirmed", icon: Ticket }
];

export default function BookingsPage() {
  return (
    <div className="max-w-5xl mx-auto">
      <PageHeader title="My Bookings" subtitle="Flights, stays, and experiences in one place." />
      <div className="space-y-3">
        {bookings.map((b, i) => {
          const Icon = b.icon;
          return (
            <div key={i} className="card p-4 flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-brand-green-soft text-brand-green-600 flex items-center justify-center">
                <Icon size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold">{b.t}</p>
                <p className="text-xs text-muted">{b.type} · {b.date}</p>
              </div>
              <div className="text-right">
                <p className="font-bold">${b.price}</p>
                <span className="pill bg-brand-green-soft text-brand-green-600">{b.status}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
