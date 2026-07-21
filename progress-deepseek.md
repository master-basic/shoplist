# GroceryMind — Senior Engineer Assessment

## By the Numbers
- **~11,300 lines** across 86 source files (frontend + backend)
- **36 API routes** in a single `index.js` (821 lines)
- **0 tests** — zero, nada
- **0 real-time** — pure HTTP request-response
- **0 auth security** — no middleware, no JWT, no sessions
- **17 frontend deps + 7 devDeps + 6 server deps**
- **13 pages** for what is essentially a CRUD grocery list

---

## What's GENUINELY Done Well

### Frontend
- **Responsive design is solid.** Mobile nav with hamburger, bottom bar, full-screen shopping mode, proper grid breakpoints on every page. This is production-quality layout work.
- **Component library is clean.** 14 UI primitives with consistent API (Button variants, Input with error/helper, Select with placeholder, etc.) — looks like a real design system foundation.
- **Full-screen shopping mode** (`fixed inset-0 z-50`) is a legitimately good UX pattern for the primary use case.
- **Zustand store** is pragmatic. Not over-abstracted, not under-powered. Right balance for this app size.
- **Types are well-defined.** 489 lines of interfaces with proper optional/nullable fields. This will save time later.

### Backend
- **Routes are logically grouped** and consistently structured. Every route has try/catch, proper status codes, and JSON error responses.
- **Price history system** is genuinely useful. Batch best-deals endpoint, alerts endpoint, stats endpoint — these are well-designed.

---

## What's OVERKILL

### 1. Tesseract.js in the Browser (~760KB added to bundle)
**Problem:** You bundled a 100MB WebAssembly OCR engine into a grocery list app. Receipt scanning is a **feature**, not the product. Users will scan 1-2 receipts ever. Meanwhile every visitor downloads 760KB of OCR engine they'll never use.

**Fix:** Move OCR to the server. Upload the image, process with Tesseract server-side (or use a cheaper OCR API like Google Vision at ~$1.50/1000 scans), return JSON. This cuts 100KB+ from the JS bundle and keeps the client lean.

**Severity:** Medium. Functional, but wasteful.

### 2. Recharts + 4 Chart Types on ReportsPage
**Problem:** You have BarChart, PieChart, LineChart, and a table — all on one page — for a user who's bought maybe 12 items. The entire page is 239 lines with 3 chart components. For the first 6 months of use, this page shows "No data".

**Fix:** Drop PieChart and BarChart. Keep the LineChart (trend over time is useful) and the table. Add the rest when users actually have 6+ months of data.

**Severity:** Low. Harmless bloat, looks good in screenshots.

### 3. Three Separate Layout Files (MainLayout + Sidebar + Header)
**Problem:** 414 total lines across 3 files for what could be a single 150-line file. The `Sidebar.tsx` (198 lines) is particularly egregious — it duplicates the nav items that are also in `MainLayout.tsx`.

**Fix:** Merge Sidebar into MainLayout. One source of truth for navigation.

**Severity:** Low. Code organization issue, not functional.

### 4. @tanstack/react-query Installed But Not Used for Data
**Problem:** The entire QueryClient/RQ infrastructure is set up in `App.tsx`, but **every single data fetch** uses raw `useEffect` + `useState` + manual fetch calls. React Query was added but never adopted. All the cache invalidation, deduplication, refetch-on-focus, and loading state management that RQ provides for free is being manually reimplemented (badly).

**Fix:** Either use React Query properly (replace all `useEffect` fetches with `useQuery`) or remove it. Currently it's dead weight adding complexity.

**Severity:** Medium-high. This is a design debt that will grow.

### 5. 13 Pages for a Grocery List
**Problem:** ScanPage, ReportsPage, SearchPage, PurchaseHistoryPage, OnboardingPage, ProfilePage, HouseholdPage, NotFound — for an app where the core loop is "create list → check items → buy stuff". Every new page is a new failure point, a new loading state, a new empty state.

**Fix:** Merge SearchPage into Lists (search/filter is already built into Lists.tsx). Merge PurchaseHistoryPage into ReportsPage (it's all historical data). Merge OnboardingPage into Register (it's just a multi-step registration form).

**Severity:** Medium. Drives up maintenance cost.

---

## What's CRITICALLY MISSING

### 1. 🔴 NO AUTHENTICATION — ZERO SECURITY
This is the #1 problem. **Every API endpoint is public.** There is:
- No JWT
- No session tokens  
- No API keys
- No middleware
- The `POST /api/db/query` endpoint allows direct SQL execution

`createListItem(name, ... , userId)` — the `userId` is a **client-provided parameter**. I can call this API with anyone's ID and add items to their lists.

