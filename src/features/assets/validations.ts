import { z } from "zod";

export const assetFormSchema = z.object({
  name: z.string().min(1, "Asset name is required"),
  category: z.enum([
    "laptop",
    "monitor",
    "license",
    "peripheral",
    "server",
    "mobile",
    "other",
  ]),
  status: z.enum(["active", "inactive", "maintenance", "retired", "assigned"]),
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
