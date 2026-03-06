"use client";

import { Plus, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import type { Asset } from "@/db/schema";
import { AssetActionsMenu } from "./asset-actions-menu";
import { AssetForm } from "./asset-form";

const STATUS_CONFIG: Record<
	string,
	{ color: string; bg: string; border: string; dot: string }
> = {
	active: {
		color: "text-emerald-400",
		bg: "bg-emerald-400/10",
		border: "border-emerald-400/20",
		dot: "bg-emerald-400",
	},
	assigned: {
		color: "text-primary",
		bg: "bg-primary/10",
		border: "border-primary/20",
		dot: "bg-primary",
	},
	maintenance: {
		color: "text-amber-400",
		bg: "bg-amber-400/10",
		border: "border-amber-400/20",
		dot: "bg-amber-400",
	},
	inactive: {
		color: "text-muted-foreground",
		bg: "bg-muted/50",
		border: "border-border",
		dot: "bg-muted-foreground",
	},
	retired: {
		color: "text-destructive",
		bg: "bg-destructive/10",
		border: "border-destructive/20",
		dot: "bg-destructive",
	},
};

const CATEGORY_LABELS: Record<string, string> = {
	laptop: "Laptop",
	monitor: "Monitor",
	license: "License",
	peripheral: "Peripheral",
	server: "Server",
	mobile: "Mobile",
	other: "Other",
};

interface AssetTableProps {
	initialData: Asset[];
}

export function AssetTable({ initialData }: AssetTableProps) {
	const router = useRouter();
	const [assets, setAssets] = useState<Asset[]>(initialData);
	const [query, setQuery] = useState("");
	const [editingAsset, setEditingAsset] = useState<Asset | null>(null);

	const filtered = assets.filter((a) => {
		if (!query) return true;
		const q = query.toLowerCase();
		return (
			a.name.toLowerCase().includes(q) ||
			a.category.toLowerCase().includes(q) ||
			a.status.toLowerCase().includes(q) ||
			(a.manufacturer ?? "").toLowerCase().includes(q) ||
			(a.model ?? "").toLowerCase().includes(q) ||
			(a.location ?? "").toLowerCase().includes(q) ||
			(a.assignedTo ?? "").toLowerCase().includes(q)
		);
	});

	return (
		<div className="flex flex-col gap-3">
			{/* Toolbar */}
			<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<div className="flex items-center gap-3">
					<div className="relative flex-1 sm:flex-none">
						<Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
						<Input
							placeholder="Search assets..."
							value={query}
							onChange={(e) => setQuery(e.target.value)}
							className="h-9 w-full pl-9 font-mono text-xs sm:w-64"
						/>
					</div>
					<span className="hidden font-mono text-xs text-muted-foreground tabular-nums sm:inline">
						{filtered.length} of {assets.length}
					</span>
				</div>
				<Button
					size="sm"
					onClick={() => router.push("/dashboard/assets/new")}
					className="w-full gap-1.5 sm:w-auto"
				>
					<Plus className="h-3.5 w-3.5" />
					Add Asset
				</Button>
			</div>

			{/* Table */}
			<div className="overflow-hidden rounded-lg border border-border bg-card">
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
								Manufacturer
							</TableHead>
							<TableHead className="hidden font-mono text-[11px] uppercase tracking-wider text-muted-foreground md:table-cell">
								Location
							</TableHead>
							<TableHead className="hidden font-mono text-[11px] uppercase tracking-wider text-muted-foreground lg:table-cell">
								Assigned To
							</TableHead>
							<TableHead className="hidden font-mono text-[11px] uppercase tracking-wider text-muted-foreground lg:table-cell">
								Added
							</TableHead>
							<TableHead className="w-12" />
						</TableRow>
					</TableHeader>
					<TableBody>
						{filtered.length === 0 ? (
							<TableRow>
								<TableCell
									colSpan={8}
									className="py-12 text-center text-sm text-muted-foreground"
								>
									{query
										? `No assets match "${query}"`
										: "No assets yet. Add your first asset to get started."}
								</TableCell>
							</TableRow>
						) : (
							filtered.map((asset) => {
								const cfg =
									STATUS_CONFIG[asset.status] ?? STATUS_CONFIG.inactive;
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
												className={`gap-1.5 border ${cfg.border} ${cfg.bg} ${cfg.color} font-normal`}
											>
												<span
													className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`}
												/>
												<span className="capitalize">{asset.status}</span>
											</Badge>
										</TableCell>
										<TableCell className="hidden text-sm text-muted-foreground sm:table-cell">
											{asset.manufacturer ?? "—"}
										</TableCell>
										<TableCell className="hidden text-sm text-muted-foreground md:table-cell">
											{asset.location ?? "—"}
										</TableCell>
										<TableCell className="hidden text-sm text-muted-foreground lg:table-cell">
											{asset.assignedTo ?? "—"}
										</TableCell>
										<TableCell className="hidden text-sm text-muted-foreground lg:table-cell">
											{new Date(asset.createdAt).toLocaleDateString()}
										</TableCell>
										<TableCell>
											<AssetActionsMenu
												asset={asset}
												onEdit={(a) => setEditingAsset(a)}
												onDeleted={(id) =>
													setAssets((prev) => prev.filter((a) => a.id !== id))
												}
											/>
										</TableCell>
									</TableRow>
								);
							})
						)}
					</TableBody>
				</Table>
			</div>

			{/* Edit Sheet */}
			<Sheet
				open={Boolean(editingAsset)}
				onOpenChange={(open) => !open && setEditingAsset(null)}
			>
				<SheetContent className="w-full max-w-2xl overflow-y-auto sm:max-w-2xl">
					<SheetHeader className="mb-6">
						<SheetTitle className="font-mono">Edit Asset</SheetTitle>
					</SheetHeader>
					{editingAsset && <AssetForm defaultValues={editingAsset} />}
				</SheetContent>
			</Sheet>
		</div>
	);
}
