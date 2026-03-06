import {
	Activity,
	Archive,
	CheckCircle2,
	Package,
	TrendingUp,
	Wrench,
	XCircle,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { getAssets } from "@/features/assets/queries";

const STATUS_CONFIG = {
	active: {
		label: "Active",
		color: "text-emerald-400",
		bg: "bg-emerald-400/10",
		border: "border-emerald-400/20",
		barClass: "bg-emerald-400",
		icon: Activity,
	},
	assigned: {
		label: "Assigned",
		color: "text-primary",
		bg: "bg-primary/10",
		border: "border-primary/20",
		barClass: "bg-primary",
		icon: CheckCircle2,
	},
	maintenance: {
		label: "Maintenance",
		color: "text-amber-400",
		bg: "bg-amber-400/10",
		border: "border-amber-400/20",
		barClass: "bg-amber-400",
		icon: Wrench,
	},
	inactive: {
		label: "Inactive",
		color: "text-muted-foreground",
		bg: "bg-muted/50",
		border: "border-border",
		barClass: "bg-muted-foreground",
		icon: XCircle,
	},
	retired: {
		label: "Retired",
		color: "text-destructive",
		bg: "bg-destructive/10",
		border: "border-destructive/20",
		barClass: "bg-destructive",
		icon: Archive,
	},
} as const;

const CATEGORY_LABELS: Record<string, string> = {
	laptop: "Laptop",
	monitor: "Monitor",
	license: "License",
	peripheral: "Peripheral",
	server: "Server",
	mobile: "Mobile",
	other: "Other",
};

export default async function DashboardPage() {
	const assets = await getAssets();

	const total = assets.length;
	const byStatus = Object.fromEntries(
		(["active", "assigned", "maintenance", "inactive", "retired"] as const).map(
			(s) => [s, assets.filter((a) => a.status === s).length],
		),
	);
	const byCategory = assets.reduce<Record<string, number>>((acc, a) => {
		acc[a.category] = (acc[a.category] ?? 0) + 1;
		return acc;
	}, {});

	const sortedCategories = Object.entries(byCategory).sort(
		([, a], [, b]) => b - a,
	);
	const maxCategoryCount = sortedCategories[0]?.[1] ?? 0;

	const recent = assets.slice(0, 8);

	const activeRate =
		total > 0 ? Math.round((byStatus.active / total) * 100) : 0;

	return (
		<div className="flex flex-col gap-6">
			{/* Header */}
			<div>
				<h1 className="font-mono text-xl font-semibold tracking-tight text-foreground">
					Overview
				</h1>
				<p className="mt-0.5 text-sm text-muted-foreground">
					Asset health and inventory summary
				</p>
			</div>

			{/* KPI Cards */}
			<div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
				<Card className="col-span-2 sm:col-span-1 lg:col-span-1 border-border bg-card">
					<CardContent className="p-4">
						<div className="flex items-start justify-between">
							<div>
								<p className="text-xs text-muted-foreground">Total Assets</p>
								<p className="mt-1 font-mono text-3xl font-bold tabular-nums text-foreground">
									{total}
								</p>
							</div>
							<div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted/50">
								<Package className="h-4 w-4 text-muted-foreground" />
							</div>
						</div>
						<div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
							<TrendingUp className="h-3 w-3 text-emerald-400" />
							<span className="text-emerald-400 font-medium">
								{activeRate}%
							</span>
							<span>operational</span>
						</div>
					</CardContent>
				</Card>

				{(["active", "assigned", "maintenance", "inactive"] as const).map(
					(status) => {
						const cfg = STATUS_CONFIG[status];
						const Icon = cfg.icon;
						const count = byStatus[status];
						const pct = total > 0 ? Math.round((count / total) * 100) : 0;
						return (
							<Card key={status} className={`border ${cfg.border} bg-card`}>
								<CardContent className="p-4">
									<div className="flex items-start justify-between">
										<div>
											<p className="text-xs text-muted-foreground">
												{cfg.label}
											</p>
											<p
												className={`mt-1 font-mono text-3xl font-bold tabular-nums ${cfg.color}`}
											>
												{count}
											</p>
										</div>
										<div
											className={`flex h-9 w-9 items-center justify-center rounded-lg ${cfg.bg}`}
										>
											<Icon className={`h-4 w-4 ${cfg.color}`} />
										</div>
									</div>
									<div className="mt-3">
										<div className="mb-1 flex justify-between text-xs text-muted-foreground">
											<span>{pct}% of total</span>
										</div>
										<div className="h-1 w-full overflow-hidden rounded-full bg-muted/40">
											<div
												className={`h-full rounded-full ${cfg.barClass} transition-all`}
												style={{ width: `${pct}%` }}
											/>
										</div>
									</div>
								</CardContent>
							</Card>
						);
					},
				)}
			</div>

			{/* Middle row */}
			<div className="grid gap-4 lg:grid-cols-2">
				{/* Status Distribution */}
				<Card className="border-border bg-card">
					<CardHeader className="pb-3">
						<CardTitle className="font-mono text-sm font-semibold">
							Status Distribution
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-3">
						{(
							[
								"active",
								"assigned",
								"maintenance",
								"inactive",
								"retired",
							] as const
						).map((status) => {
							const cfg = STATUS_CONFIG[status];
							const count = byStatus[status];
							const pct = total > 0 ? Math.round((count / total) * 100) : 0;
							return (
								<div key={status}>
									<div className="mb-1 flex items-center justify-between text-xs">
										<span className={`font-medium ${cfg.color}`}>
											{cfg.label}
										</span>
										<span className="tabular-nums text-muted-foreground">
											{count} / {pct}%
										</span>
									</div>
									<Progress value={pct} className="h-2" />
								</div>
							);
						})}
					</CardContent>
				</Card>

				{/* Category Breakdown */}
				<Card className="border-border bg-card">
					<CardHeader className="pb-3">
						<CardTitle className="font-mono text-sm font-semibold">
							Category Breakdown
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-3">
						{sortedCategories.length === 0 ? (
							<p className="text-xs text-muted-foreground">No assets yet.</p>
						) : (
							sortedCategories.map(([cat, count]) => {
								const pct =
									maxCategoryCount > 0
										? Math.round((count / maxCategoryCount) * 100)
										: 0;
								return (
									<div key={cat}>
										<div className="mb-1 flex items-center justify-between text-xs">
											<span className="font-mono text-muted-foreground">
												{CATEGORY_LABELS[cat] ?? cat}
											</span>
											<span className="tabular-nums text-foreground font-medium">
												{count}
											</span>
										</div>
										<div className="h-2 w-full overflow-hidden rounded-full bg-muted/40">
											<div
												className="h-full rounded-full bg-primary/70 transition-all"
												style={{ width: `${pct}%` }}
											/>
										</div>
									</div>
								);
							})
						)}
					</CardContent>
				</Card>
			</div>

			{/* Recent Assets */}
			<Card className="border-border bg-card">
				<CardHeader className="flex flex-row items-center justify-between pb-3">
					<CardTitle className="font-mono text-sm font-semibold">
						Recent Assets
					</CardTitle>
					<Link
						href="/dashboard/assets"
						className="text-xs text-primary hover:underline"
					>
						View all →
					</Link>
				</CardHeader>
				<CardContent className="p-0">
					{recent.length === 0 ? (
						<p className="px-6 py-8 text-center text-sm text-muted-foreground">
							No assets yet.{" "}
							<Link
								href="/dashboard/assets"
								className="text-primary hover:underline"
							>
								Add your first asset
							</Link>
						</p>
					) : (
						<Table>
							<TableHeader>
								<TableRow className="border-border hover:bg-transparent">
									<TableHead className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
										Name
									</TableHead>
									<TableHead className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
										Category
									</TableHead>
									<TableHead className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
										Status
									</TableHead>
									<TableHead className="hidden font-mono text-[11px] uppercase tracking-wider text-muted-foreground sm:table-cell">
										Assigned To
									</TableHead>
									<TableHead className="hidden font-mono text-[11px] uppercase tracking-wider text-muted-foreground md:table-cell">
										Added
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{recent.map((asset) => {
									const statusCfg =
										STATUS_CONFIG[asset.status as keyof typeof STATUS_CONFIG] ??
										STATUS_CONFIG.inactive;
									return (
										<TableRow key={asset.id} className="border-border">
											<TableCell className="font-medium text-sm text-foreground">
												{asset.name}
											</TableCell>
											<TableCell>
												<span className="inline-flex items-center rounded border border-border bg-muted/40 px-2 py-0.5 font-mono text-[11px] capitalize text-muted-foreground">
													{CATEGORY_LABELS[asset.category] ?? asset.category}
												</span>
											</TableCell>
											<TableCell>
												<Badge
													variant="outline"
													className={`gap-1.5 border ${statusCfg.border} ${statusCfg.bg} ${statusCfg.color} font-normal`}
												>
													<span
														className={`h-1.5 w-1.5 rounded-full ${statusCfg.barClass}`}
													/>
													<span className="capitalize">{asset.status}</span>
												</Badge>
											</TableCell>
											<TableCell className="hidden text-sm text-muted-foreground sm:table-cell">
												{asset.assignedTo ?? "—"}
											</TableCell>
											<TableCell className="hidden text-sm text-muted-foreground md:table-cell">
												{new Date(asset.createdAt).toLocaleDateString()}
											</TableCell>
										</TableRow>
									);
								})}
							</TableBody>
						</Table>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
