import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";

config({ path: ".env.local" });

const userId = process.argv[2] ?? process.env.SEED_USER_ID;
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
	console.error("Missing DATABASE_URL in environment.");
	process.exit(1);
}

if (!userId) {
	console.error("Usage: npm run seed:assets -- <clerk_user_id>");
	console.error("Or set SEED_USER_ID in your environment.");
	process.exit(1);
}

const sql = neon(databaseUrl);

const seedAssets = [
	{
		name: "Seed - Dell XPS 15 9530",
		category: "laptop",
		status: "assigned",
		serialNumber: "DXP15-9530-1001",
		manufacturer: "Dell",
		model: "XPS 15 9530",
		purchaseDate: "2025-03-15",
		location: "Floor 2, Room 201",
		assignedTo: "bader0198@gmail.com",
		description:
			"High-performance laptop for development and data analysis workloads.",
		notes: "Primary engineering workstation.",
	},
	{
		name: "Seed - MacBook Pro 14 M3",
		category: "laptop",
		status: "active",
		serialNumber: "MBP14-M3-1002",
		manufacturer: "Apple",
		model: "MacBook Pro 14",
		purchaseDate: "2025-01-10",
		location: "Floor 2, Room 204",
		assignedTo: "it-team@example.com",
		description: "Portable workstation for design and mobile testing.",
		notes: null,
	},
	{
		name: "Seed - LG UltraFine 27",
		category: "monitor",
		status: "active",
		serialNumber: "LG27-1003",
		manufacturer: "LG",
		model: "27UL850",
		purchaseDate: "2024-11-20",
		location: "Floor 2, Room 201",
		assignedTo: "bader0198@gmail.com",
		description: "27-inch 4K external monitor for development setup.",
		notes: null,
	},
	{
		name: "Seed - Dell P2422H",
		category: "monitor",
		status: "active",
		serialNumber: "DP24-1004",
		manufacturer: "Dell",
		model: "P2422H",
		purchaseDate: "2024-10-02",
		location: "Floor 1, Open Space",
		assignedTo: "hr@example.com",
		description: "24-inch office monitor for day-to-day operations.",
		notes: null,
	},
	{
		name: "Seed - Adobe CC License",
		category: "license",
		status: "active",
		serialNumber: "ADOBE-1005",
		manufacturer: "Adobe",
		model: "Creative Cloud Business",
		purchaseDate: "2025-02-01",
		location: "Cloud",
		assignedTo: "design-team@example.com",
		description: "Annual design suite license for creative team.",
		notes: "Renews every February.",
	},
	{
		name: "Seed - JetBrains All Products",
		category: "license",
		status: "assigned",
		serialNumber: "JB-1006",
		manufacturer: "JetBrains",
		model: "All Products Pack",
		purchaseDate: "2025-01-05",
		location: "Cloud",
		assignedTo: "engineering@example.com",
		description: "Developer IDE subscription package.",
		notes: null,
	},
	{
		name: "Seed - Logitech MX Keys",
		category: "peripheral",
		status: "active",
		serialNumber: "MXK-1007",
		manufacturer: "Logitech",
		model: "MX Keys",
		purchaseDate: "2024-09-18",
		location: "Storage Room A",
		assignedTo: null,
		description: "Wireless keyboard for desktop and laptop setups.",
		notes: "Spare unit.",
	},
	{
		name: "Seed - Logitech MX Master 3S",
		category: "peripheral",
		status: "active",
		serialNumber: "MXM-1008",
		manufacturer: "Logitech",
		model: "MX Master 3S",
		purchaseDate: "2024-09-18",
		location: "Storage Room A",
		assignedTo: null,
		description: "Ergonomic wireless mouse for staff onboarding kits.",
		notes: null,
	},
	{
		name: "Seed - Dell PowerEdge R750",
		category: "server",
		status: "maintenance",
		serialNumber: "SVR-1009",
		manufacturer: "Dell",
		model: "PowerEdge R750",
		purchaseDate: "2023-12-12",
		location: "Data Center Rack B3",
		assignedTo: "infra@example.com",
		description: "On-prem compute server for internal services.",
		notes: "Scheduled firmware update window.",
	},
	{
		name: "Seed - HP ProLiant DL360",
		category: "server",
		status: "active",
		serialNumber: "SVR-1010",
		manufacturer: "HP",
		model: "ProLiant DL360",
		purchaseDate: "2023-11-03",
		location: "Data Center Rack B1",
		assignedTo: "infra@example.com",
		description: "Database and backup replication server.",
		notes: null,
	},
	{
		name: "Seed - iPhone 15 Pro",
		category: "mobile",
		status: "assigned",
		serialNumber: "IPH15-1011",
		manufacturer: "Apple",
		model: "iPhone 15 Pro",
		purchaseDate: "2025-02-18",
		location: "Field Team",
		assignedTo: "sales@example.com",
		description: "Company mobile phone for account management.",
		notes: null,
	},
	{
		name: "Seed - Samsung Galaxy S25",
		category: "mobile",
		status: "active",
		serialNumber: "SGS25-1012",
		manufacturer: "Samsung",
		model: "Galaxy S25",
		purchaseDate: "2025-02-25",
		location: "QA Lab",
		assignedTo: "qa@example.com",
		description: "Android device for QA testing and validation.",
		notes: null,
	},
];

const targetNames = seedAssets.map((asset) => asset.name);
const existingRows = await sql`
	SELECT name
	FROM public.assets
	WHERE user_id = ${userId}
	AND name = ANY(${targetNames})
`;

const existingNames = new Set(existingRows.map((row) => row.name));
let inserted = 0;
let skipped = 0;

for (const asset of seedAssets) {
	if (existingNames.has(asset.name)) {
		skipped += 1;
		continue;
	}

	await sql`
		INSERT INTO public.assets (
			user_id,
			name,
			category,
			status,
			serial_number,
			manufacturer,
			model,
			purchase_date,
			location,
			assigned_to,
			description,
			notes
		) VALUES (
			${userId},
			${asset.name},
			${asset.category},
			${asset.status},
			${asset.serialNumber},
			${asset.manufacturer},
			${asset.model},
			${asset.purchaseDate},
			${asset.location},
			${asset.assignedTo},
			${asset.description},
			${asset.notes}
		)
	`;

	inserted += 1;
}

const [{ count }] = await sql`
	SELECT COUNT(*)::int AS count
	FROM public.assets
	WHERE user_id = ${userId}
`;

console.log(`Seed completed for user: ${userId}`);
console.log(`Inserted: ${inserted}`);
console.log(`Skipped (already existed): ${skipped}`);
console.log(`Total assets for user: ${count}`);
