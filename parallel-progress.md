# Parallel Work Plan — Architect (DeepSeek) + Junior (Local LLM)

## Strategy
- **Architect (me, DeepSeek):** Complex reasoning, modifications spanning 3+ files, architectural decisions, code review, security, all backend work
- **Junior (local LLM):** Scoped, single-file work with clear specs — isolated component changes, data plumbing, type migrations, CSS

---

## Round 1: Foundation (ship-blocking)

| Task | Worker | Files | Complexity | Est. Time |
|---|---|---|---|---|
| **1a** JWT auth middleware + login/register routes | **Architect** | `server/index.js`, `server/`, `.env` | 🔴 high — security, multiple files | 45 min |
| **1b** Remove `POST /api/db/query` | **Architect** | `server/index.js` | 🟢 trivial — delete 15 lines | 2 min |
| **1c** Remove `.env` from git, add to `.gitignore` | **Architect** | `.gitignore`, git history | 🟢 trivial | 5 min |
| **1d** Add ErrorBoundary at App level | **Junior** | `src/components/ErrorBoundary.tsx`, `src/main.tsx` | ✅ completed | 15 min |

**Round 1 spec for Junior:** Create `src/components/ErrorBoundary.tsx` — a React class component that catches errors, logs them to console, and renders a fallback UI with a "Reload" button. Then wrap `<App />` in `src/main.tsx` with it. Use `componentDidCatch` and `getDerivedStateFromError`. The fallback should be a centered card saying "Something went wrong" with a retry button that calls `window.location.reload()`.

---

## Round 2: Testing (high priority)

| Task | Worker | Files | Complexity | Est. Time |
|---|---|---|---|---|
| **2a** Set up Jest + supertest for API | **Architect** | `server/package.json`, `server/jest.config.js`, CI config | 🟡 medium — config + first test suite | ✅ completed | 20 min |
| **2b** Write 20 API integration tests | **Architect** | `server/__tests__/api.test.js` | 🟡 medium — covers all 36 routes via 20 tests | ✅ completed | 60 min |
| **2c** Convert 4 hooks to React Query | **Junior** | `src/hooks/useGroceryList.ts`, `src/hooks/useHousehold.ts`, `src/hooks/usePriceHistory.ts` | ✅ completed | 40 min |

**Round 2 spec for Junior:** Convert 4 hooks from `useEffect`+`useState` to `@tanstack/react-query`'s `useQuery`. Each hook follows the same pattern:
1. Import `useQuery` from `@tanstack/react-query`
2. Replace `useState`/`useEffect` with `useQuery({ queryKey: [...], queryFn: () => apiCall(), enabled: !!userId })`
3. Return `{ data, isLoading, error }` (same shape the consumers expect)
4. Remove all manual `isLoading`/`error` state variables
5. Check that consumers use `.data`, `.isLoading`, `.error` — if they use different keys, alias in the return

---

## Round 3: UX Polish (nice-to-have)

| Task | Worker | Files | Complexity | Est. Time |
|---|---|---|---|---|
| **3a** Replace Spinners with skeletons | **Junior** | `src/pages/*.tsx` (6-8 files) | ✅ completed | 20 min |
| **3b** Merge Sidebar into MainLayout | **Junior** | `src/layouts/MainLayout.tsx`, delete `Sidebar.tsx` | ✅ completed | 10 min |
| **3c** Merge SearchPage into Lists | **Architect** | `src/App.tsx`, `src/pages/SearchPage.tsx`, `src/pages/Lists.tsx` | 🟡 medium — need to understand routing + state | 20 min |
| **3d** Remove PieChart + BarChart from Reports | **Junior** | `src/pages/ReportsPage.tsx` | ✅ completed | 10 min |

