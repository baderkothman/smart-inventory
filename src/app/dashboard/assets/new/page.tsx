import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { AssetForm } from "@/features/assets/components/asset-form";

export default function NewAssetPage() {
	return (
		<div className="mx-auto max-w-2xl">
			<div className="mb-6">
				<Link
					href="/dashboard/assets"
					className="mb-4 inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
				>
					<ArrowLeft className="h-3.5 w-3.5" />
					Back to Assets
				</Link>
				<h1 className="font-mono text-xl font-semibold tracking-tight text-foreground">
					Add New Asset
				</h1>
				<p className="mt-0.5 text-sm text-muted-foreground">
					Fill in the details below. Use AI to auto-generate a description.
				</p>
			</div>
			<AssetForm />
		</div>
	);
}
