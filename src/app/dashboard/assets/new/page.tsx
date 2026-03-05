import { AssetForm } from "@/features/assets/components/asset-form";

export default function NewAssetPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Add New Asset</h1>
        <p className="text-muted-foreground">
          Fill in the details below. Use AI to auto-generate a technical
          description.
        </p>
      </div>
      <AssetForm />
    </div>
  );
}
