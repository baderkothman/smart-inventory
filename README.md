# Smart Inventory Hub

An AI-powered company asset management dashboard. Track, manage, and describe your organization's assets with the help of Google Gemini AI.

## Features

- **Asset Management** — Create, read, update, and delete company assets with full CRUD operations
- **AI-Generated Descriptions** — Generate rich asset descriptions using Google Gemini 2.0 Flash
- **Data Grid** — Sortable, filterable asset table powered by AG Grid
- **Authentication** — Secure, per-user asset isolation via Clerk
- **Categories** — Organize assets by type: Laptop, Monitor, License, Peripheral, Server, Mobile, Other
- **Status Tracking** — Track asset lifecycle: Active, Inactive, Maintenance, Retired, Assigned

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Database | Neon (Postgres) via Drizzle ORM |
| Auth | Clerk v7 |
| AI | Google Gemini 2.0 Flash (`@google/genai`) |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Data Grid | AG Grid Community v35 |
| Forms | react-hook-form + Zod v4 |
| Linter | Biome |
| Runtime | Bun |

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) installed
- A [Neon](https://neon.tech) Postgres database
- A [Clerk](https://clerk.com) application
- A [Google AI Studio](https://aistudio.google.com) API key

### Installation

```bash
bun install
```

### Environment Variables

Create a `.env.local` file in the project root:

```env
# Neon (Postgres)
DATABASE_URL=

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# Google Gemini
GEMINI_API_KEY=
```

### Database Setup

```bash
bunx drizzle-kit generate
bunx drizzle-kit migrate
```

### Development

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/
│   ├── dashboard/
│   │   ├── assets/new/    # Add asset page
│   │   ├── layout.tsx     # Dashboard layout (sidebar + navbar)
│   │   └── page.tsx       # Main asset grid view
│   ├── layout.tsx
│   └── page.tsx           # Root redirect
├── components/
│   ├── layout/            # Navbar, Sidebar
│   ├── providers/         # Clerk provider
│   └── ui/                # shadcn/ui components
├── db/
│   ├── index.ts           # Drizzle client (Neon serverless)
│   └── schema.ts          # assets table + enums
├── features/
│   ├── ai/
│   │   ├── actions.ts     # generateDescription server action
│   │   └── gemini.ts      # Gemini client
│   └── assets/
│       ├── actions.ts     # createAsset, updateAsset, deleteAsset
│       ├── queries.ts     # getAssets, getAssetById
│       ├── validations.ts # Zod schema
│       └── components/    # AssetGrid, AssetForm, etc.
└── proxy.ts               # Clerk middleware
```

## Data Model

| Field | Type | Description |
|---|---|---|
| `id` | UUID | Primary key |
| `userId` | text | Clerk user ID (owner) |
| `name` | text | Asset name |
| `category` | enum | laptop / monitor / license / peripheral / server / mobile / other |
| `status` | enum | active / inactive / maintenance / retired / assigned |
| `serialNumber` | text | Serial number |
| `manufacturer` | text | Manufacturer name |
| `model` | text | Model name |
| `purchaseDate` | text | Date of purchase |
| `location` | text | Physical location |
| `assignedTo` | text | Assigned employee |
| `description` | text | AI-generated or manual description |
| `notes` | text | Additional notes |
