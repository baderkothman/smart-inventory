"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import type { Asset } from "@/db/schema";
import { AssetForm } from "./asset-form";
import { getAssetColumns } from "./columns";

interface AssetTableProps {
	initialData: Asset[];
}

export function AssetTable({ initialData }: AssetTableProps) {
	const router = useRouter();
	const [assets, setAssets] = useState<Asset[]>(initialData);
	const [editingAsset, setEditingAsset] = useState<Asset | null>(null);

	const columns = useMemo<ColumnDef<Asset>[]>(
		() =>
			getAssetColumns({
				onEdit: (asset) => setEditingAsset(asset),
				onDeleted: (id) =>
					setAssets((prev) => prev.filter((asset) => asset.id !== id)),
			}),
		[],
	);

	return (
		<div className="flex flex-col gap-3">
			<div className="flex justify-end">
				<Button
					size="sm"
					onClick={() => router.push("/assets/new")}
					className="w-full gap-1.5 sm:w-auto"
				>
					<Plus className="h-3.5 w-3.5" />
					Add Asset
				</Button>
			</div>

			<DataTable
				columns={columns}
				data={assets}
				filterColumn="name"
				filterPlaceholder="Search assets by name..."
			/>

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
