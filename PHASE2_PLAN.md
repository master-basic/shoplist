# Phase 2 Implementation Plan: Shopping & Interactions

## Overview
Implement 5 missing features to complete Phase 2 (~75% → 100%)

---

## 1. Mark Items Bought with Confirmation Dialog

**Goal:** Add confirmation before marking multiple items as bought

**Files to Modify:**
- `src/pages/ShoppingPage.tsx`
- `src/api/purchases.ts`

**Implementation:**
```
1. ShoppingPage.tsx:
   - Add state for confirmation modal (showConfirm, selectedItems)
   - Change "Mark as Bought" button to select items first
   - Show confirmation modal with list of selected items
   - After confirmation, call completePurchase with selected items

2. purchases.js (server):
   - Add endpoint: GET /api/purchase-sessions/:sessionId/items
   - Return items for confirmation display
```

**Priority:** HIGH (UX improvement)

---

## 2. Actual Price Entry During Shopping

**Goal:** Allow users to enter actual prices while shopping

**Files to Modify:**
- `src/pages/ShoppingPage.tsx`
- `src/components/AddItemModal.tsx`
- `src/store/purchaseSlice.ts`
- `src/api/purchases.ts`

**Implementation:**
```
1. AddItemModal.tsx:
   - Add "Actual Price" field (optional)
   - Add "Unit Price" field (optional)

2. purchaseSlice.ts:
   - Add `actual_price` and `unit_price` to ListItem type
   - Store price data in purchase state

3. ShoppingPage.tsx:
   - Add input fields for price entry
   - Save prices to purchase session

4. purchases.ts (API):
   - Update createPurchaseSession to accept prices
   - Update completePurchase to save actual prices to price_history
```

**Priority:** HIGH (core shopping feature)

---

## 3. Real-Time Sync (WebSocket/SSE)

**Goal:** Sync grocery lists across household members in real-time

**Files to Modify:**
- `src/pages/ShoppingPage.tsx`
- `src/pages/Lists.tsx`
- `src/pages/ListDetail.tsx`
- `src/store/useStore.tsx`
- `server/index.js` (or new `server/ws.js`)

**Implementation:**
```
1. Choose protocol:
   - Option A: WebSocket (full duplex, bidirectional)
   - Option B: Server-Sent Events (SSE, one-way server→client)
   - Recommended: SSE for simplicity (lists are read-heavy)

2. Server (server/index.js):
   - Add SSE endpoint: GET /api/lists/:id/stream
   - Emit events on list changes:
     * list:updated
     * item:added
     * item:removed
     * item:completed

3. Client (all pages):
   - Add useSSE hook
   - Connect on mount
   - Subscribe to list ID
   - Render updates from events

4. Store:
   - Add refresh function triggered by SSE events
   - Invalidate cache when events received
```

**Priority:** MEDIUM (collaboration feature)

---

## 4. Store Auto-Suggestion from History

**Goal:** Suggest stores based on user's purchase history

**Files to Modify:**
- `src/pages/Lists.tsx`
- `src/pages/AddItemModal.tsx`
- `src/store/priceHistorySlice.ts`
- `src/api/priceHistory.ts`

**Implementation:**
```
1. priceHistorySlice.ts:
   - Add method: getStoreSuggestions(itemName)
   - Return array of stores with price history for item

2. priceHistory.ts (API):
   - Add endpoint: GET /api/price-history/suggestions?itemName=...
   - Return: [{ store: string, count: number, avgPrice: number }]

3. AddItemModal.tsx:
   - Add "Preferred Store" dropdown with suggestions
   - Show frequency: "You buy milk at Bravo 80% of the time"

4. Lists.tsx:
   - Show store suggestions in "Smart Suggestions" section
```

**Priority:** MEDIUM (convenience feature)

---

## 5. Purchase Session Management UI

**Goal:** View and manage past purchase sessions

**Files to Modify:**
- `src/pages/` (new page)
- `src/store/purchaseSlice.ts`
- `src/api/purchases.ts`

**Implementation:**
```
1. Create new page: PurchaseHistory.tsx
   - List all purchase sessions with date/time
   - Filter by store, date range
   - Show summary: items bought, total spent

2. purchaseSlice.ts:
   - Add methods: getPurchaseSessions, deletePurchaseSession

3. purchases.ts (API):
   - Add endpoint: GET /api/purchases/sessions
   - Add endpoint: DELETE /api/purchases/sessions/:id

4. Link from Reports page:
   - Add "View Purchase History" button
   - Navigate to /purchases
```

**Priority:** LOW (administrative feature)

---

## Implementation Order

### Week 1: Core Shopping Features
1. **Actual Price Entry** (Foundation - needed for analytics)
2. **Mark Items Bought Confirmation** (UX improvement)

### Week 2: Collaboration & History
3. **Real-Time Sync** (Major feature - requires testing)
4. **Store Auto-Suggestion** (Enhances existing features)

### Week 3: Administration
5. **Purchase Session Management UI** (Completes Phase 2)

---

## Testing Strategy

1. **Unit Tests:**
   - Purchase slice actions
   - Price calculation logic
   - Store suggestion algorithm

2. **Integration Tests:**
   - SSE events trigger store updates
   - Price data saves to DB correctly

3. **E2E Tests:**
   - Complete shopping flow with price entry
   - Multi-user list updates (SSE)

---

## Dependencies

- **SSE:** Native fetch + EventSource (no extra packages)
- **WebSocket:** `ws` or `socket.io` (if choosing WS over SSE)
- **No new packages needed** for price/suggestion features

---

## Estimated Effort

| Feature | Files | Hours |
|---------|-------|-------|
| Mark Items Confirmation | 2 | 2 |
| Actual Price Entry | 4 | 4 |
| Real-Time Sync (SSE) | 5 | 8 |
| Store Auto-Suggestion | 4 | 3 |
| Purchase Session UI | 3 | 3 |
| **Total** | **18** | **20 hours** |
