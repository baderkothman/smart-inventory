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
