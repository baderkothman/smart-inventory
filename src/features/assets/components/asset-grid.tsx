"use client";

import type { ColDef, GridReadyEvent } from "ag-grid-community";
import {
	ClientSideRowModelModule,
	ColumnAutoSizeModule,
	DateFilterModule,
	NumberFilterModule,
	PaginationModule,
	QuickFilterModule,
	RowSelectionModule,
	TextFilterModule,
	ValidationModule,
	themeQuartz,
} from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { Plus, Search } from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import type { Asset } from "@/db/schema";
import { AssetActionsMenu } from "./asset-actions-menu";
import { AssetForm } from "./asset-form";

const STATUS_STYLES: Record<
	string,
	{ dot: string; text: string; bg: string }
> = {
	active: {
		dot: "bg-emerald-400",
		text: "text-emerald-400",
		bg: "bg-emerald-400/10",
	},
	inactive: {
		dot: "bg-muted-foreground",
		text: "text-muted-foreground",
		bg: "bg-muted/50",
	},
	maintenance: {
		dot: "bg-amber-400",
		text: "text-amber-400",
		bg: "bg-amber-400/10",
	},
	retired: {
		dot: "bg-destructive",
		text: "text-destructive",
		bg: "bg-destructive/10",
	},
	assigned: {
		dot: "bg-primary",
		text: "text-primary",
		bg: "bg-primary/10",
	},
};

function StatusRenderer({ value }: { value: string }) {
	const style = STATUS_STYLES[value] ?? STATUS_STYLES.inactive;
	return (
		<span
			className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${style.bg} ${style.text}`}
		>
			<span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
			{value}
		</span>
	);
}

function CategoryRenderer({ value }: { value: string }) {
	return (
		<span className="inline-flex items-center rounded border border-border bg-muted/40 px-2 py-0.5 font-mono text-[11px] capitalize text-muted-foreground">
			{value}
		</span>
	);
}

const darkGridTheme = themeQuartz.withParams({
	backgroundColor: "oklch(0.14 0.015 252)",
	headerBackgroundColor: "oklch(0.11 0.012 252)",
	rowHoverColor: "oklch(0.18 0.015 252)",
	borderColor: "oklch(0.22 0.02 252)",
	fontFamily: "var(--font-geist, ui-sans-serif)",
	fontSize: 13,
	headerFontSize: 11,
	accentColor: "oklch(0.74 0.19 192)",
	textColor: "oklch(0.91 0.01 252)",
	headerTextColor: "oklch(0.52 0.02 252)",
	selectedRowBackgroundColor: "oklch(0.74 0.19 192 / 8%)",
	oddRowBackgroundColor: "oklch(0.13 0.014 252)",
	cellHorizontalPaddingScale: 1,
});

const lightGridTheme = themeQuartz.withParams({
	backgroundColor: "oklch(1 0 0)",
	headerBackgroundColor: "oklch(0.97 0 0)",
	rowHoverColor: "oklch(0.96 0 0)",
	borderColor: "oklch(0.90 0 0)",
	fontFamily: "var(--font-geist, ui-sans-serif)",
	fontSize: 13,
	headerFontSize: 11,
	accentColor: "oklch(0.68 0.19 190)",
	textColor: "oklch(0.145 0 0)",
	headerTextColor: "oklch(0.45 0 0)",
	selectedRowBackgroundColor: "oklch(0.68 0.19 190 / 8%)",
	oddRowBackgroundColor: "oklch(0.985 0 0)",
	cellHorizontalPaddingScale: 1,
});

interface AssetGridProps {
	initialData: Asset[];
}

export function AssetGrid({ initialData }: AssetGridProps) {
	const router = useRouter();
	const { resolvedTheme } = useTheme();
	const gridTheme = resolvedTheme === "light" ? lightGridTheme : darkGridTheme;
	const gridRef = useRef<AgGridReact<Asset>>(null);
	const [rowData, setRowData] = useState<Asset[]>(initialData);
	const [quickFilter, setQuickFilter] = useState("");
	const [editingAsset, setEditingAsset] = useState<Asset | null>(null);

	const modules = useMemo(
		() => [
			ClientSideRowModelModule,
			TextFilterModule,
			NumberFilterModule,
			DateFilterModule,
			PaginationModule,
			ColumnAutoSizeModule,
			RowSelectionModule,
			QuickFilterModule,
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
				checkboxSelection: true,
				headerCheckboxSelection: true,
			},
			{
				field: "category",
				headerName: "Category",
				flex: 1,
				minWidth: 120,
				filter: "agTextColumnFilter",
				cellRenderer: CategoryRenderer,
			},
			{
				field: "status",
				headerName: "Status",
				flex: 1,
				minWidth: 130,
				filter: "agTextColumnFilter",
				cellRenderer: StatusRenderer,
			},
			{
				field: "manufacturer",
				headerName: "Manufacturer",
				flex: 1,
				minWidth: 140,
				filter: "agTextColumnFilter",
			},
			{
				field: "model",
				headerName: "Model",
				flex: 1,
				minWidth: 140,
				filter: "agTextColumnFilter",
			},
			{
				field: "location",
				headerName: "Location",
				flex: 1,
				minWidth: 130,
				filter: "agTextColumnFilter",
			},
			{
				field: "assignedTo",
				headerName: "Assigned To",
				flex: 1,
				minWidth: 140,
				filter: "agTextColumnFilter",
			},
			{
				field: "createdAt",
				headerName: "Added On",
				flex: 1,
				minWidth: 130,
				sortable: true,
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

	const onFilterInput = useCallback((value: string) => {
		setQuickFilter(value);
		gridRef.current?.api?.setGridOption("quickFilterText", value);
	}, []);

	return (
		<div className="flex min-h-0 flex-1 flex-col gap-3">
			{/* Toolbar */}
			<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<div className="flex items-center gap-3">
					<div className="relative flex-1 sm:flex-none">
						<Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
						<Input
							placeholder="Search assets..."
							value={quickFilter}
							onChange={(e) => onFilterInput(e.target.value)}
							className="h-9 w-full pl-9 font-mono text-xs sm:w-64"
						/>
					</div>
					<span className="hidden font-mono text-xs text-muted-foreground tabular-nums sm:inline">
						{rowData.length} records
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

			{/* Grid */}
			<div className="min-h-0 flex-1 overflow-hidden rounded-lg border border-border">
				<AgGridReact<Asset>
					ref={gridRef}
					theme={gridTheme}
					rowData={rowData}
					columnDefs={columnDefs}
					defaultColDef={defaultColDef}
					modules={modules}
					rowSelection={{ mode: "multiRow" }}
					animateRows
					pagination
					paginationPageSize={25}
					paginationPageSizeSelector={[10, 25, 50, 100]}
					onGridReady={onGridReady}
					overlayNoRowsTemplate='<span style="color: oklch(0.52 0.02 252); font-size: 13px; padding: 16px">No assets found. Add your first asset to get started.</span>'
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
