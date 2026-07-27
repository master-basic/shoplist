# GroceryMind — Comprehensive QA Plan

## Phase 0: Schema & Data Type Audit

### [0.1] Verify all column types match INSERTs
Check every server route's INSERT/UPDATE queries against actual table schemas.

| Table | Column | Type in Schema | Routes That INSERT | Risk |
|-------|--------|----------------|-------------------|------|
| price_history | quantity | INTEGER | purchases.js, priceHistory.js | ⚠️ String "1.00" fails (FIXED) |
| price_history | unit_price | DECIMAL(10,2) | purchases.js, priceHistory.js | ⚠️ Must parseFloat |
| receipt_items | quantity | DECIMAL(10,2) | purchases.js | ✅ Accepts string |
| receipt_items | unit_price | DECIMAL(10,2) | purchases.js | ✅ Accepts string |
| list_items | quantity | ? | lists.js | ⚠️ Check type |
| list_items | unit_price | ? | lists.js | ⚠️ Check type |

### [0.2] Verify all NOT NULL columns are always provided
List all NOT NULL columns and ensure every INSERT provides them.

### [0.3] Verify FK references match existing parent rows
Check all `REFERENCES` constraints: every `user_id`, `list_id`, `household_id` must point to valid rows.

---

## Phase 1: Server API Endpoint Audit

### [1.1] Route inventory
Verify every route in `server/index.js` corresponds to an existing file.

| Mount Path | File | Status |
|------------|------|--------|
| /api/auth | routes/auth.js | ✅ |
| /api/households | routes/households.js | ✅ |
| /api/lists | routes/lists.js | ✅ |
| /api/price-history | routes/priceHistory.js | ✅ |
| /api/receipts | routes/receipts.js | ✅ |
| /api/receipts/ocr | routes/ocr.js | ⚠️ Check |
| /api/purchase-sessions | routes/purchases.js | ✅ |
| /api/admin | routes/admin.js | ✅ |
| /api/price-check | routes/priceCheck.js | ✅ |
| /api/analytics | routes/analytics.js | ✅ |
| /api/export | routes/export.js | ✅ |
| /api/log | routes/logging.js | ✅ |
| /api/categorizer | routes/categorizer.js | ✅ |
| /api/budget | routes/budget.js | ✅ |

### [1.2] Test every endpoint with curl
For each endpoint, test:
- ✅ 200 with valid data
- ✅ 400 with missing required fields
- ✅ 401 without auth token
- ✅ 404 for non-existent resource
- ✅ 500 handling (malformed input)

### [1.3] SQL injection check
Search for string interpolation in SQL queries (template literals with `${}`):
- `priceCheck.js:74` — `INTERVAL '${parseInt(days)} days'` — ⚠️ Has parseInt guard
- `priceCheck.js:145` — `INTERVAL '${interval}'` — ⚠️ Same pattern
- Search all `*.js` in server/routes/ for `${` inside SQL strings

### [1.4] Parameterized query check
Verify ALL dynamic values use `$1, $2, ...` placeholders, never string concatenation.

---

## Phase 2: Frontend ↔ Server Field Name Alignment

### [2.1] camelCase vs snake_case audit
For every API call, verify the frontend sends field names the server expects.

| Frontend Field | Server Field | API Endpoint | Status |
|----------------|-------------|--------------|--------|
| `householdId` | `household_id` | POST /api/lists | ⚠️ Check |
| `createdBy` | `created_by` or `userId` | POST /api/lists/items | ⚠️ |
| `listItemId` | `list_item_id` | POST /api/purchase-sessions | ✅ |
| `unitPrice` | `unit_price` | Various | ⚠️ |
| `is_checked` vs `isChecked` | `is_checked` | PATCH /api/lists/items/:id | ⚠️ Check |
| `userId` vs `created_by` | varies | Various | ⚠️ |
| `storeName` | `store_name` or `store` | Various | ⚠️ |

### [2.2] Response field name audit
For every API response the frontend consumes, verify field names match.

