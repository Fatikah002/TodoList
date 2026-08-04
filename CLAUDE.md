# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev             # Start dev server on port 3000
npm run build            # Production build (Nitro server output)
npm run preview          # Preview production build
npm run test             # Run all tests once (vitest run)
npx vitest run <path>    # Run a single test file
npm run lint              # Lint with oxlint
npm run lint:fix          # Lint and auto-fix
npm run format             # prettier --write . && oxlint --fix
npm run check              # prettier --check . (CI-style check, no writes)
npm run fmt / fmt:check    # oxfmt (fast formatter, alternative to prettier)
npm run generate-routes    # Regenerate src/routeTree.gen.ts from src/routes
```

Add shadcn/ui components with `pnpm dlx shadcn@latest add <component>` (see `components.json` for config: style `base-nova`, neutral base color, icons from lucide).

## Architecture

This is a **TanStack Start** app (file-based routing via TanStack Router + Vite + Nitro server adapter), using React 19, Tailwind CSS v4, and shadcn/ui (radix-ui primitives).

### Data layer — everything is client-side, no backend

There is no database or API. All todo state lives in `src/hooks/useTodos.tsx`, a React context (`TodosProvider`) that persists the full todo list to `localStorage` under the key `"todos"` and rehydrates from it on load. `TodosProvider` wraps the whole app in `src/routes/__root.tsx`. Any component that needs todo data/actions calls the `useTodos()` hook — never read `localStorage` directly elsewhere.

Key behavior baked into `useTodos`: toggling a repeating todo (`repeat !== 'none'`) to completed auto-generates the next occurrence via `getNextDeadline` (`src/lib/repeat.ts`), deduping against existing incomplete todos with the same title/category/deadline. Archiving is a soft-delete flag (`archived: boolean`) distinct from permanent deletion.

The `Todo` shape is defined in `src/lib/types.ts`. Form validation uses Zod schemas in `src/lib/schemas.ts` (`todoSchema`, per-field validators for use with `@tanstack/react-form`, and `todosSearchSchema` for the `/todos` route's `?view=today|all` search param).

### Routing

File-based routes live in `src/routes/`; `src/routeTree.gen.ts` is generated — do not edit it by hand, run `npm run generate-routes` (or let the dev server regenerate it) after adding/removing route files. Route files map 1:1 to URL paths (e.g. `dashboard.tsx` → `/dashboard`, `account/settings.tsx` → `/account/settings`).

`src/routes/__root.tsx` is the app shell: it sets up `TodosProvider` → `TooltipProvider` → `SidebarProvider`, renders `AppSidebar` (desktop) / `MobileNavbar` (mobile) + `AppHeader`, and derives the header title from the current pathname. Page components live under `src/routes/`; shared UI building blocks live under `src/components/` split into `dashboard/`, `layout/`, `todo/`, and `ui/` (shadcn primitives — treat these as generated/vendored, prefer adding new shadcn components over hand-editing existing ones unless customizing behavior).

### Path aliases

Both `#/*` and `@/*` map to `./src/*` (see `tsconfig.json` and the `imports` field in `package.json`). Existing code mixes both prefixes — match whichever a given file already uses.

### Domain helpers (`src/lib/`)

- `repeat.ts` — computes next deadline for recurring todos (`daily`/`weekly`/`monthly`)
- `deadline.ts` — deadline formatting/status helpers
- `date.ts` — date formatting utilities
- `categories.ts` — todo category definitions
- `navigation.ts` — sidebar/nav item config

### Notable libraries in use

- `@tanstack/react-form` + Zod for form state/validation (see `TodoForm.tsx`, `schemas.ts`)
- `sonner` for toast notifications (`Toaster` mounted in `__root.tsx`)
- `next-themes` for dark/light theme
- `date-fns` + `react-day-picker` for date handling/pickers
