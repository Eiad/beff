# B-eff — Pre-Launch SaaS MVP

A pre-launch B2B sustainability platform. Built as an interview assignment for [B-eff.com](https://beff.com).

---

## Setup

**Requirements:** Node 20+ (see `.nvmrc`)

```bash
# From the repo root
npm install             # install root dependencies (concurrently)
cd backend && npm install
cd ../frontend && npm install
cd ..
```

Copy environment files:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Start both servers:

```bash
npm run dev
```

- Frontend → http://localhost:5173
- Backend API → http://localhost:3001

---

## Running Tests

**Backend** (from `backend/`):
```bash
npm run test          # unit tests (Jest)
npm run test:e2e      # integration tests (Supertest against real NestJS app)
```

**Frontend** (from `frontend/`):
```bash
npm run test          # component tests (Vitest + React Testing Library)
```

---

## Architecture

### Backend — NestJS

**Intentional simplifications** for this MVP:
- **No passport stack** — replaced the full `passport + passport-jwt + JwtStrategy + PassportModule` chain with a single custom `JwtGuard` using `jsonwebtoken` directly. Fewer abstractions, same security.
- **In-memory Map store** — `UsersService` stores users in a `Map<string, UserRecord>`. Data resets on server restart. Noted in code comments; swap for a real database when needed.
- **`crypto.randomUUID()`** instead of the `uuid` package — Node.js built-in, avoids the ESM/CJS conflict Jest has with the uuid package.

**Modules:**
- `AuthModule` — register + login, bcrypt hashing, JWT signing
- `UsersModule` — CRUD, export, delete; all protected by `JwtGuard`

**Security choices:**
- Same 401 for unknown email and wrong password — prevents user enumeration
- `passwordHash` never leaves `UsersService` — all returned objects are `Omit<User, 'passwordHash'>`
- JWT expiry: 7 days

### Frontend — React + Vite

**Stack:** Vite + React 19 + TypeScript + Tailwind CSS v4 + shadcn/ui

**Auth flow:**
- On mount, `AuthContext` reads the token from `localStorage`, decodes it with `jwt-decode`, checks `exp` — no network call needed
- `ProtectedRoute` and `PublicOnlyRoute` both wait for hydration (`isLoading`) before rendering, preventing auth-state flicker
- 401 response interceptor in Axios automatically clears the token and redirects to `/login`

**Forms:** `react-hook-form` + `zod` — one schema handles both client validation and TypeScript types.

**Landing page design:** Ported from an existing Next.js project (`code-park`). Stripped of Next.js-specific APIs (`next/image`, `next-intl`, `'use client'`). Uses a canvas-based 3D geometric animation (d3), animated logo with letter wave effect (motion), and scroll indicator.

---

## GDPR Features

Both features are accessible from `/profile` (authenticated users only).

| Feature | Endpoint | Implementation |
|---|---|---|
| **Right to Data Portability** | `GET /users/me/export` | Returns user data as a JSON file download with `Content-Disposition: attachment` |
| **Right to Erasure** | `DELETE /users/me` | Deletes account; requires confirmation modal before proceeding; invalidates JWT immediately (JwtGuard checks `usersService.findById`) |

---

## UI/UX Decisions

- **Pre-launch framing** — Landing page uses "Join the Waitlist" / "Early Access" language. No pricing section (product isn't launched yet). 500+ companies social proof badge.
- **B2B metrics on Dashboard** — Fleet CO₂ Reduced, Teams Enrolled, Compliance Score, Reports Generated. Designed for team/organization use, not individual.
- **Inline name editing on Profile** — pencil icon → input pre-filled with current name, Save/Cancel buttons, Escape key cancels. Feels immediate without a separate edit page.
- **Same error for wrong password and unknown email** — prevents attackers from enumerating which emails are registered.
- **`aria-live="polite"` on form errors** — server-side errors (409 duplicate email, 401 invalid credentials) are announced to screen readers without focus disruption.

---

## Tech Choices

| Choice | Reason |
|---|---|
| NestJS | Assignment requirement |
| `jsonwebtoken` directly (no passport) | Simpler than 5+ passport packages for the same outcome |
| Zod for validation | Single schema → TypeScript types + runtime validation; works in both backend (NestJS pipe) and frontend (react-hook-form resolver) |
| Vite over Next.js | Assignment is frontend-focused; no SSR needed; faster iteration |
| Tailwind v4 | Latest version; CSS-first config (`@theme`) instead of `tailwind.config.js` |
| shadcn/ui | Accessible, production-ready components (Button, Input, Dialog, Card) — copied into `src/`, no lock-in |
| In-memory Map | Assignment says "simple and functional"; clearly documented in code and README |
