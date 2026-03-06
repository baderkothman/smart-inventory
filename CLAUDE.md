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
- Dark mode is forced via `class="dark"` on `<html>` in `src/app/layout.tsx`

**AI integration:** `src/features/ai/` — Gemini 2.0 Flash via `@google/genai`. The client is lazily initialized in `src/features/ai/gemini.ts`. The `generateDescription` server action is called directly from the asset form client component.

## Environment Variables

Required in `.env.local`:
- `DATABASE_URL` — Neon postgres connection string
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `GEMINI_API_KEY`
