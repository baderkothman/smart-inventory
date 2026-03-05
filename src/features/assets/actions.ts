"use server";

import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { assets } from "@/db/schema";
import { assetFormSchema } from "./validations";

export async function createAsset(data: unknown) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const validated = assetFormSchema.parse(data);

  await db.insert(assets).values({
    userId,
    name: validated.name,
    category: validated.category,
    status: validated.status,
    serialNumber: validated.serialNumber ?? null,
    manufacturer: validated.manufacturer ?? null,
    model: validated.model ?? null,
    purchaseDate: validated.purchaseDate ?? null,
    location: validated.location ?? null,
    assignedTo: validated.assignedTo ?? null,
    description: validated.description ?? null,
    notes: validated.notes ?? null,
  });

  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function updateAsset(id: string, data: unknown) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const validated = assetFormSchema.parse(data);

  await db
    .update(assets)
    .set({
      name: validated.name,
      category: validated.category,
      status: validated.status,
      serialNumber: validated.serialNumber ?? null,
      manufacturer: validated.manufacturer ?? null,
      model: validated.model ?? null,
      purchaseDate: validated.purchaseDate ?? null,
      location: validated.location ?? null,
      assignedTo: validated.assignedTo ?? null,
      description: validated.description ?? null,
      notes: validated.notes ?? null,
      updatedAt: new Date(),
    })
    .where(and(eq(assets.id, id), eq(assets.userId, userId)));

  revalidatePath("/dashboard");
}

export async function deleteAsset(id: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  await db
    .delete(assets)
    .where(and(eq(assets.id, id), eq(assets.userId, userId)));

  revalidatePath("/dashboard");
}
