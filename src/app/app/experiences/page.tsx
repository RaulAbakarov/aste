"use client";
import { PageHeader } from "@/components/PageHeader";
import { Star, Clock } from "lucide-react";
import { useState } from "react";
import { Modal } from "@/components/Modal";

const items = [
  { title: "Cappadocia Hot Air Balloon", price: 220, photo: "https://images.unsplash.com/photo-1641128324972-af3212f0f6bd?auto=format&fit=crop&w=900&q=80", rating: 4.9, dur: "3h", loc: "Türkiye" },
  { title: "Kyoto Tea Ceremony", price: 75, photo: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?auto=format&fit=crop&w=900&q=80", rating: 4.8, dur: "1.5h", loc: "Japan" },
  { title: "Santorini Catamaran Cruise", price: 165, photo: "https://images.unsplash.com/photo-1571419768329-5b29ea03fef6?auto=format&fit=crop&w=900&q=80", rating: 4.7, dur: "5h", loc: "Greece" },
  { title: "Marrakech Souk & Food Tour", price: 55, photo: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=900&q=80", rating: 4.7, dur: "4h", loc: "Morocco" },
  { title: "Reykjavik Northern Lights", price: 140, photo: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=900&q=80", rating: 4.6, dur: "4h", loc: "Iceland" },
  { title: "Bali Sunrise Volcano Trek", price: 65, photo: "https://images.unsplash.com/photo-1505228395891-9a51e7e86bf6?auto=format&fit=crop&w=900&q=80", rating: 4.8, dur: "6h", loc: "Indonesia" },
  { title: "Lisbon Tuk-tuk Tour", price: 45, photo: "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?auto=format&fit=crop&w=900&q=80", rating: 4.6, dur: "2h", loc: "Portugal" },
  { title: "NYC Helicopter Skyline", price: 280, photo: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=900&q=80", rating: 4.9, dur: "30m", loc: "USA" }
];

export default function ExperiencesPage() {
  const [selected, setSelected] = useState<(typeof items)[0] | null>(null);
  return (
    <div className="max-w-7xl mx-auto">
      <PageHeader title="Experiences" subtitle="Hand-picked tours, activities, and tastings from local hosts." />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((e) => (
          <button
            key={e.title}
            onClick={() => setSelected(e)}
            className="card overflow-hidden hover:shadow-pop transition cursor-pointer text-left"
          >
            <img src={e.photo} alt={e.title} className="w-full h-40 object-cover" />
            <div className="p-3.5">
              <p className="text-xs text-muted">{e.loc}</p>
              <p className="font-semibold leading-snug line-clamp-2 mt-0.5">{e.title}</p>
              <div className="flex items-center gap-3 text-xs text-muted mt-1.5">
                <span className="flex items-center gap-1"><Star size={12} className="fill-amber-400 text-amber-400"/> {e.rating}</span>
                <span className="flex items-center gap-1"><Clock size={12}/> {e.dur}</span>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <p className="font-bold">${e.price}</p>
                <span className="btn-primary text-xs px-3 py-1.5">Book</span>
              </div>
            </div>
          </button>
        ))}
      </div>

      <Modal open={!!selected} title={selected?.title ?? "Experience"} onClose={() => setSelected(null)}>
        {selected && (
          <div className="space-y-3">
            <img src={selected.photo} alt={selected.title} className="w-full h-44 object-cover rounded-xl" />
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted">{selected.loc} · {selected.dur}</span>
              <span className="font-semibold">${selected.price}</span>
            </div>
            <button className="btn-primary w-full">Book experience</button>
          </div>
        )}
      </Modal>
    </div>
  );
}
