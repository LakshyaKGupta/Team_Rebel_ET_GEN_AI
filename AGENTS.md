# AGENTS.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

AI-Native News Experience for the Economic Times. Two core features:
- **My ET**: Personalized newsroom showing user-type-specific news topics
- **News Navigator**: Interactive AI briefings with structured prompts tailored to each user's profile

The AI layer is currently in **demonstration mode** — `/api/ai/briefing` returns generated prompt structures and instructions rather than calling an external LLM.

## Commands

```bash
# Development
npm run dev       # Start Next.js dev server (http://localhost:3000)
npm run build     # Production build
npm run start     # Start production server
npm run lint      # ESLint via next lint

# Database
npx prisma migrate dev      # Run pending migrations and regenerate client
npx prisma generate         # Regenerate Prisma client after schema changes
npx prisma studio           # Open browser-based DB GUI
```

There is no test suite configured in this project.

## Environment Variables

Required in `.env`:
- `DATABASE_URL` — SQLite file path, e.g. `file:./dev.db`
- `JWT_SECRET` — Secret for signing JWTs (defaults to an insecure fallback if absent)
- `JWT_EXPIRES_IN` — Token TTL (defaults to `7d`)

## Architecture

### Stack
- **Next.js 14** (App Router) with TypeScript and Tailwind CSS
- **Prisma** with `better-sqlite3` adapter — DB file lives at `prisma/dev.db` (hardcoded in `src/lib/prisma.ts`)
- **Authentication**: bcrypt password hashing + JWT stored as an `auth-token` HTTP-only cookie
- **Animation**: Framer Motion; icons: Lucide React

### Request / Auth Flow
1. Login/signup calls `/api/auth/login` or `/api/auth/signup`, which sets an `auth-token` cookie.
2. All subsequent API calls read this cookie. The middleware (`src/middleware.ts`) blocks non-whitelisted API routes if no token is present, but currently does **not** redirect unauthenticated page requests (the redirect logic is stubbed).
3. `UserContext` (`src/context/UserContext.tsx`) fetches `/api/auth/me` on mount and is the single source of truth for auth state throughout the app.

### User Onboarding & Routing
`src/app/root.tsx` (rendered by `src/app/page.tsx`) inspects `preferences.hasCompletedOnboarding` and renders either `<Onboarding />` or `<Dashboard />`. There are no separate route segments for these — routing is purely conditional.

User profile dimensions collected during onboarding:
- `userType`: `investor | student | founder | exploring`
- `experienceLevel`: `beginner | intermediate | advanced`
- `riskAppetite`: `conservative | moderate | aggressive`
- `timeHorizon`: `short | medium | long`
- `goal`: `invest | stay_updated | learn`
- `selectedInterests`: array stored as a JSON string in the DB, parsed on every read in `src/lib/auth.ts` and `src/app/api/ai/briefing/route.ts`

### Personalization Engine (`src/lib/personalization.ts`)
The core logic that translates a `UserProfile` into AI prompt instructions. Key exports:
- `generateAIInstructions(profile)` — returns an `AIInstruction` with tone, focus areas, output format
- `getStructuredAIPrompt({ topic, articles, profile, mode })` — builds the full structured prompt string for three modes: `explain_simply`, `impact_on_me`, `deep_dive`

The briefing API (`/api/ai/briefing`) accepts an optional `simulatedUserType` to preview how a topic would be briefed for a different persona without modifying the user's stored preferences.

### Static Data (`src/lib/data.ts`)
News topic cards are currently **static mock data** keyed by `userType`. There is no live news API integration yet (README mentions GDELT/NewsAPI as the intended data source).

### React Contexts
- `UserContext` — auth state, user profile, preferences, profile mutations
- `BriefingContext` — selected topic, AI response cache (keyed by `mode`), loading/error state

Both providers are mounted in `src/app/layout.tsx`.

### API Routes
| Route | Purpose |
|---|---|
| `POST /api/auth/signup` | Create account + default preferences |
| `POST /api/auth/login` | Authenticate, set cookie |
| `POST /api/auth/logout` | Clear cookie |
| `GET /api/auth/me` | Return current user + preferences |
| `GET/PUT /api/auth/preferences` | Read/update onboarding preferences |
| `GET/PATCH /api/profile` | Read/update name and avatar URL |
| `POST /api/auth/change-password` | Change password |
| `POST /api/auth/upload-avatar` | Upload avatar (stores URL) |
| `POST /api/ai/briefing` | Generate personalized prompt structure |
| `GET/PUT /api/preferences` | Alias preferences endpoint |

### Key Quirks
- `selectedInterests` is stored as a JSON-stringified array in SQLite. Always `JSON.parse` on read and `JSON.stringify` on write.
- The Prisma client is instantiated with a `better-sqlite3` adapter (not the default query engine) configured in `src/lib/prisma.ts`. Do not switch to the default engine without updating this file.
- `src/app/root.tsx` is a client component that does the onboarding gate — it is imported and re-exported by `src/app/page.tsx`.
