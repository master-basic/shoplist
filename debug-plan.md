# GroceryMind - Debugging Plan & Fixes

## Issue 1: Create List - Enter key does nothing
- **File:** `src/pages/Lists.tsx:338-341`
- **Root Cause:** Input field in create modal has no `onKeyDown` handler for Enter key
- **Fix:** Add `onKeyDown` handler that submits on Enter

## Issue 2: Mark as Bought does nothing
- **File:** `src/pages/ShoppingPage.tsx:56-116`
- **Root Cause:** 
  - `handleMarkAsBought` doesn't collect checked items before showing confirmation
  - `itemsToConfirm` is never set by "Mark as Bought" flow
  - Field name mismatch: items sent to server have `id`/`actual_price` but server expects `listItemId`/`unitPrice`
- **Fix:** `handleMarkAsBought` should collect checked items from list, set them, then show confirmation
- **Fix:** Map item fields correctly before sending to server

## Issue 3: Price trend crashes - "previous_price undefined"
- **File:** `src/pages/PriceCheckPage.tsx:341`
- **Root Cause:** Server `/api/price-check/trends` returns `current_price` and `period_start_price`, but frontend TrendEntry interface has `previous_price` and `current_price`. Field names don't match, so `t.previous_price` is undefined.
- **Fix:** Map server response fields to TrendEntry interface, or add fallback for undefined

## Issue 4: Reports not working
- **File:** `src/pages/ReportsPage.tsx:250-254`
- **Root Cause:** `alert.currentPrice.toFixed(2)` crashes if price data is null/undefined from server
- **Fix:** Add null-safe fallbacks for all `.toFixed()` calls

## Issue 5: Price becomes zero in shopping
- **File:** `src/pages/ShoppingPage.tsx:209,125`
- **Root Cause:** Fallback `item.estimated_price || 0` defaults to 0 when no price set
- **Fix:** Keep the user-entered price in `itemPrices` state, don't override with 0

## Issue 6: Approx price per Store not showing
- **File:** `src/pages/ShoppingPage.tsx`
- **Root Cause:** ShoppingPage doesn't fetch or display per-store price estimates
- **Fix:** Add cheapest-store data fetch and display estimated prices per item

## Issue 7: Store name free text instead of predefined list
- **File:** `src/pages/ShoppingPage.tsx:228-232`
- **Root Cause:** Using free-text Input instead of Select with predefined stores
- **Fix:** Replace Input with Select dropdown (Bravo, Araz, Oba, Local Market, etc.)

## Issue 8: Purchase Confirm Modal field mismatch
- **File:** `src/components/PurchaseConfirmModal.tsx:4-9`
- **Root Cause:** PurchaseItem interface uses `listItemId`/`unitPrice` but ShoppingPage passes `id`/`actual_price`
- **Fix:** Align field names between PurchaseConfirmModal and ShoppingPage
