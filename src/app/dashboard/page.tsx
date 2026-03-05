import { getAssets } from "@/features/assets/queries";
import { AssetGrid } from "@/features/assets/components/asset-grid";

export default async function DashboardPage() {
  const assets = await getAssets();

  return (
    <div className="flex h-full flex-col gap-2">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Asset Inventory</h1>
        <p className="text-muted-foreground">
          Manage and track all your organizational assets
        </p>
      </div>
      <AssetGrid initialData={assets} />
    </div>
  );
}
