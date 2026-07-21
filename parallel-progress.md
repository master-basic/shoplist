# Parallel Work Plan — Architect (DeepSeek) + Junior (Local LLM)

## Strategy
- **Architect (DeepSeek):** Complex reasoning, modifications spanning 3+ files, architectural decisions, code review, security, all backend work, cross-cutting concerns
- **Junior (local LLM):** Scoped, single-file work with clear specs — isolated component changes, data plumbing, type migrations, CSS, test writing, small UI features

---

## ✅ Rounds 1-13: COMPLETE
All foundation, security, testing, code quality, DB setup, frontend tests, CI, React Query migration, and all Architect feature work done.

| Round | Name | Status |
|-------|------|--------|
| 1 | Foundation (ship-blocking) | ✅ All 4 tasks done |
| 2 | Testing (server + React Query) | ✅ All 3 tasks done |
| 3 | UX Polish | ✅ All 4 tasks done |
| 4 | Server Structure | ✅ All 3 tasks done |
| 5 | Auth Security (CRITICAL) | ✅ All 5 tasks done |
| 6 | Code Quality Fixes | ✅ All 6 tasks done |
| 7 | Setup & Configuration | ✅ All 5 tasks done |
| 8 | Frontend Testing | ✅ All 4 tasks done |
| 9 | CI & Infrastructure | ✅ All 2 tasks done |
| 10 | Shopping & Interactions | ✅ 1 of 4 done (WebSocket) |
| 11 | OCR & Receipts | ✅ 1 of 4 done (Real OCR) |
| 12 | Price Tracking & Analytics | ✅ 2 of 4 done (Unit Price Normalization, Cheapest Store) |
| 13 | Advanced Features (MVP) | ✅ 4 of 7 done (Recurring BE + FE API, Dashboard API, CSV Export) |

## Test Baseline
- **Server:** 29/29 tests pass (Jest + Supertest)
- **Frontend:** 27/27 tests pass (Vitest + RTL, 7 files)
- **0 open handles:** node-cron disabled in test mode

---

## Round 8: Frontend Testing (wrap up)

| Task | Worker | Files | Complexity | Status |
|------|--------|-------|------------|--------|
| **8a** Setup Vitest + RTL | Junior | package.json, vitest.config.ts | 🟢 trivial | ✅ Done |
| **8b** Write component tests | Junior | 7 test files | 🟢 trivial | ✅ Done |
| **8c** Fix Spinner SVG class test | Junior | Spinner.test.tsx | 🟢 trivial | ✅ Done |
| **8d** Write hook tests | Junior | useAuth.test.ts, useGroceryList.test.ts, useHousehold.test.ts, usePriceHistory.test.ts | 🟡 medium | ✅ Done |

---

## Round 9: CI & Infrastructure (Architect)

| Task | Worker | Files | Complexity | Status |
|------|--------|-------|------------|--------|
| **9a** GitHub Actions CI | Architect | `.github/workflows/ci.yml` | 🟡 medium | ✅ Done |
| **9b** Convert useAuth to React Query | Architect | `src/hooks/useAuth.tsx` + `src/api/auth.ts` | 🟡 medium | ✅ Done |

---

## Round 10: Phase 2 Features — Shopping & Interactions

| Task | Worker | Files | Complexity | Status |
|------|--------|-------|------------|--------|
| **10a** Purchase confirmation UI | Junior | `src/pages/ShoppingPage.tsx`, `src/components/PurchaseConfirmModal.tsx` | 🟡 medium | ✅ Done |
| **10b** Price entry during shopping | Junior | `src/pages/ShoppingPage.tsx`, `src/components/PriceInput.tsx` | 🟡 medium | ✅ Done |
| **10c** Real-time sync (WebSocket) | Architect | `server/ws.js`, `src/hooks/useWebSocket.ts`, `server/index.js` | 🔴 high | ✅ Done |
| **10d** Store auto-suggestion | Junior | `src/components/StoreSuggest.tsx`, `src/hooks/useStoreHistory.ts` | 🟡 medium | ✅ Done |

**10a spec for Junior:** Create `PurchaseConfirmModal` component:
- Appears when user taps "Complete Shopping" in ShoppingPage
- Shows list of items, quantity, and a price input for each
- Has "Confirm" and "Cancel" buttons
- On confirm, calls purchase session API and navigates away
- Test: renders items, calls API on confirm, shows spinner during save

**10b spec for Junior:** Add price input to ShoppingPage:
- When item is checked off, show a small inline price input
- Pre-fill from item.estimated_price if available
- Allow clearing (mark as "no price entered")
- Store price in component state until session confirm

**10d spec for Junior:** Create `StoreSuggest` component:
- Fetches distinct store names from price_history API
- Shows dropdown when user types in store name field
- Debounce input (300ms) before searching
- Limit to 5 suggestions, sorted by frequency

---

## Round 11: Phase 3 Features — OCR & Receipts

| Task | Worker | Files | Complexity | Status |
|------|--------|-------|------------|--------|
| **11a** Camera access (mobile) | Junior | `src/pages/ScanPage.tsx` | 🟡 medium | ✅ Done |
| **11b** Real OCR integration | Architect | `server/routes/ocr.js` | 🔴 high | ✅ Done |
| **11c** OCR review UI | Junior | `src/components/ScanReview.tsx` | 🟡 medium | ✅ Done |
| **11d** Fuzzy matching for items | Architect | `server/matcher.js`, `server/routes/ocr.js` | 🔴 high | ✅ Done |

**11a spec for Junior:** Add camera capture to ScanPage:
- Add `<input type="file" accept="image/*" capture="environment">` for mobile
- Show preview after capture
- Keep existing file upload as fallback for desktop
- Add loading spinner during upload

