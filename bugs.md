# Bug Report

## Fixed Bugs (current session — Jul 21)
- **Purchase fails with FK violation on receipt_items** — `addItemToList` in `listSlice.ts` always generated `uuidv4()` overriding the real DB ID. Fixed to preserve `item.id` when provided.
- **New items got fake UUIDs in store** — `ListDetail.tsx` spread `createListItem` response wrapper (`{ item: {...}, message: "..." }`) instead of `newItem.item`, so the real DB `id` was nested and never reached the store. Fixed.
- **Stale persisted lists survived refresh** — Zustand `persist` saved fake UUIDs to localStorage. `ShoppingPage.tsx` only added missing lists (`if (!existing)`), never replaced stale ones. Fixed to always update from API. Also removed `lists` and `priceHistory` from `partialize` so only `user` is persisted.
- **Price_history INSERT missing NOT NULL columns** — `purchases.js` INSERT only targeted migration-008 columns, missing `item_name`, `store_name`, `unit_price`, `quantity`, `session_id`, `bought_by` from the original schema. Fixed.
- **debug.ts included auth header on log POST** — Caused CORS preflight. Reverted.

## Fixed Bugs (previous session)
- **Empty item created on list creation** — `useGroceryList.ts:41` called `addItemToList` with empty name immediately after creating a list. Removed the spurious item creation.
- **Store user not persisted** — User state wasn't included in Zustand `partialize`, causing page refreshes to lose auth. Added `user` to persisted fields.
- **Hardcoded `localhost:3001` in 9+ files** — Created `src/config.ts` with `import.meta.env.VITE_API_URL || 'http://localhost:3001'` and updated all API files, hooks, and pages to import `API_BASE` from config.
- **Dead code in `useAuth.ts`** — `useAuth().login` was not used in `Login.tsx` (login called `loginUser()` directly). Unused.
- **Purchase history items not showing** — `server/routes/purchases.js` GET `/user/:userId` didn't JOIN `receipt_items` with `list_items`, so `name` and `category` were missing from expanded items. Added JOIN.
- **HouseholdPage shows empty state after creating household** — `HouseholdPage.tsx` read `households` from `useStore()` (always empty) instead of from `useHousehold()` hook (React Query data from server). Fixed.
- **HomePage shows all lists regardless of household** — `activeLists`, `pendingItems`, `completedItems`, `recentLists` were not filtered by `currentHouseholdId`. Fixed.

## Remaining Bugs (from comprehensive analysis)

### UI/UX

1. **No toast/error UI in lists page** — `createList` mutation errors are logged to console but not shown to user. `Lists.tsx` catches `err` with `console.error(err)` but sets no visible error state.

2. **No loading states on Register wizard** — Most steps (household selection, store selection) show no spinner/placeholder while data loads. User may click buttons thinking nothing happened.

3. **No empty state in GroceryList** — When a list has no items, the component renders an empty div. Should show "No items yet" helper for first-time users.

4. **Admin page: delete has no confirmation** — `AdminPage.tsx` `handleDeleteUser()` calls `deleteUser(userId)` with no `window.confirm()`. One accidental click deletes a user.

5. **Admin page: no feedback after create/reset/delete** — After performing an action, the user list isn't refreshed. User sees stale data until manual refresh.

6. **Admin page: no loading state** — `handleCreateUser`, `handleResetPassword`, `handleDeleteUser` disable no buttons during async work. Double-clicks send duplicate requests.

7. **AddItemModal: no validation** — Modal calls `createListItem` with empty-string `name`, which passes it to the server. Server likely creates an item with blank name.

8. **ScanPage: camera scan hangs on error** — If the OCR endpoint fails, `handleCameraCapture` catches the error but the UI stays in "processing" mode indefinitely.

9. **ShoppingPage: completion silently fails** — When `completePurchase` throws, error is only `console.error`'d with no user-facing message.

