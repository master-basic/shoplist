# GroceryMind Manual Test Procedure

## Prerequisites
- Server running: `cd server && node index.js`
- Client running: `npm run dev`
- Admin login: `admin@example.com` / `admin` (or `admin` / `admin`)

---

## 1. Registration
1. Go to `/register`
2. Fill in name, email, username, password
3. Complete the wizard (household → store → currency → finish)
4. ✓ Should redirect to `/` (home page) with user logged in

## 2. Login
1. Go to `/login`
2. Enter **username** `admin` + password `admin`
3. ✓ Should login successfully
4. Logout, then login with **email** `admin@example.com` + password `admin`
5. ✓ Should also work

## 3. Household
1. Go to `/household` (link in top nav bar)
2. ✓ Should show current household info and members
3. Click "Create Household", enter name, create
4. ✓ New household is created and selected
5. Click "Invite Members", enter email of another registered user
6. ✓ User is added to household (visible in members list)

## 4. Create List
1. Go to `/lists` (link in top nav)
2. Click "+ New List", enter name, click Create
3. ✓ List appears in the grid
4. ✓ Error message shows "No household found" with a **clickable link** to `/household` if no household exists

## 5. Add Items
1. Click on a list to open it
2. Click "Add Item", enter name, quantity, price, category
3. ✓ Item appears in the list
4. Repeat for 2-3 items

## 6. Shopping
1. Go to `/shopping`
2. Select a list
3. Toggle items as checked
4. ✓ Items show as checked
5. Click "Complete Purchase", enter store name
6. ✓ Purchase is saved

## 7. Reports
1. Go to `/reports` or `/purchases`
2. ✓ Purchase appears in the purchase history list
3. Click on a purchase to see details
4. ✓ Items and prices are displayed

## 8. Scan (OCR)
1. Go to `/scan`
2. Upload a receipt image or use camera
3. ✓ OCR processes the image (may take a moment)
4. ✓ Extracted items can be added to a list

## 9. Admin
1. Go to `/admin`
2. ✓ User list is displayed
3. Create a new user
4. ✓ User appears in the list
5. Reset a user's password
6. Delete a user (with confirmation)

## 10. Profile
1. Go to `/profile`
2. ✓ User info is displayed
3. ✓ Household memberships are shown

---

## Automated Test
Run `node e2e-test.mjs` (server must be running on port 3001):
- Tests: register, login, households, lists, items, purchase, price history, best deals, stats
- 21 tests total, all should pass