**Fix:** This must be fixed before any production use. Add JWT middleware. Never trust `userId` from the client — extract it from the token.

### 2. 🔴 ZERO TESTS
11,300 lines, 36 API routes, 13 pages — **0 tests.** Not one unit test, integration test, or E2E test. Every refactor is blind. Every deployment is a prayer.

**Fix:** Start with the API routes (supertest + jest, ~20 tests covers all 36 routes). Then add integration tests for the 3 core flows: register→create list→add items→complete purchase.

### 3. 🔴 Plaintext Password in .env Committed to Git
The `.env` file with `DB_PASSWORD=postgres` is in the repository. This is a credential leak. Also, the server stores passwords using bcrypt but the migration scripts also show plaintext password columns (`006_add_password_plaintext.sql`).

**Fix:** Add `.env` to `.gitignore` immediately. Remove it from git history with `git rm --cached .env`. Audit the migration scripts for plaintext password handling.

### 4. 🟡 No Loading Skeletons
Every page uses a centered `<Spinner />` that blocks the entire viewport. This is the worst loading UX pattern — it shows a blank page with a spinner, then suddenly all content appears. Skeleton screens (already defined in `globals.css` as `.skeleton` classes but never used) would be a massive UX improvement.

**Fix:** Replace all `<Spinner />` loading states with skeleton placeholders that match the page layout. The CSS is already written — just use it.

### 5. 🟡 No Error Boundaries
If any component throws during render, the entire app goes white. There is no `<ErrorBoundary>` anywhere. For a "polished consumer product" (from the project README), this is unacceptable.

**Fix:** Add one ErrorBoundary at the App level and one per major page section. Takes 30 lines of code.

### 6. 🟡 API Layer Bypasses React Query
All data fetching uses `useEffect` + manual state management. This means:
- No request deduplication (same API called 3 times = 3 network requests)
- No cache (navigating away and back re-fetches everything)
- No stale-while-revalidate
- No background refetch on focus/tab switch

React Query (`@tanstack/react-query`) is **already installed** and configured with a `QueryClient`. It's just not used. Converting the 4 most-called hooks (useGroceryList, useHousehold, usePriceHistory, ListDetail) would eliminate ~200 lines of boilerplate and add caching for free.

### 7. 🟡 No CI/CD
No GitHub Actions, no tests run on PR, no deployment pipeline. Every change is manually tested (or not tested) and manually deployed (or not deployed). For a solo project this is acceptable. For a team project it's a blocker.

### 8. 🟢 No Docker
Docker isn't strictly required, but `docker-compose up` with PostgreSQL + API server + frontend dev server would reduce the setup from "install PostgreSQL, create database, run migrations, start server, start frontend" to one command. Given that the `.env` has hardcoded `localhost:5432` credentials, portability is already low.

---

## Architecture Hotspots

### Server: `index.js` at 821 Lines
The entire backend is a single file. Routes are organized with comments but this file will become unmaintainable beyond ~1,000 lines. It's at 821 now.

**Fix:** Split into `routes/auth.js`, `routes/lists.js`, `routes/price-history.js`, `routes/receipts.js` when it hits 1,000 lines. Painless now, painful later.

### Store: `useStore.tsx` at 264 Lines
The Zustand store is growing. It currently holds `lists`, `priceHistory`, `purchaseSessions`, `priceHistory` (duplicate?), `households`, `currentHouseholdId`, plus ~15 action methods. This should be split into slices (`listSlice`, `householdSlice`, `priceSlice`) before it becomes a god store.

### Types: `index.ts` at 489 Lines
Single-file types work for now but are starting to sprawl. The file mixes DB types (`ListItem`, `GroceryList`), API types, UI constants (`STORES`, `CATEGORIES`), and utility types. Split into `types/db.ts`, `types/api.ts`, `types/ui.ts` would be cleaner.

---

## Summary

### Ship-blocking (fix before production)
1. JWT authentication middleware
2. Remove generic SQL endpoint (`POST /api/db/query`)
3. Remove `.env` from git tracking

### High priority (this week)
4. Add 20 integration tests for core API routes
5. Add React Error Boundary at App level
6. Convert 4 hooks to use React Query (or remove React Query entirely)

### Nice-to-have (this sprint)
7. Move Tesseract.js to server-side
8. Merge 3 redundant pages (Search→Lists, Purchases→Reports, Onboarding→Register)
9. Replace Spinners with skeleton screens
10. Split server into route files

### Overkill (would remove)
11. PieChart + BarChart on ReportsPage (keep LineChart + table)
12. Separate Sidebar.tsx (merge into MainLayout)
13. Tesseract.js on client side (move to server)
