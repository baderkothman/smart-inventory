# Smart Inventory Hub

> AI-powered company asset management — track, manage, and describe every organizational asset from a single dashboard.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?logo=tailwindcss)](https://tailwindcss.com)
[![Clerk](https://img.shields.io/badge/Auth-Clerk-6C47FF?logo=clerk)](https://clerk.com)
[![Neon](https://img.shields.io/badge/DB-Neon_Postgres-00E699?logo=postgresql)](https://neon.tech)
[![Gemini](https://img.shields.io/badge/AI-Gemini_2.5_Flash-4285F4?logo=google)](https://aistudio.google.com)

---

## Overview

Smart Inventory Hub is a full-stack web application that gives organizations a centralized view of their hardware, software licenses, and peripherals. It features an analytics dashboard, a searchable asset table, and one-click AI description generation powered by Google Gemini.

Every asset is scoped to the authenticated user — no cross-account data leakage by design.

---

## Features

| Feature | Description |
|---|---|
| **Analytics Dashboard** | KPI cards, status distribution bars, category breakdown, and a recent assets table |
| **Asset Table** | Searchable, sortable table with status badges and inline edit/delete actions |
| **AI Descriptions** | Generate rich asset descriptions in one click using Gemini 2.5 Flash |
| **Full CRUD** | Create, view, edit, and delete assets via server actions — no API routes |
| **Secure by Default** | Row-level ownership enforced on every query via Clerk `userId` |
| **Flip Auth Card** | Sign in / sign up on the landing page via a 3D flipping card |
| **Dark / Light Theme** | Full theme support via `next-themes` with system default |
| **Responsive Layout** | Mobile-first design with collapsible sidebar and responsive tables |

**Asset fields:** name, category, status, serial number, manufacturer, model, purchase date, location, assigned to, description, notes.

**Categories:** `laptop` · `monitor` · `license` · `peripheral` · `server` · `mobile` · `other`

**Statuses:** `active` · `assigned` · `maintenance` · `inactive` · `retired`

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [Next.js 16](https://nextjs.org) — App Router, Server Components, Server Actions |
| **Language** | TypeScript 5 |
| **Database** | [Neon](https://neon.tech) serverless Postgres via [Drizzle ORM](https://orm.drizzle.team) |
| **Auth** | [Clerk v7](https://clerk.com) — embedded sign-in/sign-up, middleware protection |
| **AI** | [Google Gemini 2.5 Flash](https://aistudio.google.com) via `@google/genai` |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com) |
| **Forms** | `react-hook-form` + Zod v4 |
| **Notifications** | Sonner toast notifications |
| **Linter / Formatter** | [Biome](https://biomejs.dev) |
| **Runtime / Package Manager** | [Bun](https://bun.sh) |

---

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) ≥ 1.0
- A [Neon](https://neon.tech) Postgres database (free tier works)
- A [Clerk](https://clerk.com) application (free tier works)
- A [Google AI Studio](https://aistudio.google.com) API key with access to Gemini 2.5 Flash

### 1. Clone & Install

```bash
git clone https://github.com/baderkothman/smart-inventory.git
cd smart-inventory
bun install
```

### 2. Environment Variables

Create a `.env.local` file in the project root:

```env
# Neon — get from: https://console.neon.tech → your project → Connection string
DATABASE_URL=postgresql://user:password@host.neon.tech/dbname?sslmode=require

# Clerk — get from: https://dashboard.clerk.com → your app → API keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Google Gemini — get from: https://aistudio.google.com/app/apikey
GEMINI_API_KEY=AIza...
```

### 3. Database Setup

```bash
# Generate migration files from the schema
bunx drizzle-kit generate

# Apply migrations to your Neon database
bunx drizzle-kit migrate
```

### 4. Run Development Server

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000). Sign up for an account and start adding assets.

---

## Project Structure

```
smart-inventory/
├── scripts/
│   └── seed.ts                  # Optional: seed demo assets for a user
├── src/
│   ├── app/
│   │   ├── page.tsx             # Landing page (flip auth card + feature overview)
│   │   ├── layout.tsx           # Root layout (theme provider, Clerk provider)
│   │   └── dashboard/
│   │       ├── layout.tsx       # Dashboard shell (sidebar + topbar)
│   │       ├── page.tsx         # Analytics overview (KPIs, charts, recent assets)
│   │       └── assets/
│   │           ├── page.tsx     # Assets listing (searchable table)
│   │           └── new/
│   │               └── page.tsx # Add new asset form
│   ├── components/
│   │   ├── auth/
│   │   │   └── flip-auth-card.tsx   # 3D flip card with Clerk SignIn / SignUp
│   │   ├── layout/
│   │   │   ├── sidebar.tsx          # Desktop sidebar navigation
│   │   │   ├── mobile-sidebar.tsx   # Mobile slide-out sidebar
│   │   │   └── topbar.tsx           # Top navigation bar
│   │   ├── providers/
│   │   │   ├── clerk-provider.tsx   # Clerk context wrapper
│   │   │   └── theme-provider.tsx   # next-themes wrapper
│   │   └── ui/                      # shadcn/ui components
│   ├── db/
│   │   ├── index.ts             # Drizzle client (Neon serverless)
│   │   └── schema.ts            # assets table schema + enums
│   ├── features/
│   │   ├── ai/
│   │   │   ├── actions.ts       # generateDescription server action (Gemini)
│   │   │   └── gemini.ts        # Lazy Gemini client initialization
│   │   └── assets/
│   │       ├── actions.ts       # createAsset, updateAsset, deleteAsset
│   │       ├── queries.ts       # getAssets, getAssetById (user-scoped)
│   │       ├── validations.ts   # Zod schema for asset form
│   │       └── components/
│   │           ├── asset-form.tsx   # Create / edit form (react-hook-form)
│   │           └── asset-table.tsx  # Client-side searchable table
│   └── proxy.ts                 # Clerk middleware (protects /dashboard/**)
```

---

## Data Model

```sql
assets (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       TEXT NOT NULL,          -- Clerk user ID (row-level ownership)
  name          TEXT NOT NULL,
  category      asset_category NOT NULL, -- enum
  status        asset_status NOT NULL,   -- enum, default 'active'
  serial_number TEXT,
  manufacturer  TEXT,
  model         TEXT,
  purchase_date TEXT,
  location      TEXT,
  assigned_to   TEXT,
  description   TEXT,
  notes         TEXT,
  created_at    TIMESTAMP DEFAULT now(),
  updated_at    TIMESTAMP DEFAULT now()
)
```

---

## Architecture Notes

- **No API routes.** All mutations use Next.js Server Actions. All reads use Server Components calling query functions directly.
- **Row-level security in application code.** Every query includes `AND user_id = $userId` — assets are always scoped to the signed-in user.
- **Middleware lives in `src/proxy.ts`**, not `middleware.ts`. This is intentional for Next.js 16 compatibility.
- **Tailwind v4** uses `@import "tailwindcss"` in `globals.css` with no `tailwind.config.js`.
- **Zod v4 + react-hook-form:** Enum fields use `useForm` defaults instead of `.default()` in the Zod schema due to a known incompatibility.
- **Gemini model:** Uses `gemini-2.5-flash` via the v1beta API endpoint. Older models (`gemini-2.0-flash`, `gemini-1.5-flash`) are not available for new API keys.

---

## Available Commands

```bash
bun dev                        # Start development server (http://localhost:3000)
bun run build                  # Production build
bunx biome check .             # Lint + format check
bunx biome check --write .     # Lint + format auto-fix
bunx drizzle-kit generate      # Generate DB migration files from schema changes
bunx drizzle-kit migrate       # Apply pending migrations to the database
bunx drizzle-kit studio        # Open Drizzle Studio (database browser)
bun run scripts/seed.ts        # Seed demo assets for a specific user (edit email in script)
```

---

## Seeding Demo Data

A seed script is included at `scripts/seed.ts` that inserts 20 realistic sample assets (laptops, monitors, licenses, servers, peripherals, mobiles) covering all categories and statuses.

To use it, set `TARGET_EMAIL` in the script to the email address of an existing Clerk user, then run:

```bash
bun run scripts/seed.ts
```

The script automatically looks up the Clerk user ID from the email via the Clerk REST API and inserts the assets into the database.

---

## License

MIT
