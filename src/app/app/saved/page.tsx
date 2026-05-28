import { PageHeader } from "@/components/PageHeader";
import { Heart } from "lucide-react";

const saved = [
  { dest: "Istanbul, Türkiye", days: 5, photo: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=900&q=80" },
  { dest: "Paris, France", days: 4, photo: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=900&q=80" },
  { dest: "Tokyo, Japan", days: 7, photo: "https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=900&q=80" },
  { dest: "Barcelona, Spain", days: 4, photo: "https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=900&q=80" }
];

export default function SavedPage() {
  return (
    <div className="max-w-6xl mx-auto">
      <PageHeader title="Saved Trips" subtitle="Drafts and favorites you can revisit anytime." />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {saved.map((t) => (
          <div key={t.dest} className="card overflow-hidden hover:shadow-pop cursor-pointer">
            <div className="relative">
              <img src={t.photo} className="w-full h-36 object-cover" alt={t.dest} />
              <Heart className="absolute top-3 right-3 text-white fill-red-500" size={18} />
            </div>
            <div className="p-3">
              <p className="font-semibold">{t.dest}</p>
              <p className="text-xs text-muted">{t.days}-day itinerary</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
