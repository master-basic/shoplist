# WCAG 2.1 AA Accessibility Audit — GroceryMind

**Date:** 2026-07-27
**Scope:** All components in `src/components/` and `src/pages/`
**Status:** 12 critical issues, 6 minor issues identified

---

## Critical Issues (Must Fix)

### 1. Modal — Missing dialog semantics and focus trap
**WCAG:** 4.1.2 Name, Role, Value; 2.4.3 Focus Order
**File:** `src/components/ui/Modal.tsx:54-91`
- Missing `role="dialog"` on container `<div>`
- Missing `aria-modal="true"`
- Missing `aria-labelledby` referencing the `<h2>` title
- No focus trap — Tab key can navigate to elements behind the modal
- No initial focus management when modal opens

### 2. ConfirmationModal — Missing dialog semantics
**WCAG:** 4.1.2 Name, Role, Value
**File:** `src/components/ConfirmationModal.tsx:58-115`
- Missing `role="dialog"` on container
- Missing `aria-modal="true"`
- Missing `aria-labelledby` referencing the title
- No focus trap

### 3. PurchaseConfirmModal — Missing dialog semantics
**WCAG:** 4.1.2 Name, Role, Value
**File:** `src/components/PurchaseConfirmModal.tsx:55-122`
- Missing `role="dialog"` on container
- Missing `aria-modal="true"`
- Missing `aria-labelledby` referencing the title
- No focus trap

### 4. AddItemModal — Missing dialog semantics and aria-labels
**WCAG:** 4.1.2 Name, Role, Value
**File:** `src/components/AddItemModal.tsx:138-408`
- Missing `role="dialog"` on container
- Missing `aria-modal="true"`
- Missing `aria-labelledby` referencing the title
- Close button (line 144) missing `aria-label="Close"`

### 5. Header — Icon-only buttons missing accessible names
**WCAG:** 4.1.2 Name, Role, Value; 1.1.1 Non-text Content
**File:** `src/components/layout/Header.tsx:24-96`
- Mobile menu toggle (line 25) — button with only SVG icon, no `aria-label`
- Notification bell (line 68) — button with only SVG icon, no `aria-label`
- Currency select (line 84) — `<select>` with no `aria-label`
- User avatar (line 94) — clickable `<div>` with no `aria-label`

### 6. GroceryItemCard — Buttons missing accessible names
**WCAG:** 4.1.2 Name, Role, Value; 1.1.1 Non-text Content
**File:** `src/components/GroceryItemCard.tsx:73-299`
- Checkbox buttons (line 73, 144) — no `aria-label`, no `aria-checked` state
- Edit button (line 262) — has `title` but should also have `aria-label`
- Not bought button (line 279) — has `title` but should also have `aria-label`
- Remove button (line 289) — has `title` but should also have `aria-label`
- Edit mode inputs (lines 166-187, 304) — no `aria-label`

### 7. SearchBar — Input missing accessible name
**WCAG:** 1.3.1 Info and Relationships; 4.1.2 Name, Role, Value
**File:** `src/components/SearchBar.tsx:37-43`
- Search input has no `<label>`, no `aria-label`, and no `id`
- Clear button (line 45) has no `aria-label`

### 8. Switch — Missing keyboard interaction
**WCAG:** 2.1.1 Keyboard; 4.1.2 Name, Role, Value
**File:** `src/components/ui/Switch.tsx:30-47`
- Visual `<div>` with `role="switch"` and `aria-checked` — good
- Missing `tabIndex={0}` on the div — cannot receive keyboard focus
- Missing `onKeyDown` handler for Space/Enter to toggle the switch

### 9. Card — Clickable card missing keyboard support
**WCAG:** 2.1.1 Keyboard; 4.1.2 Name, Role, Value
**File:** `src/components/ui/Card.tsx:24-44`
- When `onClick` is provided, `<div>` is clickable but not keyboard-accessible
- Missing `role="button"`, `tabIndex={0}`, and `onKeyDown` for Enter/Space

### 10. OfflineBanner — Not announced to screen readers
**WCAG:** 4.1.3 Status Messages
**File:** `src/components/OfflineBanner.tsx:10-17`
- Missing `role="status"` or `role="alert"` for screen reader announcement

### 11. Toast — Not announced to screen readers
**WCAG:** 4.1.3 Status Messages
**File:** `src/components/ui/Toast.tsx:52-71`
- Missing `role="alert"` for screen reader announcement
- Missing `aria-live="polite"` region

### 12. MainLayout — Navigation landmarks missing labels
**WCAG:** 1.3.1 Info and Relationships
**File:** `src/components/layout/MainLayout.tsx:54-137`
- Desktop nav (line 57) missing `aria-label="Main navigation"`
- Mobile nav (line 111) missing `aria-label="Mobile navigation"`

---

## Minor Issues (Should Fix)

### 13. Register — Step indicator not accessible
**WCAG:** 1.3.1 Info and Relationships
**File:** `src/components/auth/Register.tsx:72-76`
- Step indicator dots only use color to convey state
- Missing `aria-label` like "Step 2 of 4"

### 14. SpendingSummary — Chart not accessible
**WCAG:** 1.1.1 Non-text Content
**File:** `src/components/SpendingSummary.tsx:48-57`
- Bar chart missing `role="img"` and `aria-label` description

### 15. GroceryItemCard — Edit mode inputs missing labels
**WCAG:** 1.3.1 Info and Relationships
**File:** `src/components/GroceryItemCard.tsx:166-211`
- Edit mode name input (line 166) — no `aria-label`
- Edit mode quantity input (line 174) — no `aria-label`
- Edit mode unit input (line 181) — no `aria-label`
- Edit mode price input (line 190) — no `aria-label`
- Edit mode category select (line 197) — no `aria-label`

### 16. GroceryItemCard — Suggested items not keyboard accessible
**WCAG:** 2.1.1 Keyboard
**File:** `src/components/AddItemModal.tsx:349-376`
- Suggested items use `onClick` on `<div>` — not keyboard accessible

### 17. StoreSuggest — Dropdown items not keyboard accessible
**WCAG:** 2.1.1 Keyboard
**File:** `src/components/StoreSuggest.tsx:62-74`
- Dropdown items use `onMouseDown` on `<div>` — not keyboard accessible

### 18. ScanReview — Checkboxes missing labels
**WCAG:** 4.1.2 Name, Role, Value
**File:** `src/components/ScanReview.tsx:101-105`
- Checkbox components have no `aria-label` for individual items

---

## Summary

| Severity | Count | Status |
|----------|-------|--------|
| Critical | 12 | To fix in this session |
| Minor | 6 | Documented for future |

**Total accessibility issues:** 18
