"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Asset } from "@/db/schema";
import { AssetActionsMenu } from "./asset-actions-menu";

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

interface AssetColumnActions {
	onEdit: (asset: Asset) => void;
	onDeleted: (id: string) => void;
}

function SortHeader({
	label,
	onClick,
}: {
	label: string;
	onClick: () => void;
}) {
	return (
		<Button
			variant="ghost"
			className="-ml-3 h-8 px-3 font-mono text-[11px] uppercase tracking-wider text-muted-foreground"
			onClick={onClick}
		>
			{label}
			<ArrowUpDown className="ml-1.5 h-3 w-3" />
		</Button>
	);
}

export function getAssetColumns({
	onEdit,
	onDeleted,
}: AssetColumnActions): ColumnDef<Asset>[] {
	return [
		{
			accessorKey: "name",
			header: ({ column }) => (
				<SortHeader
					label="Name"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				/>
			),
			cell: ({ row }) => (
				<span className="text-sm font-medium text-foreground">
					{row.original.name}
				</span>
			),
		},
		{
			accessorKey: "category",
			header: ({ column }) => (
				<SortHeader
					label="Category"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				/>
			),
			cell: ({ row }) => (
				<span className="inline-flex items-center rounded border border-border bg-muted/40 px-2 py-0.5 font-mono text-[11px] capitalize text-muted-foreground">
					{CATEGORY_LABELS[row.original.category] ?? row.original.category}
				</span>
			),
		},
		{
			accessorKey: "status",
			header: ({ column }) => (
				<SortHeader
					label="Status"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				/>
			),
			cell: ({ row }) => {
				const cfg = STATUS_CONFIG[row.original.status] ?? STATUS_CONFIG.inactive;
				return (
					<Badge
						variant="outline"
						className={`gap-1.5 border ${cfg.border} ${cfg.bg} ${cfg.color} font-normal`}
					>
						<span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
						<span className="capitalize">{row.original.status}</span>
					</Badge>
				);
			},
		},
		{
			accessorKey: "manufacturer",
			header: ({ column }) => (
				<SortHeader
					label="Manufacturer"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				/>
			),
			cell: ({ row }) => (
				<span className="text-sm text-muted-foreground">
					{row.original.manufacturer ?? "-"}
				</span>
			),
		},
		{
			accessorKey: "location",
			header: ({ column }) => (
				<SortHeader
					label="Location"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				/>
			),
			cell: ({ row }) => (
				<span className="text-sm text-muted-foreground">
					{row.original.location ?? "-"}
				</span>
			),
		},
		{
			accessorKey: "assignedTo",
			header: ({ column }) => (
				<SortHeader
					label="Assigned To"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				/>
			),
			cell: ({ row }) => (
				<span className="text-sm text-muted-foreground">
					{row.original.assignedTo ?? "-"}
				</span>
			),
		},
		{
			id: "createdAt",
			accessorFn: (row) => new Date(row.createdAt).getTime(),
			header: ({ column }) => (
				<SortHeader
					label="Added"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				/>
			),
			cell: ({ row }) => (
				<span className="text-sm text-muted-foreground">
					{new Date(row.original.createdAt).toLocaleDateString()}
				</span>
			),
		},
		{
			id: "actions",
			enableSorting: false,
			header: () => <span className="sr-only">Actions</span>,
			cell: ({ row }) => (
				<AssetActionsMenu
					asset={row.original}
					onEdit={onEdit}
					onDeleted={onDeleted}
				/>
			),
		},
	];
}