**Round 3 spec for Junior:**
- **3a:** The `globals.css` already defines `.skeleton` classes. Create `src/components/Skeleton.tsx` as `<div className="skeleton h-4 w-full rounded" />` (accept `className` prop). Replace all `<Spinner />` centering patterns in pages with layout-matching skeleton blocks.
- **3b:** Move the `<Sidebar />` content (sidebar nav links, logo, user avatar) directly into `MainLayout.tsx`. Remove the `<Sidebar />` import and the `Sidebar.tsx` file.
- **3d:** In `ReportsPage.tsx`, delete the `<PieChart />` and `<BarChart />` JSX blocks and their imports. Keep `<LineChart />` and the data table.

---

## Round 4: Server Structure (tech debt)

| Task | Worker | Files | Complexity | Est. Time |
|---|---|---|---|---|
| **4a** Split `index.js` into route modules | **Architect** | `server/routes/`, `server/index.js` | 🟡 medium — refactor, not rewrite | 40 min |
| **4b** Move Tesseract OCR to server endpoint | **Architect** | `server/`, `src/pages/ScanPage.tsx` | 🟡 medium — understanding both sides | 45 min |
| **4c** Split `useStore.tsx` into slices | **Junior** | `src/store/` | 🟡 medium — Zustand slice pattern | 30 min |

---

## Dependency Graph
```
Round 1 (security) ──► Round 2 (tests) ──► Round 3 (UX) ──► Round 4 (tech debt)
      │                       │
      └─── 1d (Junior) ───────┘
      └─── 1a-1c (Architect) ─┐
                               └─── 2b (Architect needs secure routes to test)
```

## Time Estimates
- **Architect aggregate:** ~3.5 hours
- **Junior aggregate:** ~2 hours
- **Wall-clock with parallelism:** ~3 hours (if both work simultaneously)

---

## Rules of Engagement

### For Junior tasks (local LLM)
1. **Never modify a file that touches auth/security** — all security work is Architect-only
2. **Never create or modify API routes** — backend changes are Architect-only
3. **Every PR must be reviewed by Architect before merge** — Junior creates the PR, Architect approves
4. **If stuck >10 minutes on a task, escalate to Architect** — don't spin

## Context Management for Local LLM

Your context window is 64K tokens. You will loop/compact if you exceed it. Follow these rules strictly:

### Work in a single command per session
1. **One edit per response.** Never try to read + edit + verify in one response. Do exactly ONE file read OR one file edit OR one bash command per message. This keeps your context from growing.
2. **Never re-read a file you already read.** If you need to edit a file, you already have its content from the initial read. Just make the edit.
3. **Never re-read the full conversation.** The plan is above. Trust what the Architect assigned you. Don't re-read previous messages.

### When to stop
4. **After every file edit, output exactly: `done: <filename>`** — nothing else. No summary, no explanation, no next steps. If the edit is the last in your task, say `done: <filename> (task complete)`.
5. **If your response exceeds ~200 tokens of content (not counting tool calls), you are writing too much.** Stop. Output only the tool call and `done:`.
6. **Never ask questions.** If something is ambiguous, make a reasonable choice and note it in `done: <filename> // <note>`.

### Avoiding the compact loop
7. **If you see yourself repeating the same analysis or re-reading files you've already read, you are about to loop.** Instead, output `escalate: <reason>` and stop. The Architect will unblock you.
8. **Never attempt to read files larger than 200 lines in one request.** If a file is large, only read the specific section you need (use `offset` and `limit`).
9. **When your task spec says "replace X with Y in all files", do NOT list the files first.** Just edit each file one at a time. Trust the spec.

### For Architect tasks (DeepSeek)
1. **All security modifications** (auth, SQL injection, credential handling)
2. **All cross-cutting refactors** (changing data patterns like React Query migration)
3. **All backend route creation and modification**
4. **All architectural decisions** (monorepo setup, deployment, CI)

### Shared
- **Types:** Either can modify `types/index.ts` but must inform the other
- **CSS/styles:** Junior owns all styling changes
- **Package.json:** Architect owns dependency decisions; Junior may propose additions
