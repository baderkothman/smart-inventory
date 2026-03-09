import { z } from "zod";
import { assetCategoryEnum, assetStatusEnum } from "@/db/schema";

export const assetFormSchema = z.object({
	name: z.string().min(1, "Asset name is required"),
	category: z.enum(assetCategoryEnum.enumValues),
	status: z.enum(assetStatusEnum.enumValues),
	serialNumber: z.string().optional(),
	manufacturer: z.string().optional(),
	model: z.string().optional(),
	purchaseDate: z.string().optional(),
	location: z.string().optional(),
	assignedTo: z.string().optional(),
	description: z.string().optional(),
	notes: z.string().optional(),
});

export type AssetFormValues = z.infer<typeof assetFormSchema>;
