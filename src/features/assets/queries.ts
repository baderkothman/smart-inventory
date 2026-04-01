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
		// Avoid passing Error objects to console.error — Next.js dev overlay treats that like an uncaught error.
		const msg =
			error instanceof Error
				? error.message
				: typeof error === "string"
					? error
					: "Unknown error";
		const cause =
			error instanceof Error && error.cause instanceof Error
				? error.cause.message
				: undefined;
		console.warn(
			`[getAssets] ${msg}${cause ? ` (${cause})` : ""}. Check DATABASE_URL matches this project and run migrations if needed.`,
		);
		return [];
	}
}
