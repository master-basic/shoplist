# Bug Fix Plan

## Bugs to Fix

### 1. Toast Notification Component
**Problem:** Lists page shows error text but no Toast notification  
**File:** `src/pages/Lists.tsx`  
**Fix:** Create/use Toast component and show error as toast instead of just text

### 2. Loading States on Register Wizard  
**Problem:** Steps 2-3 have no loading indicator when data fetches  
**File:** `src/components/auth/Register.tsx`  
**Fix:** Add loading spinner to "Next" buttons in steps 2 & 3

### 3. Empty State in ListDetail  
**Problem:** ListDetail page doesn't show empty state  
**File:** `src/pages/ListDetail.tsx`  
**Fix:** Add empty state when list has no items

## Priority (Updated — Jul 27, 2026)
1. **CI pipeline** — GitHub Actions for automated testing
2. **Server test coverage** — Comprehensive route-level tests for 12 modules
3. **Page-level tests** — All 15 pages need coverage
4. **Integration tests** — API + frontend flow tests

## Already Fixed (verified)
- Admin delete confirmation ✅ (line 51)
- AddItemModal validation ✅ (line 80-84)
- Purchase FK violation — preserved DB IDs ✅
- Stale persisted lists — Zustand partialize fixed ✅
- Price history INSERT missing columns ✅
- useAuth converted to React Query ✅
- All 4 hooks on React Query ✅
- WebSocket real-time sync ✅
- Store auto-suggestion (StoreSuggest) ✅
- Purchase confirm modal ✅
- Camera capture + OCR review workflow ✅
- Per-item price history + unit normalization ✅
- Recurring items (backend + frontend) ✅
- Dashboard + CSV export + global search ✅