| Server Response Field | Frontend Expects | Page | Status |
|-----------------------|-----------------|------|--------|
| `price` vs `unit_price` | varies | PriceCheckPage | ⚠️ |
| `current_price` vs `previous_price` | `previous_price` | PriceCheckPage:341 | ✅ FIXED |
| `period_start_price` vs `previous_price` | `previous_price` | PriceCheckPage | ✅ FIXED |
| `store` vs `store_name` | varies | ReportsPage | ⚠️ |
| `total_amount` | `total_amount` | ReportsPage:184 | ⚠️ Already has fallback |
| `token` (login response) | `token` | api/auth.ts | ✅ |

---

## Phase 3: Null/Undefined Safety Audit

### [3.1] Search pattern: `.toFixed(`
Files that call `.toFixed()` without null guard:
- `PriceCheckPage.tsx:243` — `entry?.price.toFixed(2)` — ✅ Has optional chain, but price could be undefined
- `PriceCheckPage.tsx:275` — `tickFormatter={(v) => `${v.toFixed(2)}`}` — ✅ v is from Recharts
- `PriceCheckPage.tsx:303` — `h.price.toFixed(2)` — ✅ FIXED with Number() guard
- `PriceCheckPage.tsx:349` — `t.previous_price.toFixed(2)` — ✅ FIXED
- `PriceCheckPage.tsx:353` — `change_percent.toFixed(1)` — ✅ FIXED
- `ItemPriceHistory.tsx:142` — `change.toFixed(1)` — ⚠️ IsFinite check added ✅
- `ReportsPage.tsx:253` — `alert.currentPrice.toFixed(2)` — ✅ FIXED
- `PriceChart.tsx:24` — `v.toFixed(2)` — v is from Recharts tick, should be number
- `GroceryItemCard.tsx:124` — `bestDeal.price.toFixed(2)` — ⚠️ Need null guard

### [3.2] Search pattern: `Math.abs(`
Files with `Math.abs()` on potentially undefined values:
- `PriceCheckPage.tsx:152` — `Math.abs(b.change_percent)` — ⚠️ Could be null
- `ReportsPage.tsx:251` — `Math.abs(alert.changePercent)` — ✅ FIXED

### [3.3] Search pattern: `.map(` without null check
Files that call `.map()` without checking if the array is null:
- Various — ⚠️ Check all

---

## Phase 4: State Management Audit

### [4.1] Zustand store vs React Query cache
Check for duplicated state (store + React Query) that could get out of sync.

| Data | Zustand Store | React Query Cache | Risk |
|------|---------------|-------------------|------|
| User | userSlice | useAuth hook | ⚠️ Duplicated |
| Lists | listSlice | useGroceryList hook | ⚠️ Duplicated |
| PriceHistory | priceHistorySlice | usePriceHistory hook | ⚠️ Duplicated |

### [4.2] Zustand persist partialize
Check which slices are persisted to localStorage and if stale data reloads.

### [4.3] Local state reset on navigation
Check that component-level state (ShoppingPage `itemPrices`, `storeName`, etc.) resets properly when navigating away.

---

## Phase 5: UI/UX Edge Cases

### [5.1] Empty states
Every page/component that renders dynamic data should show an empty state:
- Lists.tsx — ✅ Has
- ListDetail.tsx — ✅ Has
- ShoppingPage.tsx — ✅ Has
- ReportsPage.tsx — ✅ Has
- ItemPriceHistory.tsx — ✅ Has
- PriceCheckPage.tsx — ✅ Has
- ScanPage.tsx — ⚠️ Check
- DashboardPage.tsx — ⚠️ Check

### [5.2] Loading states
Every component that fetches data should show a loading state:
- SkeletonCard — ✅ Used in most pages
- Spinner — ✅ Available but ⚠️ Not used consistently

### [5.3] Error states
Every API call should show user-facing error feedback:
- Toast — ✅ Available
- `console.error` only (silent) — ⚠️ Search for this pattern

### [5.4] Form validation
All forms should validate input before submission:
- Lists.tsx create list modal — ✅ Checks empty name
- ListDetail.tsx add item modal — ⚠️ Check
- Login/Register forms — ⚠️ Check
- ShoppingPage store select — ✅ Has default

