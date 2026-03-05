import { pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const assetCategoryEnum = pgEnum("asset_category", [
	"laptop",
	"monitor",
	"license",
	"peripheral",
	"server",
	"mobile",
	"other",
]);

export const assetStatusEnum = pgEnum("asset_status", [
	"active",
	"inactive",
	"maintenance",
	"retired",
	"assigned",
]);

export const assets = pgTable("assets", {
	id: uuid("id").primaryKey().defaultRandom(),
	userId: text("user_id").notNull(),
	name: text("name").notNull(),
	category: assetCategoryEnum("category").notNull(),
	status: assetStatusEnum("status").notNull().default("active"),
	serialNumber: text("serial_number"),
	manufacturer: text("manufacturer"),
	model: text("model"),
	purchaseDate: text("purchase_date"),
	location: text("location"),
	assignedTo: text("assigned_to"),
	description: text("description"),
	notes: text("notes"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Asset = typeof assets.$inferSelect;
export type NewAsset = typeof assets.$inferInsert;
