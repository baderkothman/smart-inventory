"use client";

import { Sparkles } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
    <Card className="border-blue-200 dark:border-blue-900">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
        <div className="space-y-1">
          <CardTitle className="flex items-center gap-2 text-base">
            <Sparkles className="h-4 w-4 text-blue-500" />
            AI Technical Description
          </CardTitle>
          <CardDescription>
            Auto-generate a technical description using Gemini AI, then review
            or edit it.
          </CardDescription>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onGenerate}
          disabled={isGenerating || !canGenerate}
          className="shrink-0"
        >
          {isGenerating ? (
            <>
              <span className="mr-2 inline-block h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="mr-1.5 h-3.5 w-3.5" />
              Generate with AI
            </>
          )}
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
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
            <Label htmlFor="ai-description">Description</Label>
            {description && !isGenerating && (
              <Badge variant="secondary" className="text-xs">
                AI Generated
              </Badge>
            )}
          </div>

          {isGenerating ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/6" />
            </div>
          ) : (
            <Textarea
              id="ai-description"
              value={description}
              onChange={(e) => onDescriptionChange(e.target.value)}
              placeholder="AI-generated description will appear here. You can edit it freely."
              rows={4}
            />
          )}
        </div>

        {description && !isGenerating && (
          <p className="text-xs text-muted-foreground">
            AI-generated content. Review and edit before saving.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
