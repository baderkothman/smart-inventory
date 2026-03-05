import { AssetGrid } from "@/features/assets/components/asset-grid";
import { StatsBar } from "@/features/assets/components/stats-bar";
import { getAssets } from "@/features/assets/queries";

export default async function DashboardPage() {
	const assets = await getAssets();

	return (
		<div className="flex h-full flex-col gap-5">
			<div>
				<h1 className="font-mono text-xl font-semibold tracking-tight text-foreground">
					Asset Inventory
				</h1>
				<p className="mt-0.5 text-sm text-muted-foreground">
					Manage and track all organizational assets
				</p>
			</div>
			<StatsBar assets={assets} />
			<AssetGrid initialData={assets} />
		</div>
	);
}
