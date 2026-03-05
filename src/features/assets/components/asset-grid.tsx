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
	themeQuartz,
	ValidationModule,
} from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
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

const STATUS_COLORS: Record<string, string> = {
	active:
		"bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
	inactive: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
	maintenance:
		"bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
	retired: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
	assigned: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
};

function StatusRenderer({ value }: { value: string }) {
	return (
		<span
			className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize ${STATUS_COLORS[value] ?? ""}`}
		>
			{value}
		</span>
	);
}

function CategoryRenderer({ value }: { value: string }) {
	return (
		<Badge variant="outline" className="capitalize text-xs">
			{value}
		</Badge>
	);
}

interface AssetGridProps {
	initialData: Asset[];
}

export function AssetGrid({ initialData }: AssetGridProps) {
	const router = useRouter();
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
				minWidth: 120,
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
					<div className="flex items-center justify-center h-full">
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
		<div className="flex h-full flex-col gap-4">
			{/* Toolbar */}
			<div className="flex items-center justify-between gap-4">
				<div className="flex items-center gap-3">
					<Input
						placeholder="Search all fields..."
						value={quickFilter}
						onChange={(e) => onFilterInput(e.target.value)}
						className="w-72"
					/>
					<Badge variant="secondary" className="text-xs">
						{rowData.length} assets
					</Badge>
				</div>
				<Button onClick={() => router.push("/dashboard/assets/new")}>
					<Plus className="mr-2 h-4 w-4" />
					Add Asset
				</Button>
			</div>

			{/* Grid */}
			<div className="flex-1" style={{ height: "600px" }}>
				<AgGridReact<Asset>
					ref={gridRef}
					theme={themeQuartz}
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
					overlayNoRowsTemplate='<span style="padding: 16px">No assets found. Add your first asset!</span>'
				/>
			</div>

			{/* Edit Sheet */}
			<Sheet
				open={Boolean(editingAsset)}
				onOpenChange={(open) => !open && setEditingAsset(null)}
			>
				<SheetContent className="w-full max-w-2xl overflow-y-auto sm:max-w-2xl">
					<SheetHeader className="mb-6">
						<SheetTitle>Edit Asset</SheetTitle>
					</SheetHeader>
					{editingAsset && <AssetForm defaultValues={editingAsset} />}
				</SheetContent>
			</Sheet>
		</div>
	);
}
