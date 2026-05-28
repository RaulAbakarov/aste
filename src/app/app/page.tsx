import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { Sparkles, Leaf, ShieldCheck, ArrowRight, Plane } from "lucide-react";

const quick = [
	{
		title: "Continue planning",
		desc: "Generate a new AI itinerary in seconds.",
		href: "/app/planner",
		icon: Sparkles
	},
	{
		title: "Eco Travel Hub",
		desc: "Low-carbon tips and certified stays.",
		href: "/app/eco-travel",
		icon: Leaf
	},
	{
		title: "Safety Center",
		desc: "Emergency numbers and safe-zone status.",
		href: "/app/safety",
		icon: ShieldCheck
	}
];

export default function AppRoot() {
	return (
		<div className="max-w-6xl mx-auto">
			<PageHeader
				title="Welcome back"
				subtitle="Your AI travel workspace is ready. Pick up where you left off."
			/>

			<div className="grid md:grid-cols-3 gap-4 mb-6">
				{quick.map((q) => {
					const Icon = q.icon;
					return (
						<Link key={q.title} href={q.href} className="card p-5 hover:shadow-pop transition">
							<div className="w-11 h-11 rounded-xl bg-brand-green-soft text-brand-green-600 flex items-center justify-center mb-3">
								<Icon size={20} />
							</div>
							<p className="font-semibold">{q.title}</p>
							<p className="text-sm text-muted mt-1">{q.desc}</p>
							<span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-green-600">
								Open <ArrowRight size={14} />
							</span>
						</Link>
					);
				})}
			</div>

			<div className="card p-6 flex flex-col md:flex-row items-center justify-between gap-4">
				<div className="flex items-center gap-3">
					<div className="w-12 h-12 rounded-2xl bg-brand-green-soft text-brand-green-600 flex items-center justify-center">
						<Plane size={22} />
					</div>
					<div>
						<p className="font-semibold">Next trip: Istanbul — 5 days</p>
						<p className="text-sm text-muted">Eco score 82 · Budget $1,200</p>
					</div>
				</div>
				<Link href="/app/planner" className="btn-primary">Resume trip</Link>
			</div>
		</div>
	);
}
