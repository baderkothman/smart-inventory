import { auth } from "@clerk/nextjs/server";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { assets } from "@/db/schema";

export async function getAssets() {
	const { userId } = await auth();
	if (!userId) return [];

	return db
		.select()
		.from(assets)
		.where(eq(assets.userId, userId))
		.orderBy(desc(assets.createdAt));
}

export async function getAssetById(id: string) {
	const { userId } = await auth();
	if (!userId) return null;

	const [asset] = await db
		.select()
		.from(assets)
		.where(eq(assets.id, id))
		.limit(1);

	if (!asset || asset.userId !== userId) return null;
	return asset;
}
