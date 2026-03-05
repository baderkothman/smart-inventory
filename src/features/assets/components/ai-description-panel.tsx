"use client";

import { Sparkles } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";

interface AiDescriptionPanelProps {
	description: string;
	onDescriptionChange: (value: string) => void;
	onGenerate: () => void;
	isGenerating: boolean;
	error: string | null;
	canGenerate: boolean;
}

export function AiDescriptionPanel({
	description,
	onDescriptionChange,
	onGenerate,
	isGenerating,
	error,
	canGenerate,
}: AiDescriptionPanelProps) {
	return (
		<div className="rounded-lg border border-primary/20 bg-primary/5 p-5">
			<div className="mb-4 flex items-start justify-between gap-4">
				<div>
					<div className="flex items-center gap-2">
						<div className="flex h-6 w-6 items-center justify-center rounded bg-primary/15">
							<Sparkles className="h-3.5 w-3.5 text-primary" />
						</div>
						<h3 className="text-sm font-semibold text-foreground">
							AI Description
						</h3>
					</div>
					<p className="mt-1 text-xs text-muted-foreground">
						Auto-generate a technical description with Gemini AI, then edit
						freely.
					</p>
				</div>
				<Button
					type="button"
					variant="outline"
					size="sm"
					onClick={onGenerate}
					disabled={isGenerating || !canGenerate}
					className="shrink-0 border-primary/30 text-primary hover:bg-primary/10 hover:text-primary"
				>
					{isGenerating ? (
						<>
							<span className="mr-2 inline-block h-3 w-3 animate-spin rounded-full border-2 border-primary border-t-transparent" />
							Generating...
						</>
					) : (
						<>
							<Sparkles className="mr-1.5 h-3.5 w-3.5" />
							Generate
						</>
					)}
				</Button>
			</div>

			<div className="space-y-3">
				{!canGenerate && (
					<p className="text-xs text-muted-foreground">
						Enter asset name and category above to enable AI generation.
					</p>
				)}

				{error && (
					<Alert variant="destructive">
						<AlertDescription>{error}</AlertDescription>
					</Alert>
				)}

				<div className="space-y-1.5">
					<div className="flex items-center gap-2">
						<Label htmlFor="ai-description" className="text-xs">
							Description
						</Label>
						{description && !isGenerating && (
							<Badge
								variant="secondary"
								className="border-primary/20 bg-primary/10 text-[10px] text-primary"
							>
								AI Generated
							</Badge>
						)}
					</div>

					{isGenerating ? (
						<div className="space-y-2 rounded-md border border-border bg-background p-3">
							<Skeleton className="h-3 w-full" />
							<Skeleton className="h-3 w-5/6" />
							<Skeleton className="h-3 w-4/6" />
						</div>
					) : (
						<Textarea
							id="ai-description"
							value={description}
							onChange={(e) => onDescriptionChange(e.target.value)}
							placeholder="AI-generated description will appear here. You can edit it freely."
							rows={4}
							className="resize-none text-sm"
						/>
					)}
				</div>

				{description && !isGenerating && (
					<p className="text-[11px] text-muted-foreground">
						Review and edit AI-generated content before saving.
					</p>
				)}
			</div>
		</div>
	);
}
