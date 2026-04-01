"use client";

import type { ColDef, GridReadyEvent, IRowNode } from "ag-grid-community";
import {
	ClientSideRowModelModule,
	ColumnAutoSizeModule,
	DateFilterModule,
	ExternalFilterModule,
	NumberFilterModule,
	PaginationModule,
	QuickFilterModule,
	TextFilterModule,
	ValidationModule,
	themeQuartz,
} from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { Plus, Search, SlidersHorizontal, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import { assetCategoryEnum, assetStatusEnum } from "@/db/schema";
import type { Asset } from "@/db/schema";
import { AssetActionsMenu } from "./asset-actions-menu";
import { AssetForm } from "./asset-form";

const STATUS_COLORS: Record<string, { dot: string; text: string; bg: string }> =
	{
		active:      { dot: "#34d399", text: "#34d399", bg: "rgba(52,211,153,0.1)" },
		inactive:    { dot: "#94a3b8", text: "#94a3b8", bg: "rgba(148,163,184,0.1)" },
		maintenance: { dot: "#fbbf24", text: "#fbbf24", bg: "rgba(251,191,36,0.1)" },
		retired:     { dot: "#f87171", text: "#f87171", bg: "rgba(248,113,113,0.1)" },
		assigned:    { dot: "#38bdf8", text: "#38bdf8", bg: "rgba(56,189,248,0.1)" },
	};

const CATEGORY_COLORS: Record<string, string> = {
	laptop:     "#38bdf8",
	monitor:    "#818cf8",
	license:    "#fbbf24",
	peripheral: "#34d399",
	server:     "#f87171",
	mobile:     "#a78bfa",
	other:      "#94a3b8",
};

function StatusRenderer({ value }: { value: string }) {
	const s = STATUS_COLORS[value] ?? STATUS_COLORS.inactive;
	return (
		<span style={{
			display: "inline-flex",
			alignItems: "center",
			gap: 5,
			borderRadius: 4,
			padding: "1px 7px",
			fontSize: 11,
			fontWeight: 500,
			background: s.bg,
			color: s.text,
			textTransform: "capitalize",
		}}>
			<span style={{ width: 6, height: 6, borderRadius: "50%", background: s.dot, flexShrink: 0 }} />
			{value}
		</span>
	);
}

function CategoryRenderer({ value }: { value: string }) {
	const color = CATEGORY_COLORS[value] ?? CATEGORY_COLORS.other;
	return (
		<span style={{
			display: "inline-flex",
			alignItems: "center",
			gap: 6,
			fontSize: 12,
			textTransform: "capitalize",
		}}>
			<span style={{ width: 7, height: 7, borderRadius: 2, background: color, flexShrink: 0 }} />
			{value}
		</span>
	);
}

const darkGridTheme = themeQuartz.withParams({
	backgroundColor: "oklch(0.14 0.015 252)",
	foregroundColor: "oklch(0.91 0.01 252)",
	headerBackgroundColor: "oklch(0.11 0.012 252)",
	rowHoverColor: "oklch(0.18 0.015 252)",
	borderColor: "oklch(0.22 0.02 252)",
	chromeBackgroundColor: "oklch(0.18 0.015 252)",
	fontFamily: "var(--font-geist, ui-sans-serif)",
	fontSize: 13,
	headerFontSize: 11,
	accentColor: "oklch(0.74 0.19 192)",
	textColor: "oklch(0.91 0.01 252)",
	headerTextColor: "oklch(0.52 0.02 252)",
	selectedRowBackgroundColor: "oklch(0.74 0.19 192 / 8%)",
	oddRowBackgroundColor: "oklch(0.13 0.014 252)",
	cellHorizontalPaddingScale: 1,
	// Filter popup
	menuBackgroundColor: "oklch(0.16 0.015 252)",
	menuSeparatorColor: "oklch(0.28 0.02 252)",
	panelBackgroundColor: "oklch(0.16 0.015 252)",
	inputBackgroundColor: "oklch(0.11 0.012 252)",
	inputBorder: "solid 1px oklch(0.28 0.02 252)",
	inputFocusBorder: { color: "oklch(0.74 0.19 192)" },
	checkboxCheckedBackgroundColor: "oklch(0.74 0.19 192)",
	checkboxCheckedBorderColor: "oklch(0.74 0.19 192)",
	checkboxUncheckedBackgroundColor: "oklch(0.11 0.012 252)",
	checkboxUncheckedBorderColor: "oklch(0.35 0.02 252)",
	popupShadow: "0 8px 24px oklch(0 0 0 / 40%)",
});

const lightGridTheme = themeQuartz.withParams({
	backgroundColor: "oklch(1 0 0)",
	foregroundColor: "oklch(0.145 0 0)",
	headerBackgroundColor: "oklch(0.97 0 0)",
	rowHoverColor: "oklch(0.96 0 0)",
	borderColor: "oklch(0.90 0 0)",
	chromeBackgroundColor: "oklch(0.96 0 0)",
	fontFamily: "var(--font-geist, ui-sans-serif)",
	fontSize: 13,
	headerFontSize: 11,
	accentColor: "oklch(0.68 0.19 190)",
	textColor: "oklch(0.145 0 0)",
	headerTextColor: "oklch(0.45 0 0)",
	selectedRowBackgroundColor: "oklch(0.68 0.19 190 / 8%)",
	oddRowBackgroundColor: "oklch(0.985 0 0)",
	cellHorizontalPaddingScale: 1,
	// Filter popup
	menuBackgroundColor: "oklch(1 0 0)",
	menuSeparatorColor: "oklch(0.88 0 0)",
	panelBackgroundColor: "oklch(1 0 0)",
	inputBackgroundColor: "oklch(1 0 0)",
	inputBorder: "solid 1px oklch(0.85 0 0)",
	inputFocusBorder: { color: "oklch(0.68 0.19 190)" },
	checkboxCheckedBackgroundColor: "oklch(0.68 0.19 190)",
	checkboxCheckedBorderColor: "oklch(0.68 0.19 190)",
	checkboxUncheckedBackgroundColor: "oklch(1 0 0)",
	checkboxUncheckedBorderColor: "oklch(0.75 0 0)",
	popupShadow: "0 8px 24px oklch(0 0 0 / 12%)",
});

const CATEGORIES = assetCategoryEnum.enumValues;
const STATUSES = assetStatusEnum.enumValues;

interface AssetGridProps {
	initialData: Asset[];
}

export function AssetGrid({ initialData }: AssetGridProps) {
	const router = useRouter();
	const { resolvedTheme } = useTheme();
	const gridTheme = resolvedTheme === "light" ? lightGridTheme : darkGridTheme;
	const gridRef = useRef<AgGridReact<Asset>>(null);
	const [mounted, setMounted] = useState(false);
	const [rowData, setRowData] = useState<Asset[]>(initialData);
	const [quickFilter, setQuickFilter] = useState("");
	const [categoryFilter, setCategoryFilter] = useState<string>("all");
	const [statusFilter, setStatusFilter] = useState<string>("all");
	const [editingAsset, setEditingAsset] = useState<Asset | null>(null);

	const hasActiveFilters =
		categoryFilter !== "all" || statusFilter !== "all" || quickFilter !== "";

	const clearFilters = useCallback(() => {
		setQuickFilter("");
		setCategoryFilter("all");
		setStatusFilter("all");
		gridRef.current?.api?.setGridOption("quickFilterText", "");
	}, []);

	const isExternalFilterPresent = useCallback(
		() => categoryFilter !== "all" || statusFilter !== "all",
		[categoryFilter, statusFilter],
	);

	const doesExternalFilterPass = useCallback(
		(node: IRowNode<Asset>) => {
			const asset = node.data;
			if (!asset) return true;
			if (categoryFilter !== "all" && asset.category !== categoryFilter)
				return false;
			if (statusFilter !== "all" && asset.status !== statusFilter) return false;
			return true;
		},
		[categoryFilter, statusFilter],
	);

	// biome-ignore lint/correctness/useExhaustiveDependencies: deps are intentional triggers
	useEffect(() => {
		gridRef.current?.api?.onFilterChanged();
	}, [categoryFilter, statusFilter]);

	useEffect(() => {
		setMounted(true);
	}, []);

	const modules = useMemo(
		() => [
			ClientSideRowModelModule,
			TextFilterModule,
			NumberFilterModule,
			DateFilterModule,
			PaginationModule,
			ColumnAutoSizeModule,
			QuickFilterModule,
			ExternalFilterModule,
			ValidationModule,
		],
		[],
	);

	const columnDefs = useMemo<ColDef<Asset>[]>(
		() => [
			{
				field: "name",
				headerName: "Asset Name",
				flex: 2,
				minWidth: 180,
				filter: "agTextColumnFilter",
				filterParams: {
					filterOptions: ["contains", "startsWith", "equals"],
					defaultOption: "contains",
					maxNumConditions: 1,
				},
			},
			{
				field: "category",
				headerName: "Category",
				flex: 1,
				minWidth: 120,
				filter: false,
				cellRenderer: CategoryRenderer,
			},
			{
				field: "status",
				headerName: "Status",
				flex: 1,
				minWidth: 130,
				filter: false,
				cellRenderer: StatusRenderer,
			},
			{
				field: "manufacturer",
				headerName: "Manufacturer",
				flex: 1,
				minWidth: 140,
				filter: "agTextColumnFilter",
				filterParams: {
					filterOptions: ["contains", "startsWith"],
					defaultOption: "contains",
					maxNumConditions: 1,
				},
			},
			{
				field: "model",
				headerName: "Model",
				flex: 1,
				minWidth: 140,
				filter: "agTextColumnFilter",
				filterParams: {
					filterOptions: ["contains", "startsWith"],
					defaultOption: "contains",
					maxNumConditions: 1,
				},
			},
			{
				field: "location",
				headerName: "Location",
				flex: 1,
				minWidth: 130,
				filter: "agTextColumnFilter",
				filterParams: {
					filterOptions: ["contains", "startsWith"],
					defaultOption: "contains",
					maxNumConditions: 1,
				},
			},
			{
				field: "assignedTo",
				headerName: "Assigned To",
				flex: 1,
				minWidth: 140,
				filter: "agTextColumnFilter",
				filterParams: {
					filterOptions: ["contains", "startsWith"],
					defaultOption: "contains",
					maxNumConditions: 1,
				},
			},
			{
				field: "createdAt",
				headerName: "Added On",
				flex: 1,
				minWidth: 130,
				sortable: true,
				filter: "agDateColumnFilter",
				filterParams: {
					filterOptions: ["equals", "lessThan", "greaterThan", "inRange"],
					defaultOption: "greaterThan",
					maxNumConditions: 1,
				},
				valueFormatter: ({ value }: { value: string | Date }) =>
					value ? new Date(value).toLocaleDateString() : "—",
			},
			{
				headerName: "Actions",
				minWidth: 80,
				maxWidth: 80,
				sortable: false,
				filter: false,
				resizable: false,
				cellRenderer: ({ data }: { data: Asset }) => (
					<div className="flex h-full items-center justify-center">
						<AssetActionsMenu
							asset={data}
							onEdit={(asset) => setEditingAsset(asset)}
							onDeleted={(id) =>
								setRowData((prev) => prev.filter((a) => a.id !== id))
							}
						/>
					</div>
				),
			},
		],
		[],
	);

	const defaultColDef = useMemo<ColDef>(
		() => ({
			resizable: true,
			sortable: true,
		}),
		[],
	);

	const onGridReady = useCallback((params: GridReadyEvent) => {
		params.api.sizeColumnsToFit();
	}, []);

	if (!mounted) {
		return (
			<div className="flex min-h-0 flex-1 flex-col gap-3">
				<div className="h-9 w-64 rounded-md border border-border bg-muted/30" />
				<div className="min-h-0 flex-1 rounded-lg border border-border bg-muted/20" />
			</div>
		);
	}

	return (
		<div className="flex min-h-0 flex-1 flex-col gap-3">
			{/* Toolbar */}
			<div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
				<div className="flex flex-wrap items-center gap-2">
					{/* Quick search */}
					<div className="relative">
						<Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
						<Input
							placeholder="Search assets..."
							value={quickFilter}
							onChange={(e) => {
								setQuickFilter(e.target.value);
								gridRef.current?.api?.setGridOption(
									"quickFilterText",
									e.target.value,
								);
							}}
							className="h-9 w-52 pl-9 font-mono text-xs"
						/>
					</div>

					{/* Category filter */}
					<Select value={categoryFilter} onValueChange={setCategoryFilter}>
						<SelectTrigger className="h-9 w-40 font-mono text-xs">
							<SlidersHorizontal className="mr-1.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
							<SelectValue placeholder="Category" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all" className="font-mono text-xs">
								All categories
							</SelectItem>
							{CATEGORIES.map((cat) => (
								<SelectItem
									key={cat}
									value={cat}
									className="font-mono text-xs capitalize"
								>
									{cat}
								</SelectItem>
							))}
						</SelectContent>
					</Select>

					{/* Status filter */}
					<Select value={statusFilter} onValueChange={setStatusFilter}>
						<SelectTrigger className="h-9 w-36 font-mono text-xs">
							<SelectValue placeholder="Status" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all" className="font-mono text-xs">
								All statuses
							</SelectItem>
							{STATUSES.map((s) => (
								<SelectItem
									key={s}
									value={s}
									className="font-mono text-xs capitalize"
								>
									{s}
								</SelectItem>
							))}
						</SelectContent>
					</Select>

					{/* Clear filters */}
					{hasActiveFilters && (
						<Button
							variant="ghost"
							size="sm"
							onClick={clearFilters}
							className="h-9 gap-1.5 font-mono text-xs text-muted-foreground hover:text-foreground"
						>
							<X className="h-3.5 w-3.5" />
							Clear
						</Button>
					)}

					<span className="hidden font-mono text-xs text-muted-foreground tabular-nums sm:inline">
						{rowData.length} records
					</span>
				</div>

				<Button
					size="sm"
					onClick={() => router.push("/assets/new")}
					className="w-full gap-1.5 sm:w-auto"
				>
					<Plus className="h-3.5 w-3.5" />
					Add Asset
				</Button>
			</div>

			{/* Grid */}
			<div className="min-h-0 flex-1 overflow-hidden rounded-lg border border-border">
				<AgGridReact<Asset>
					ref={gridRef}
					theme={gridTheme}
					rowData={rowData}
					columnDefs={columnDefs}
					defaultColDef={defaultColDef}
					modules={modules}
					isExternalFilterPresent={isExternalFilterPresent}
					doesExternalFilterPass={doesExternalFilterPass}
					animateRows
					pagination
					paginationPageSize={25}
					paginationPageSizeSelector={[10, 25, 50, 100]}
					onGridReady={onGridReady}
					overlayNoRowsTemplate='<span style="font-size: 13px; padding: 16px">No assets found.</span>'
				/>
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
