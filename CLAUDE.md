# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
bun dev                                    # start dev server
bun run build                              # production build
bunx biome check .                         # lint + format check
bunx biome check --write .                 # lint + format fix (auto)
bunx drizzle-kit generate                  # generate DB migrations
bunx drizzle-kit migrate                   # apply DB migrations
```

No test suite exists in this project.

## Architecture

**Feature-based structure** under `src/features/`. Each feature owns its actions, queries, validations, and components.

**Data flow:**
- Server Components (`page.tsx` files) call query functions directly (no API routes)
- Client Components call Server Actions for mutations
- All mutations are in `src/features/assets/actions.ts` — each one calls `auth()` from Clerk and enforces row-level ownership via `AND userId = ?` in every query

**Key conventions:**
- Clerk middleware lives in `src/proxy.ts` (not `middleware.ts`) — this is a Next.js 16 convention
- All `/dashboard` routes are protected by `src/proxy.ts`
- Drizzle ORM with Neon serverless postgres; schema in `src/db/schema.ts`
- Zod validation happens server-side in actions, not just client-side in forms. Don't use `.default()` on enum fields in Zod schemas — set defaults in `useForm` instead (Zod v4 + react-hook-form incompatibility)
- AG Grid v35: must pass `modules` array prop explicitly; use `themeQuartz.withParams()` for custom theming
- Tailwind v4: no `tailwind.config.js`, uses `@import "tailwindcss"` in globals.css. `biome.json` has `css.parser.tailwindDirectives: true` to support `@theme`, `@custom-variant`, `@apply`
- Dark mode default set via `<ThemeProvider defaultTheme="dark" enableSystem={false}>` in `src/app/layout.tsx` — no hardcoded class; user can toggle via ThemeToggle

**AI integration:** `src/features/ai/` — Gemini 2.5 Flash (`gemini-2.5-flash`) via `@google/genai`. The client is lazily initialized in `src/features/ai/gemini.ts`. The `generateDescription` server action is called directly from the asset form client component.

## Key Files

- `src/proxy.ts` — Clerk middleware (protects `/dashboard/**`)
- `src/db/schema.ts` — assets table + enums (category, status)
- `src/db/index.ts` — Drizzle client (Neon serverless)
- `src/features/assets/actions.ts` — createAsset, updateAsset, deleteAsset
- `src/features/assets/queries.ts` — getAssets, getAssetById
- `src/features/assets/validations.ts` — Zod schema
- `src/features/ai/actions.ts` — generateDescription server action
- `src/features/ai/gemini.ts` — lazily initialized Gemini client
- `src/components/auth/flip-auth-card.tsx` — Clerk SignIn/SignUp embedded with 3D flip animation
- `src/components/layout/` — Navbar, Sidebar, MobileSidebar, ThemeToggle

## App Routes

- `/` — public landing page + auth (auto-redirects to `/dashboard` if signed in)
- `/dashboard` — analytics overview (protected)
- `/assets` — asset list with AG Grid (uses dashboard shell layout)
- `/assets/new` — create asset form

## Gotchas

- Clerk embedded `<SignIn>` / `<SignUp>` on the root page **must** use `routing="hash"` — default virtual routing breaks under Next.js App Router
- Clerk v7: `UserButton` has no `afterSignOutUrl` prop
- Add new shadcn components with `bunx shadcn add <component>`

## Setup (new environment)

```bash
# 1. Fill in credentials
cp .env.local.example .env.local   # or create manually — see Environment Variables below

# 2. Apply DB schema
bunx drizzle-kit generate && bunx drizzle-kit migrate

# 3. Start
bun dev
```

## Environment Variables

Required in `.env.local`:
- `DATABASE_URL` — Neon postgres connection string
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `GEMINI_API_KEY`
