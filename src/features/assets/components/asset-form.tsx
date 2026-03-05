"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { Asset } from "@/db/schema";
import { generateDescription } from "@/features/ai/actions";
import { createAsset, updateAsset } from "../actions";
import { assetFormSchema, type AssetFormValues } from "../validations";
import { AiDescriptionPanel } from "./ai-description-panel";

const CATEGORIES = [
  { value: "laptop", label: "Laptop" },
  { value: "monitor", label: "Monitor" },
  { value: "license", label: "License" },
  { value: "peripheral", label: "Peripheral" },
  { value: "server", label: "Server" },
  { value: "mobile", label: "Mobile" },
  { value: "other", label: "Other" },
] as const;

const STATUSES = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "maintenance", label: "Maintenance" },
  { value: "retired", label: "Retired" },
  { value: "assigned", label: "Assigned" },
] as const;

interface AssetFormProps {
  defaultValues?: Asset;
}

export function AssetForm({ defaultValues }: AssetFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const isEditing = Boolean(defaultValues);

  const form = useForm<AssetFormValues>({
    resolver: zodResolver(assetFormSchema),
    defaultValues: {
      name: defaultValues?.name ?? "",
      category: defaultValues?.category ?? undefined,
      status: defaultValues?.status ?? "active",
      serialNumber: defaultValues?.serialNumber ?? "",
      manufacturer: defaultValues?.manufacturer ?? "",
      model: defaultValues?.model ?? "",
      purchaseDate: defaultValues?.purchaseDate ?? "",
      location: defaultValues?.location ?? "",
      assignedTo: defaultValues?.assignedTo ?? "",
      description: defaultValues?.description ?? "",
      notes: defaultValues?.notes ?? "",
    },
  });

  const watchedName = form.watch("name");
  const watchedCategory = form.watch("category");
  const description = form.watch("description");

  async function handleGenerateDescription() {
    if (!watchedName || !watchedCategory) return;
    setAiGenerating(true);
    setAiError(null);
    try {
      const generated = await generateDescription({
        name: watchedName,
        category: watchedCategory,
        manufacturer: form.getValues("manufacturer") || undefined,
        model: form.getValues("model") || undefined,
        serialNumber: form.getValues("serialNumber") || undefined,
      });
      form.setValue("description", generated);
    } catch (err) {
      setAiError(
        err instanceof Error ? err.message : "AI generation failed. Try again.",
      );
    } finally {
      setAiGenerating(false);
    }
  }

  function onSubmit(values: AssetFormValues) {
    setSubmitError(null);
    startTransition(async () => {
      try {
        if (isEditing && defaultValues) {
          await updateAsset(defaultValues.id, values);
          toast.success("Asset updated successfully.");
          router.push("/dashboard");
        } else {
          await createAsset(values);
          // redirect happens inside createAsset
        }
      } catch (err) {
        // redirect() throws a special error — rethrow it
        if (
          err instanceof Error &&
          err.message.includes("NEXT_REDIRECT")
        ) {
          throw err;
        }
        setSubmitError("Failed to save asset. Please try again.");
        toast.error("Failed to save asset.");
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Asset Name *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='e.g. "Dell XPS 15 Laptop"'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Category + Status */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {CATEGORIES.map((cat) => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {STATUSES.map((s) => (
                          <SelectItem key={s.value} value={s.value}>
                            {s.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Manufacturer + Model */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="manufacturer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Manufacturer</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Dell, HP, Microsoft"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="model"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Model</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. XPS 15 9530" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Serial Number + Purchase Date */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="serialNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Serial Number</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="purchaseDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Purchase Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Location + Assigned To */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Floor 2, Room 201"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="assignedTo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assigned To</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Employee name or email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* AI Description */}
        <AiDescriptionPanel
          description={description ?? ""}
          onDescriptionChange={(val) => form.setValue("description", val)}
          onGenerate={handleGenerateDescription}
          isGenerating={aiGenerating}
          error={aiError}
          canGenerate={Boolean(watchedName && watchedCategory)}
        />

        {/* Notes */}
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      placeholder="Any additional notes about this asset..."
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {submitError && (
          <Alert variant="destructive">
            <AlertDescription>{submitError}</AlertDescription>
          </Alert>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isPending || aiGenerating}>
            {isPending
              ? isEditing
                ? "Updating..."
                : "Saving..."
              : isEditing
                ? "Update Asset"
                : "Save Asset"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