10. **ShoppingPage: store name not validated** — `completePurchase` sends `storeName || 'Unknown'`. If user leaves store name blank, purchases show "Unknown" store with no warning.

### State & Data Flow

11. **Stale household context** — `useHousehold.ts` doesn't refetch when the user switches households. If a household is selected and user data changes elsewhere, the hook returns stale `currentHouseholdId`.

12. **`useAuth().user` vs `useStore().user` duplication** — `useAuth` copies `user` from store but `Login.tsx` and `Register.tsx` use `useAuth().login` / `useAuth().register` inconsistently. The auth hook is a redundant layer.

13. **useGroceryList mutation onSuccess refetches all lists** — After any mutation (delete item, toggle item), `queryClient.invalidateQueries` refetches ALL lists even for a single item change. Could be optimized to just update cache.

14. **Items not removed from store on list deletion** — `useGroceryList.deleteList` calls `apiDeleteList` then `invalidateQueries`, but the store's `lists` array still contains the deleted list until the next fetch.

15. **usePriceHistory hook not invalidated after purchase** — When a purchase is completed, price history data should refresh but isn't invalidated.

### Server

16. **No input validation on any endpoint** — Name, email, password fields aren't sanitized or validated server-side. SQL injection is mitigated by parameterized queries, but empty strings, XSS payloads, and excessive lengths are accepted.

17. **No rate limiting** — Auth endpoints (`/login`, `/register`) have no rate limiting. Brute-force attack is trivial.

18. **Password reset has no auth check** — Server-side reset endpoint (`POST /api/admin/users/:id/reset-password`) checks `req.user.role !== 'admin'` but the middleware only verifies JWT. If JWT secret is leaked, any password can be reset.

19. **Delete user cascade is incomplete** — When a user is deleted, their household memberships may leave orphaned records. Server deletes memberships but doesn't reassign or clean up lists.

20. **No HTTPS in production** — Server listens on HTTP only. Credentials and tokens are sent in plaintext in production.

### Code Quality

21. **Silent catch blocks in 4+ files** — `ScanPage.tsx:249`, `ListDetail.tsx:77`, `AdminPage.tsx`, `ShoppingPage.tsx:63` all have `catch (err) { console.error(err) }` with no user feedback.

22. **Mixed import styles** — Some files use `@/` path aliases (e.g., `@/store/useStore`), others use relative paths (e.g., `../store/useStore`). Inconsistent and fragile.

23. **Dead code: `useAuth.ts` login/register functions** — `Login.tsx` and `Register.tsx` call `api/auth.ts` directly instead of using the hook. The hook's `login`/`register` methods are completely unused.

24. **Dead code: `api/admin.ts` `deleteUser` function** — Exists but `AdminPage.tsx` calls `await fetch(...)` directly instead of using it.

25. **No TypeScript strict mode** — `tsconfig.json` likely has `strict: false` or missing `strictNullChecks`. Many files use `user!` assertions that would fail under strict checks.

26. **`any` types used extensively** — `useGroceryList.ts`, `ListDetail.tsx`, `ShoppingPage.tsx`, `AdminPage.tsx` use `any` type annotations instead of proper types.

27. **No error boundary** — If any React component throws during render, the entire app shows a white screen. No `<ErrorBoundary>` wrapper exists.

28. **No request timeout** — All `fetch()` calls lack `AbortController`/`signal`. A hanging server request blocks indefinitely.

### Environment & Config

29. **`VITE_API_URL` not documented** — Developers must grep the codebase or read `config.ts` to know this env var exists. No `.env.example` file.

30. **No `.env.example`** — Required env vars (`VITE_API_URL`, `DATABASE_URL`, `JWT_SECRET`, `PORT`) are not documented.

31. **`package.json` has no `lint` script** — Running `npm run lint` fails. Developers must know the linting tool manually.

32. **Server requires manual migration run** — `migrate_users.js` is not integrated into server startup. New developers must discover and run it manually.