---

## Phase 6: Authentication & Authorization Audit

### [6.1] Token expiry handling
What happens when JWT expires mid-session?
- Usetate should redirect to login
- API calls should handle 401

### [6.2] Auth header presence
Check every `apiFetch()` call uses `authHeaders()`:
- ✅ — apiFetch automatically adds auth headers

### [6.3] Server-side auth protection
Every route should call `authenticateToken`:
- ✅ — Each route module calls `router.use(authenticateToken)`

---

## Phase 7: Test Coverage

### [7.1] Current coverage: 11 test files, 36 tests
- 6 UI primitive tests (Button, Input, Select, Checkbox, Switch, Spinner)
- 4 hook tests (useAuth, useGroceryList, useHousehold, usePriceHistory)
- 1 utility test (currency)

### [7.2] Missing test coverage
| Area | Files | Tests Needed |
|------|-------|-------------|
| Server routes | 12 files | Integration tests for each |
| Pages | 15 files | Render + interaction tests |
| Components | 37 files | Render tests for each |
| API layer | 7 files | Mock fetch tests |
| Store slices | 8 files | State mutation tests |
| Utils | ~10 files | Unit tests for each |

---

## Phase 8: Database Migration Audit

### [8.1] Migration numbering collisions
Files with same number:
- `002_add_list_status.sql` and `002_create_price_checks.sql` and `002_add_username.sql`
- `005_add_item_assignment_and_notes.sql` and `005_add_user_households_unique_constraint.sql`

### [8.2] Migration execution order
Verify migrations run in correct order. Duplicate numbers may cause skipped migrations.

### [8.3] Schema drift
Compare actual DB schema (via pg_dump or \d) against collective migration output.

---

## Phase 9: Security Audit

### [9.1] SQL injection via string interpolation
Search all `.js` files for SQL with `${`:
```
grep -rn '\$\{' server/routes/*.js | grep -i 'query\|where\|order\|limit\|interval'
```

### [9.2] XSS via dangerouslySetInnerHTML
Search for `dangerouslySetInnerHTML` usage:
```
grep -rn 'dangerouslySetInnerHTML' src/
```

### [9.3] Rate limiting
No rate limiting exists on auth endpoints. Check:
- POST /api/auth/login
- POST /api/auth/register
- POST /api/auth/forgot-password (if exists)

### [9.4] JWT secret
- Fallback secret in dev mode
- Missing JWT_SECRET environment variable validation in dev

---

## Phase 10: Performance Audit

### [10.1] N+1 queries
Search for queries inside loops:
- `lists.js:86-88` — Query inside loop for each list ✅
- `purchases.js:21-31` — Query inside loop for each item ✅
- `priceHistory.js:88-97` — Query inside loop for each item name ⚠️

### [10.2] Missing indexes
Check query patterns against existing indexes.

### [10.3] Unnecessary re-renders
Check useEffect dependencies:
- ReportsPage: `useEffect` depends on `user?.id` — ⚠️
- ListsPage: `useEffect` depends on `user?.id` — ⚠️

---

## Execution Checklist

### Immediate fixes from this audit:
- [ ] GroceryItemCard bestDeal.price.toFixed(2) — null guard
- [ ] PriceCheckPage storeColors — add colors for all predefined stores
- [ ] ShoppingPage `toggleItem` — doesn't sync to server (local only)
- [ ] priceCheck.js:74 string interpolation — verify parseInt guard is sufficient
- [ ] Migration numbering collisions — rename files
- [ ] ReportsPage alerts — check itemName lowercase display

### Manual QA Test Flows:
1. **Full auth flow:** Register → Login → Refresh → Stay logged in → Logout
2. **List CRUD:** Create → View → Add items → Edit items → Delete items → Delete list
3. **Shopping flow:** Start shopping → Toggle items → Enter prices → Select store → Mark as Bought
4. **Receipt flow:** Upload receipt → OCR processing → Review items → Save
5. **Price history:** View item price history → See chart → See trends
6. **Reports:** View spending → Filter by date → View purchase history
7. **Households:** Create → Invite members → Switch → See filtered data
