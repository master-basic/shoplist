# GroceryMind - Development Log
**Current Session:** July 21, 2026  
**Session Purpose:** Bug fixes — purchase FK error, price_history INSERT, stale persisted UUIDs

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