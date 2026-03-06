import { resolve } from "node:path";
import * as dotenv from "dotenv";

// Load .env.local
dotenv.config({ path: resolve(process.cwd(), ".env.local") });

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "../src/db/schema";

const TARGET_EMAIL = "bader0198@gmail.com";

async function getClerkUserId(email: string): Promise<string> {
	const res = await fetch(
		`https://api.clerk.com/v1/users?email_address[]=${encodeURIComponent(email)}`,
		{
			headers: {
				Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
			},
		},
	);
	if (!res.ok) {
		throw new Error(`Clerk API error: ${res.status} ${await res.text()}`);
	}
	const users = (await res.json()) as Array<{ id: string }>;
	if (!users.length) {
		throw new Error(`No Clerk user found with email: ${email}`);
	}
	return users[0].id;
}

const SEED_ASSETS: Omit<
	schema.NewAsset,
	"id" | "userId" | "createdAt" | "updatedAt"
>[] = [
	{
		name: 'MacBook Pro 16" M3',
		category: "laptop",
		status: "assigned",
		serialNumber: "C02XR0XXJGH5",
		manufacturer: "Apple",
		model: "MacBook Pro 16 M3 Pro",
		purchaseDate: "2024-01-15",
		location: "Office - Desk 12",
		assignedTo: "Bader Al-Kothman",
		description:
			"High-performance laptop for engineering workloads. Equipped with M3 Pro chip, 36GB unified memory, and 512GB SSD.",
		notes: "Primary development machine",
	},
	{
		name: "Dell UltraSharp U2723D",
		category: "monitor",
		status: "assigned",
		serialNumber: "CN0P8VJ30034",
		manufacturer: "Dell",
		model: "U2723D",
		purchaseDate: "2024-01-15",
		location: "Office - Desk 12",
		assignedTo: "Bader Al-Kothman",
		description:
			"27-inch 4K USB-C monitor with IPS Black panel, 98% DCI-P3 color coverage. Connected via Thunderbolt.",
		notes: "Paired with MacBook Pro",
	},
	{
		name: "ThinkPad X1 Carbon Gen 11",
		category: "laptop",
		status: "active",
		serialNumber: "PF3N4X21",
		manufacturer: "Lenovo",
		model: "ThinkPad X1 Carbon Gen 11",
		purchaseDate: "2023-06-10",
		location: "Storage Room B",
		assignedTo: null,
		description:
			"Ultra-lightweight business laptop with Intel Core i7-1365U, 16GB LPDDR5, 512GB NVMe SSD.",
		notes: "Spare unit — available for new hires",
	},
	{
		name: "HP ProDesk 600 G9",
		category: "server",
		status: "active",
		serialNumber: "MXL3140LK2",
		manufacturer: "HP",
		model: "ProDesk 600 G9 SFF",
		purchaseDate: "2023-03-20",
		location: "Server Room",
		assignedTo: null,
		description:
			"Small form factor desktop deployed as an internal dev server. Intel Core i5-12500, 32GB DDR4, 1TB SSD.",
		notes: "Running Ubuntu Server 22.04",
	},
	{
		name: "GitHub Copilot Enterprise",
		category: "license",
		status: "active",
		serialNumber: null,
		manufacturer: "GitHub",
		model: "Copilot Enterprise",
		purchaseDate: "2024-03-01",
		location: null,
		assignedTo: null,
		description:
			"Organization-wide GitHub Copilot Enterprise subscription. Covers unlimited seats under the organization account.",
		notes: "Annual renewal — next renewal: March 2026",
	},
	{
		name: "JetBrains All Products Pack",
		category: "license",
		status: "active",
		serialNumber: null,
		manufacturer: "JetBrains",
		model: "All Products Pack (5 seats)",
		purchaseDate: "2023-11-01",
		location: null,
		assignedTo: null,
		description:
			"5-seat floating license covering all JetBrains IDEs including IntelliJ IDEA, WebStorm, DataGrip, and Rider.",
		notes: "3 seats currently in use",
	},
	{
		name: "iPhone 15 Pro",
		category: "mobile",
		status: "assigned",
		serialNumber: "F7LVX3JJPM",
		manufacturer: "Apple",
		model: "iPhone 15 Pro 256GB",
		purchaseDate: "2023-10-05",
		location: "Office",
		assignedTo: "Bader Al-Kothman",
		description:
			"Company-issued iPhone 15 Pro with 256GB storage. Enrolled in Apple Business Manager and MDM.",
		notes: "MDM enrolled — AppleCare+ until Oct 2025",
	},
	{
		name: "Logitech MX Keys S",
		category: "peripheral",
		status: "assigned",
		serialNumber: "2210LZ9B3456",
		manufacturer: "Logitech",
		model: "MX Keys S",
		purchaseDate: "2024-02-01",
		location: "Office - Desk 12",
		assignedTo: "Bader Al-Kothman",
		description:
			"Premium wireless keyboard with smart backlighting and multi-device Bluetooth pairing (up to 3 devices).",
		notes: null,
	},
	{
		name: "Logitech MX Master 3S",
		category: "peripheral",
		status: "assigned",
		serialNumber: "2212LZ1A7890",
		manufacturer: "Logitech",
		model: "MX Master 3S",
		purchaseDate: "2024-02-01",
		location: "Office - Desk 12",
		assignedTo: "Bader Al-Kothman",
		description:
			"High-precision wireless mouse with electromagnetic scrolling, 8K DPI sensor, and USB-C charging.",
		notes: null,
	},
	{
		name: "Cisco Catalyst 9200 Switch",
		category: "server",
		status: "active",
		serialNumber: "FJC2310K0GX",
		manufacturer: "Cisco",
		model: "Catalyst 9200-24P",
		purchaseDate: "2022-08-15",
		location: "Server Room - Rack 2",
		assignedTo: null,
		description:
			"24-port PoE+ managed network switch providing core switching for the office network. Supports 802.1X and QoS.",
		notes: "SmartNet contract active until Aug 2025",
	},
	{
		name: 'Samsung 49" Odyssey OLED G9',
		category: "monitor",
		status: "active",
		serialNumber: "0MKN4BBT300073X",
		manufacturer: "Samsung",
		model: "Odyssey OLED G9 LS49CG934S",
		purchaseDate: "2024-04-10",
		location: "Conference Room A",
		assignedTo: null,
		description:
			"49-inch curved OLED ultrawide display used for presentations and collaborative reviews. 5120x1440 resolution.",
		notes: "Available for bookings — shared resource",
	},
	{
		name: 'iPad Pro 13" M4',
		category: "mobile",
		status: "maintenance",
		serialNumber: "DLXWY2ABCDEF",
		manufacturer: "Apple",
		model: "iPad Pro 13 M4 WiFi 256GB",
		purchaseDate: "2024-06-01",
		location: "IT Support",
		assignedTo: null,
		description:
			"13-inch iPad Pro with M4 chip, Ultra Retina XDR display. Enrolled in Apple Business Manager.",
		notes: "Screen replacement in progress — estimated return: 2 weeks",
	},
	{
		name: "Microsoft 365 Business Premium",
		category: "license",
		status: "active",
		serialNumber: null,
		manufacturer: "Microsoft",
		model: "Microsoft 365 Business Premium (10 seats)",
		purchaseDate: "2023-01-01",
		location: null,
		assignedTo: null,
		description:
			"10-seat Microsoft 365 Business Premium subscription covering Outlook, Teams, SharePoint, OneDrive, and Intune.",
		notes: "Annual renewal — next renewal: January 2026",
	},
	{
		name: "Keychron Q1 Pro",
		category: "peripheral",
		status: "active",
		serialNumber: null,
		manufacturer: "Keychron",
		model: "Q1 Pro QMK (Gateron G Pro Red)",
		purchaseDate: "2023-09-12",
		location: "Storage Room B",
		assignedTo: null,
		description:
			"75% layout hot-swappable mechanical keyboard with QMK/VIA support. Aluminum body with south-facing RGB.",
		notes: "Spare peripheral — available on request",
	},
	{
		name: "UniFi Dream Machine Pro",
		category: "server",
		status: "active",
		serialNumber: "F09FC2A3B4C5",
		manufacturer: "Ubiquiti",
		model: "UniFi Dream Machine Pro",
		purchaseDate: "2022-05-20",
		location: "Server Room - Rack 1",
		assignedTo: null,
		description:
			"All-in-one network appliance acting as firewall, router, and UniFi controller. Manages all office WiFi APs.",
		notes: "Firmware auto-updates enabled",
	},
	{
		name: "Synology DS923+",
		category: "server",
		status: "active",
		serialNumber: "2350OQN123456",
		manufacturer: "Synology",
		model: "DiskStation DS923+",
		purchaseDate: "2023-02-14",
		location: "Server Room - Rack 1",
		assignedTo: null,
		description:
			"4-bay NAS used for local backups and shared file storage. Populated with 4×8TB WD Red Plus drives (RAID 5).",
		notes: "24TB usable — 14TB used. Daily backup runs at 02:00",
	},
	{
		name: "Dell XPS 15 9530",
		category: "laptop",
		status: "retired",
		serialNumber: "7KR8X53",
		manufacturer: "Dell",
		model: "XPS 15 9530",
		purchaseDate: "2021-04-01",
		location: "Storage Room B",
		assignedTo: null,
		description:
			"15-inch Dell XPS with Intel Core i7-11800H and NVIDIA RTX 3050. Battery no longer holds charge.",
		notes: "Retired — pending recycling. Data wiped.",
	},
	{
		name: "Figma Organization",
		category: "license",
		status: "active",
		serialNumber: null,
		manufacturer: "Figma",
		model: "Figma Organization Plan (3 seats)",
		purchaseDate: "2024-01-01",
		location: null,
		assignedTo: null,
		description:
			"Figma Organization plan covering the design team. Includes unlimited files, branching, and advanced prototyping.",
		notes: "All 3 seats assigned to design team",
	},
	{
		name: "Sony WH-1000XM5",
		category: "peripheral",
		status: "assigned",
		serialNumber: "5085923",
		manufacturer: "Sony",
		model: "WH-1000XM5",
		purchaseDate: "2023-07-22",
		location: "Office - Desk 12",
		assignedTo: "Bader Al-Kothman",
		description:
			"Industry-leading noise-cancelling wireless headphones. Used for calls and focused work sessions.",
		notes: null,
	},
	{
		name: 'LG UltraFine 27" 5K',
		category: "monitor",
		status: "inactive",
		serialNumber: "111NTPB7Y123",
		manufacturer: "LG",
		model: "UltraFine 27MD5KLB",
		purchaseDate: "2021-09-10",
		location: "Storage Room A",
		assignedTo: null,
		description:
			"27-inch 5K Retina display with Thunderbolt 3 connectivity and built-in camera/mic. No longer in active use.",
		notes: "Replaced by Dell U2723D. Available for redeployment.",
	},
];

async function main() {
	console.log(`Looking up Clerk user for: ${TARGET_EMAIL}`);
	const userId = await getClerkUserId(TARGET_EMAIL);
	console.log(`Found user ID: ${userId}`);

	// biome-ignore lint/style/noNonNullAssertion: required env var
	const sql = neon(process.env.DATABASE_URL!);
	const db = drizzle(sql, { schema });

	const rows = SEED_ASSETS.map((asset) => ({ ...asset, userId }));

	console.log(`Inserting ${rows.length} assets...`);
	await db.insert(schema.assets).values(rows);
	console.log("Seed complete!");
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
