import { Activity, Archive, CheckCircle2, Wrench } from "lucide-react";
import type { Asset } from "@/db/schema";

interface StatsBarProps {
	assets: Asset[];
}

export function StatsBar({ assets }: StatsBarProps) {
	const total = assets.length;
	const active = assets.filter((a) => a.status === "active").length;
	const assigned = assets.filter((a) => a.status === "assigned").length;
	const maintenance = assets.filter((a) => a.status === "maintenance").length;

	const stats = [
		{
			label: "Total Assets",
			value: total,
			icon: Archive,
			color: "text-muted-foreground",
			bg: "bg-muted/50",
			border: "border-border",
		},
		{
			label: "Active",
			value: active,
			icon: Activity,
			color: "text-emerald-400",
			bg: "bg-emerald-400/10",
			border: "border-emerald-400/20",
		},
		{
			label: "Assigned",
			value: assigned,
			icon: CheckCircle2,
			color: "text-primary",
			bg: "bg-primary/10",
			border: "border-primary/20",
		},
		{
			label: "Maintenance",
			value: maintenance,
			icon: Wrench,
			color: "text-amber-400",
			bg: "bg-amber-400/10",
			border: "border-amber-400/20",
		},
	];

	return (
		<div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
			{stats.map(({ label, value, icon: Icon, color, bg, border }) => (
				<div
					key={label}
					className={`flex items-center gap-4 rounded-lg border ${border} bg-card px-5 py-4`}
				>
					<div
						className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${bg}`}
					>
						<Icon className={`h-4 w-4 ${color}`} />
					</div>
					<div>
						<p className="font-mono text-2xl font-semibold tabular-nums text-foreground">
							{value}
						</p>
						<p className="text-xs text-muted-foreground">{label}</p>
					</div>
				</div>
			))}
		</div>
	);
}
