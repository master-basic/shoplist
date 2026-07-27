# GroceryMind - Development Log
**Current Session:** July 27, 2026  
**Session Purpose:** TypeScript build error fixes — resolved all remaining TS compilation errors (3 final fixes) — build is now clean with 0 errors

**Previous Session:** July 27, 2026 — Progress file updates — all progress tracking documents reconciled with current codebase state

**Previous Session:** July 21, 2026 — Bug fixes (purchase FK error, price_history INSERT, stale persisted UUIDs)

---

## Issues Discovered

### 🔴 CRITICAL: Missing POST /api/lists Route
The frontend calls `src/api/lists.ts` to create lists with:
```typescript
const response = await fetch('http://localhost:3001/api/lists', {
  method: 'POST',
  body: JSON.stringify({...})
})
```

**Status:** ❌ Route NOT FOUND in server/index.js

**Impact:** Create List functionality broken

---

## July 27 — TypeScript Build Error Fixes

### Issues Discovered

1. **Toast variant mismatch** — `Lists.tsx` used `variant="danger"` but `Toast.tsx` only supports `'success' | 'error' | 'warning' | 'info'`
2. **OCRItem property mismatch** — `ocr.ts` `parseOCRResult` created items with `price`/`quantity`/`unit`/`category`/`categoryConfidence` but `ScanReview.tsx` `OCRItem` interface expects `unitPrice`/`totalPrice`/`quantity`/`category`/`categoryConfidence`
3. **tesseract.js missing type declarations** — `src/api/ocr.ts` imported `tesseract.js` without a `.d.ts` file
4. **Recharts labelFormatter type mismatch** — `PriceChart.tsx:25` — `labelFormatter` expects `(label: ReactNode)` not `(label: string)`
5. **Button.test.tsx — HTMLElement.disabled** — `screen.getByRole()` returns `HTMLElement`, not `HTMLButtonElement`; `.disabled` property doesn't exist
6. **Checkbox.test.tsx — HTMLElement.checked/indeterminate** — Same issue; `.checked` and `.indeterminate` don't exist on `HTMLElement`
7. **useAuth.test.tsx — duplicate wrapper declaration** — Two `const wrapper` declarations in same scope
8. **useAuth.test.tsx — QueryClient `logger` property** — `QueryClientConfig` doesn't have `logger` in this version
9. **useAuth.test.tsx — QueryClient `defaultQueryFn` property** — `QueryClientConfig` doesn't have `defaultQueryFn`
10. **useAuth.test.tsx — User type missing required fields** — `notification_preferences` must have `{ push_notifications, price_change_alerts, weekly_summary, list_updates, reminders }`
11. **useGroceryList.test.tsx — QueryClient `logger` property** — Same issue as useAuth.test.tsx
12. **useGroceryList.test.tsx — useStore mock missing properties** — Missing `setCurrentHouseholdId`, `households`, `loading`, `error`, and 8 more
13. **useGroceryList.test.tsx — useHousehold mock incomplete** — Missing `setCurrentHouseholdId`, `households`, `loading`, `error`, and 8 more
14. **useGroceryList.test.tsx — useAuth mock incomplete** — Missing `households`, `isLoading`, `error`, `isAuthenticated`, and 5 more
15. **useGroceryList.test.tsx — createList call signature** — Hook expects `{ name, householdId }` object, not two separate args
16. **useHousehold.test.tsx — QueryClient `logger` property** — Same issue
17. **useHousehold.test.tsx — useAuth mock incomplete** — Same as useGroceryList
18. **usePriceHistory.test.tsx — QueryClient `logger` property** — Same issue
19. **usePriceHistory.test.tsx — `global.fetch` undefined** — Should use `globalThis.fetch`

### Fixes Applied

- ✅ `lists.tsx` — Changed `variant="danger"` to `variant="error"` (matches Toast.tsx ToastVariant type)
- ✅ `ocr.ts` — Fixed `parseOCRResult` item fields: `price` → `unitPrice`, added `totalPrice`, removed `unit`/`category`/`categoryConfidence` defaults
- ✅ Created `src/api/types.d.ts` — Added `tesseract.js` module declaration
- ✅ `PriceChart.tsx` — Changed `labelFormatter` param type from `(label: string)` to `(label: React.ReactNode)`
- ✅ `Button.test.tsx:26` — Added `as HTMLButtonElement` type assertion
- ✅ `Checkbox.test.tsx:24,30` — Added `as HTMLInputElement` type assertions
- ✅ `useAuth.test.tsx` — Removed duplicate `wrapper` declaration, removed `logger` from QueryClient, fixed `notification_preferences` with all required fields
- ✅ `useGroceryList.test.tsx` — Removed `logger` from QueryClient, expanded `useStore`/`useHousehold`/`useAuth` mock return values, fixed `createList` call to use object arg
- ✅ `useHousehold.test.tsx` — Removed `logger` from QueryClient, expanded `useAuth` mock return value
- ✅ `usePriceHistory.test.tsx` — Removed `logger` from QueryClient, changed `global.fetch` to `globalThis.fetch`
- ✅ `ocr.ts:106` — Fixed `Tesseract.recognize` handler param type from `{ percent?: number }` to `unknown` (matches `...args: unknown[]` in `.d.ts` declaration)
- ✅ `ocr.ts:111` — Added `as unknown` intermediate cast for worker destructuring (`worker as unknown as { data: { text: string } }`)
- ✅ `useAuth.test.tsx:89` — Fixed second `notification_preferences: {}` instance (logout test) with all required fields

**Build Status:** ✅ Clean — 0 TypeScript errors

---

## Server Routes Found

1. ✅ `/api/health` - GET - Health check
2. ✅ `/api/db/query` - POST - Generic DB query (fallback)
3. ✅ `/api/auth/register` - POST - User registration
4. ✅ `/api/auth/login` - POST - User login
5. ✅ `/api/auth/user/:id` - GET - Get user by ID
6. ✅ `/api/auth/user/:id/households` - GET - Get user households
7. ✅ `/api/auth/households` - POST - Create household
8. ✅ `/api/households/:id` - GET - Get household
9. ✅ `/api/households/:id/members` - GET - Get household members
10. ✅ `/api/households/:id/members` - POST - Add member
11. ✅ `/api/households/:id/members/:userId` - DELETE - Remove member
12. ✅ `/api/lists/:id` - GET - Get list by ID
13. ✅ `/api/lists/:id` - PUT - Update list
14. ✅ `/api/lists/:id` - DELETE - Delete list
15. ✅ `/api/lists/:id/items` - GET - Get list items
16. ✅ `/api/lists/:id/items` - POST - Create list item
17. ✅ `/api/lists/:listId/items/:itemId` - PUT - Update item
18. ✅ `/api/lists/:listId/items/:itemId` - DELETE - Delete item
19. ✅ `/api/receipts/upload` - POST - Upload receipt
20. ✅ `/api/receipts` - POST - Create receipt

**MISSING:**
- ❌ `GET /api/lists` - Get all lists (required)
- ❌ `POST /api/lists` - Create list (required)

---

## Action Items

1. [ ] Add GET /api/lists endpoint
2. [ ] Add POST /api/lists endpoint
3. [ ] Test create list functionality
4. [ ] Test shopping page
5. [ ] Verify all frontend pages work
6. [ ] Update project status