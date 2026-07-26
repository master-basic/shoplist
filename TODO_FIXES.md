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

## Already Fixed (verified)
- Admin delete confirmation ✅ (line 51)
- AddItemModal validation ✅ (line 80-84)
