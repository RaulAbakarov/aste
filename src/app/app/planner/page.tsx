"use client";
import { PlannerForm } from "@/components/planner/PlannerForm";
import { TripDisplay } from "@/components/trip/TripDisplay";
import { EcoWidget } from "@/components/widgets/EcoWidget";
import { SafetyWidget } from "@/components/widgets/SafetyWidget";
import { ExperiencesWidget } from "@/components/widgets/ExperiencesWidget";

export default function PlannerPage() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 max-w-[1480px] mx-auto">
      <div className="lg:col-span-3">
        <PlannerForm />
      </div>
      <div className="lg:col-span-6">
        <TripDisplay />
      </div>
      <div className="lg:col-span-3 space-y-4">
        <EcoWidget />
        <SafetyWidget />
        <ExperiencesWidget />
      </div>
    </div>
  );
}
