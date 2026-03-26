import { auth } from "@clerk/nextjs/server";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { assets } from "@/db/schema";

export async function getAssets() {
	const { userId } = await auth();
	if (!userId) return [];

	try {
		return await db
			.select()
			.from(assets)
			.where(eq(assets.userId, userId))
			.orderBy(desc(assets.createdAt));
	} catch (error) {
		// Keep dashboard usable when DB is unreachable or not migrated.
		console.error(
			"[getAssets] Database query failed. Check DATABASE_URL and run drizzle migrations.",
			error,
		);
		return [];
	}
}