**11c spec for Junior:** Create `ScanReview` component:
- Display scanned items in a list with checkboxes
- Each item shows: name (editable), quantity (editable), price (editable)
- Buttons: "Save All", "Edit", "Discard"
- Tap item to edit fields inline

---

## Round 12: Phase 4 Features — Price Tracking & Analytics

| Task | Worker | Files | Complexity | Status |
|------|--------|-------|------------|--------|
| **12a** Per-item price history view | Junior | `src/pages/ItemPriceHistory.tsx`, `src/components/PriceChart.tsx` | 🟡 medium | ✅ Done |
| **12b** Unit price normalization | Architect | `server/utils/priceNormalizer.js`, `server/routes/priceHistory.js` | 🟡 medium | ✅ Done |
| **12c** Cheapest store calculation | Architect | `server/routes/priceHistory.js` | 🟡 medium | ✅ Done |
| **12d** Average price / all-time low-high | Junior | `src/pages/ReportsPage.tsx` | 🟢 low | ✅ Done |

**12a spec for Junior:** Create per-item price history page:
- Route: `/items/:id/price-history`
- Shows LineChart of price over time
- Table below chart: date, store, price, change from previous
- Fetch from `GET /api/price-history/stats?itemName=...`
- Loading state with Skeleton, empty state for no data

---

## Round 13: Phase 5 Features — Advanced (MVP subset)

| Task | Worker | Files | Complexity | Status |
|------|--------|-------|------------|--------|
| **13a** Recurring items UI | Junior | `src/components/AddItemModal.tsx`, `src/hooks/useGroceryList.ts` | 🟢 low | ✅ Done |
| **13b** Recurring items backend | Architect | `server/routes/lists.js`, `src/api/lists.ts` | 🟡 medium | ✅ Done |
| **13c** Low stock alerts UI | Junior | `src/pages/Lists.tsx`, `src/components/StockBadge.tsx` | 🟢 low | ✅ Done |
| **13d** Overview dashboard | Junior | `src/pages/DashboardPage.tsx`, `src/components/SpendingSummary.tsx` | 🟡 medium | ✅ Done |
| **13e** Dashboard API | Architect | `server/routes/analytics.js`, `server/index.js` | 🔴 high | ✅ Done |
| **13f** Global search | Junior | `src/pages/SearchPage.tsx` (new), `src/components/SearchBar.tsx` | 🟡 medium | ✅ Done |
| **13g** CSV/PDF export | Architect | `server/routes/export.js`, `server/utils/exporter.js`, `server/index.js` | 🟡 medium | ✅ Done |

**13a spec for Junior:** Add recurring toggle to AddItemModal:
- Add "Repeat" toggle/switch in item form
- Options: "None", "Weekly", "Monthly"
- Pass `is_recurring` field in createListItem call
- Show recurring badge on items in list view

**13c spec for Junior:** Show low stock indicators:
- In ListsPage, show badge on items where `restock_threshold` is set and item is running low
- Create `StockBadge` component: green (>50%), yellow (20-50%), red (<20%)
- Only show if item has `restock_threshold` set

**13d spec for Junior:** Create Dashboard page:
- Route: `/dashboard`
- Show: total spending this month, total items bought, active lists count
- Bar chart: spending by category (simple, reuse LineChart)
- Top 5 items by total spend
- Loading: Skeleton layout, Empty: friendly message
- Fetch from `/api/analytics/summary`

---

## Round 14: Phase 6-9 — Future (out of scope for now)

| Round | Name | Estimated effort | Notes |
|-------|------|-----------------|-------|
| **14** | PWA (Phase 6) | 2-3 sprints | Service worker, offline, accessibility audit |
| **15** | Notifications (Phase 7) | 2 sprints | Web push, in-app center, preferences |
| **16** | DB Optimization (Phase 8) | 1 sprint | Pool config, triggers, functions |
| **17** | Security & Privacy (Phase 9) | 2 sprints | Rate limiting, password reset, GDPR |

---

## Dependency Graph
```
Rounds 1-8 (all done)
   │
   ├──► Round 9: CI + useAuth (Architect)
   │
   ├──► Round 10: Phase 2 features (Architect + Junior)
   │         │
   │         └──► Round 11: Phase 3 OCR (sequel: builds on purchase flow)
   │
   ├──► Round 12: Phase 4 analytics (parallel with 10-11)
   │
   └──► Round 13: Phase 5 advanced (parallel with 10-12)
```

---

## Rules of Engagement

### For Junior tasks
1. **Never modify auth/security files** — Architect only
2. **Never create/modify API routes** — Architect only
3. **Never modify DB schema or migrations** — Architect only
4. **Every PR must be reviewed by Architect before merge**
5. **If stuck >10 minutes, escalate to Architect**
6. **Write tests for every new component/hook** — at minimum: renders, interaction, edge case
7. **Update parallel-progress.md after every task** — mark the task as ✅ Done in the table, update Test Baseline lines if test count changed, and update Current Sprint Status section

### For Architect tasks
1. All security modifications (auth, SQL injection, credential handling)
2. All cross-cutting refactors (React Query migration, WebSocket integration)
3. All backend route creation and modification
4. All architectural decisions (monorepo setup, deployment, CI)
5. DB schema changes and migrations

### Shared
- **Types:** Either can modify `types/` but must inform the other
- **CSS/styles:** Junior owns all styling changes
- **Package.json:** Architect owns dependency decisions; Junior may propose additions

---

## Current Sprint Status

### ✅ ALL ARCHITECT WORK COMPLETE
Rounds 1-13 — every Architect task is done

### ⏳ NEXT UP (Junior only)
All specs are listed above in each Round table — Junior can pick any ⏳ Pending task
