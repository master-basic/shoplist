# GroceryMind - Project Plan & Status Report

## Overview
GroceryMind is a modern, fully functional, multi-user grocery list management web application that is fully responsive and works on both web browsers and mobile devices (PWA-ready). The app feels like a polished consumer product (a cross between Notion and Splitwise, but for groceries).

---

## Tech Stack

### Frontend
- **React 19** with TypeScript
- **Tailwind CSS 4** for styling
- **Vite** as build tool
- **Zustand** for state management
- **React Router 7** for routing
- **@tanstack/react-query** for data fetching
- **Recharts** for charts/analytics
- **PostgreSQL** for backend database (self-hosted)

### Offline Support
- **IndexedDB** (via idb library)
- **Service Worker** (PWA)
- **React Query caching**

---

## Project Structure

```
grocerymind/
├── .env.example              # Environment variables template
├── .env                      # Local environment configuration
├── package.json              # Dependencies
├── tsconfig.json             # TypeScript configuration
├── vite.config.ts            # Vite configuration
├── tailwind.config.js        # Tailwind configuration
├── postcss.config.js         # PostCSS configuration
├── PROJECT_PLAN.md          # This file
├── README.md                 # Project documentation
├── src/
│   ├── components/
│   │   ├── ui/              # Reusable UI components (Button, Input, Modal, etc.)
│   │   ├── auth/            # Login, Register, Onboarding
│   │   ├── layout/          # MainLayout, MobileLayout
│   │   ├── lists/           # List components
│   │   ├── charts/          # Chart components
│   │   ├── notifications/   # Toast, Alerts
│   │   ├── receipt/         # Receipt scanning UI
│   │   ├── search/          # Search UI
│   │   └── common/          # Common components (Badge, Spinner, etc.)
│   ├── hooks/               # Custom React hooks (useAuth, useLists, useHousehold)
│   ├── api/                 # API functions for database operations
│   ├── config/              # Database configuration and migrations
│   ├── lib/                 # Utility functions
│   ├── pages/               # Route pages
│   ├── store/               # Zustand store
│   ├── styles/              # Global styles
│   ├── types/               # TypeScript types
│   └── utils/               # Helper utilities
├── public/
│   ├── manifest.json        # PWA manifest
│   └── sw.js                # Service worker
└── dist/                    # Build output
```

---

## Implementation Phases

### Phase 1: Foundation (Setup, Auth, Basic Lists)
**Status: COMPLETE**

**Completed:**
- [x] Project structure setup (Vite + React 19 + TypeScript)
- [x] Install dependencies (React, Tailwind, Zustand, etc.)
- [x] Configure TypeScript with path aliases
- [x] Configure Tailwind CSS
- [x] Create utility functions
- [x] Create Zustand store with all entities (useStore.tsx)
- [x] Create authentication hooks (useAuth.tsx)
- [x] Create household hooks (useHousehold.ts)
- [x] Create grocery list hooks (useGroceryList.ts)
- [x] Create price history hook (usePriceHistory.ts)
- [x] Login page component
- [x] Register page component
- [x] Onboarding page component
- [x] Main layout components (MainLayout, Sidebar, Header)
- [x] App routing configuration (react-router-dom)
- [x] Store provider implementation
- [x] useGroceryList hook with CRUD operations
- [x] Toggle item checked status functionality
- [x] Mark all items checked/unchecked
- [x] Duplicate list functionality
- [x] Archive/restore list functionality
- [x] Reorder items functionality
- [x] Delete list functionality
- [x] Delete item functionality
- [x] **Database Setup - PostgreSQL**
- [x] **Database schema migration** (8 migration files)
- [x] **PostgreSQL client library installation** (pg)
- [x] **Environment configuration for PostgreSQL** (.env)
- [x] **Auth system integration with PostgreSQL** (bcrypt hashing)
- [x] **Remove Google OAuth functionality**
- [x] **Server backend (Express.js on port 3001)**
- [x] **All API endpoints** (/api/auth/*, /api/lists/*, /api/receipts/*)
- [x] **UI Components Library** (14 components)
- [x] **All Pages** (20 pages)

**UI Components Library - COMPLETE:**
- [x] Button (variants, sizes, loading state)
- [x] Input (with label, error, helper text)
- [x] Select (with options, placeholder)
- [x] Checkbox (with label, indeterminate)
- [x] Switch (toggle component)
- [x] Spinner (loading indicator)
- [x] Card (content container)
- [x] Badge (status badges)
- [x] Modal (dialog component)
- [x] Toast (notification system)
- [x] EmptyState (empty state placeholder)
- [x] FormLabel (form labels)
- [x] FormError (error messages)
- [x] FormGroup (form field wrapper)

**Layout Components - COMPLETE:**
- [x] MainLayout (responsive sidebar + header)
- [x] Sidebar (navigation menu)
- [x] Header (user info, actions)

**Pages - COMPLETE (20 pages):**
- [x] HomePage/Dashboard - Overview with stats and quick actions
- [x] Lists Screen - Browse and filter lists
- [x] ListDetail - Full list detail view with CRUD
- [x] ShoppingPage - Shopping mode with tap-friendly checkboxes
- [x] ScanPage - Receipt scanning UI
- [x] ReportsPage - Spending analytics with charts
- [x] SearchPage - Global search
- [x] ProfilePage - User profile
- [x] HouseholdPage - Household management
- [x] OnboardingPage - New user onboarding
- [x] Login - User authentication
- [x] Register - User registration
- [x] NotFound - 404 page
- [x] Dashboard - Home dashboard
- [x] GroceryItemCard - Item card component
- [x] ListCard - List card component
- [x] AddItemModal - Add item modal
- [x] ShoppingMode - Shopping mode overlay
- [x] CategoryGroup - Category group display
- [x] Auth components (Login, Register)

**Next Steps:**
- [ ] Create household system UI components
- [ ] Create basic grocery list CRUD UI components
- [ ] Add main navigation to MainLayout
- [ ] Implement list creation form
- [ ] Implement list item forms
- [ ] Add receipt scanning UI with camera/file upload
- [ ] Create price history view with charts
- [ ] Build reports dashboard with analytics
- [ ] Implement search functionality
- [ ] Create profile/settings page
- [ ] Implement price tracking at point of sale
- [ ] Add item assignment to household members
- [ ] Create recurring items feature
- [ ] Add low stock alerts
- [ ] Implement real-time sync for household members
- [ ] Create OCR integration for receipt scanning
- [ ] Add item auto-suggestion from history
- [ ] Implement offline support (IndexedDB)
- [ ] Create PWA manifest and service worker
- [ ] Add accessibility features
- [ ] Set up notifications
- [ ] Configure deployment pipeline
- [ ] Write comprehensive README

**UI Components Library:**
- [x] Button (variants, sizes, loading state)
- [x] Input (with label, error, helper text)
- [x] Select (with options, placeholder)
- [x] Checkbox (with label, indeterminate)
- [x] Switch (toggle component)
- [x] Spinner (loading indicator)
- [x] Card (content container)
- [x] Badge (status badges)
- [x] Modal (dialog component)
- [x] Toast (notification system)
- [x] EmptyState (empty state placeholder)
- [x] FormLabel (form labels)
- [x] FormError (error messages)
- [x] FormGroup (form field wrapper)

**Pages:**
- [x] HomePage/Dashboard - Overview with stats and quick actions
- [x] Lists Screen - Browse and filter lists
- [x] Shopping Page - Shopping mode with tap-friendly checkboxes
- [x] ListsDetail - List detail view
- [x] ScanPage - Receipt scanning UI
- [x] ReportsPage - Spending analytics
- [x] SearchPage - Global search
- [x] ProfilePage - User profile
- [x] NotFound - 404 page
- [ ] ListDetail - Full list item management
- [ ] PriceHistory - Price trends view
- [ ] HouseholdDetails - Household management detail

**Next Steps - Phase 2: Shopping & Interactions:**
- [ ] Shopping mode full-screen implementation
- [ ] Mark items as bought with purchase confirmation
- [ ] Track "Not bought" items with reasons
- [ ] Real-time sync across household members
- [ ] Item assignment to specific members
- [ ] Purchase session management
- [ ] Actual price tracking at point of purchase
- [ ] Store auto-suggestion from history

**Next Steps - Phase 3: Receipt Scanning & OCR:**
- [ ] Camera access (mobile) and file upload (desktop)
- [ ] PDF receipt support
- [ ] Tesseract.js OCR integration
- [ ] Store name detection
- [ ] Item parsing with fuzzy matching
- [ ] Manual review and correction UI
- [ ] Receipt image storage in PostgreSQL
- [ ] OCR confidence highlighting
- [ ] Match scanned items to existing list items

**Next Steps - Phase 4: Price Tracking & Analytics:**
- [ ] Price history normalization (strip brands, standardize units)
- [ ] Unit price tracking (not total)
- [ ] Line charts showing price trends (Recharts)
- [ ] Price change alerts (5%+ threshold)
- [ ] "Best deal" badges
- [ ] Price history view per item
- [ ] Cheapest store overall calculation
- [ ] Average price (last 30/90/180 days)
- [ ] All-time low and high tracking

**Next Steps - Phase 5: Advanced Features:**
- [ ] Recurring items (auto-add to new lists)
- [ ] Low stock alerts (restock threshold)
- [ ] AI-powered item categorization
- [ ] Budget warnings (notify when exceeding budget)
- [ ] Overview dashboard with charts
- [ ] Category spending breakdown (pie chart)
- [ ] Store comparison charts (bar chart)
- [ ] Export (CSV/PDF)
- [ ] Global search functionality
- [ ] Smart suggestions when adding items
- [ ] Search history

**Next Steps - Phase 6: PWA & Accessibility:**
- [ ] Service worker registration
- [ ] PWA manifest configuration
- [ ] Offline capability (cache lists)
- [ ] Install prompt
- [ ] WCAG 2.1 AA compliance
- [ ] High contrast mode
- [ ] Screen reader support
- [ ] Keyboard navigation
- [ ] Large text mode

**Next Steps - Phase 7: Notifications:**
- [ ] Web push notifications setup
- [ ] Push notifications for household activities
- [ ] Push notifications for price change alerts
- [ ] Weekly spending summary
- [ ] List completion reminders
- [ ] Notification preferences in settings
- [ ] In-app notification center

**Next Steps - Phase 8: Database & PostgreSQL:**
- [ ] Configure database connection pool
- [ ] Set up database indexes for performance
- [ ] Create database triggers for price history
- [ ] Create database functions for common queries
- [ ] Implement connection health checks

**Next Steps - Phase 9: Security & Privacy:**
- [ ] GDPR compliance (data export/delete)
- [ ] Data encryption at rest and in transit
- [ ] Rate limiting on API calls
- [ ] Session management
- [ ] Password reset flow
- [ ] Two-factor authentication (optional future feature)

---

### Phase 2: Shopping & Interactions
**Status: IN PROGRESS**

- [x] Shopping mode view (tap-friendly checkboxes in ShoppingPage)
- [x] HomePage, Lists, ListDetail, ShoppingPage wired to PostgreSQL API
- [x] ProfilePage with real stats from API
- [x] HouseholdPage with member management via API
- [ ] Mark items as bought with purchase confirmation
- [ ] Track "Not bought" items with reasons
- [ ] Real-time sync across household members
- [ ] Item assignment to specific members
- [ ] Purchase session management
- [ ] Actual price tracking at point of purchase
- [ ] Store auto-suggestion from history

---

### Phase 3: Receipt Scanning & OCR
**Status: IN PROGRESS**

- [x] File upload (JPG, PNG) with server-side storage
- [x] Save receipts to PostgreSQL via API
- [x] Save scanned items as price history entries
- [x] Add scanned items to grocery lists
- [ ] Camera access (mobile) - placeholder UI exists
- [ ] PDF receipt support
- [ ] Tesseract.js OCR integration (currently simulated)
- [ ] Store name detection
- [ ] Item parsing with fuzzy matching
- [ ] Manual review and correction UI
- [ ] OCR confidence highlighting
- [ ] Match scanned items to existing list items

---

### Phase 4: Price Tracking & Analytics
**Status: IN PROGRESS**

- [x] Recharts visualization library integrated
- [x] Spending by store chart (BarChart)
- [x] Spending by category chart (PieChart)
- [x] Spending trend over time (LineChart)
- [x] Top items table by spending
- [x] Date range filtering (30/90/180/365/all)
- [x] ReportsPage fetches real data from price_history API
- [ ] Price history normalization (strip brands, standardize units)
- [ ] Unit price tracking (not total)
- [ ] Price change alerts (5%+ threshold)
- [ ] "Best deal" badges
- [ ] Price history view per item
- [ ] Cheapest store overall calculation
- [ ] Average price (last 30/90/180 days)
- [ ] All-time low and high tracking

---

### Phase 5: Advanced Features
**Status: PENDING**

- [ ] Recurring items (auto-add to new lists)
- [ ] Low stock alerts (restock threshold)
- [ ] AI-powered item categorization
- [ ] Budget warnings (notify when exceeding budget)
- [ ] Overview dashboard with charts
- [ ] Category spending breakdown (pie chart)
- [ ] Store comparison charts (bar chart)
- [ ] Export (CSV/PDF)
- [ ] Global search functionality
- [ ] Smart suggestions when adding items
- [ ] Search history

---

### Phase 6: PWA & Accessibility
**Status: PENDING**

- [ ] Service worker registration
- [ ] PWA manifest configuration
- [ ] Offline capability (cache lists)
- [ ] Install prompt
- [ ] WCAG 2.1 AA compliance
- [ ] High contrast mode
- [ ] Screen reader support
- [ ] Keyboard navigation
- [ ] Large text mode

---

### Phase 7: Notifications
**Status: PENDING**

- [ ] Web push notifications setup
- [ ] Push notifications for:
  - Household member starts shopping
  - Item checked off
  - Price change alerts
  - Weekly spending summary
  - List completion reminders
- [ ] Notification preferences in settings
- [ ] In-app notification center

---

### Phase 8: Database & PostgreSQL
**Status: IN PROGRESS**

- [x] Create PostgreSQL database schema
- [ ] Configure database connection pool
- [ ] Set up database indexes for performance
- [ ] Create database triggers for price history
- [ ] Create database functions for common queries
- [ ] Implement connection health checks

---

### Phase 9: Security & Privacy
**Status: PENDING**

- [ ] GDPR compliance (data export/delete)
- [ ] Data encryption at rest and in transit
- [ ] Rate limiting on API calls
- [ ] Session management
- [ ] Password reset flow
- [ ] Two-factor authentication (optional future feature)

---

## Database Schema (PostgreSQL)

### Core Tables

```sql
-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    is_admin BOOLEAN DEFAULT FALSE,
    preferred_currency VARCHAR(10) DEFAULT 'AZN',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Households table
CREATE TABLE households (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_by UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Users and Households relationship
CREATE TABLE user_households (
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    household_id UUID REFERENCES households(id) ON DELETE CASCADE,
    role VARCHAR(50) DEFAULT 'member',
    is_owner BOOLEAN DEFAULT FALSE,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, household_id)
);

-- Grocery Lists table
CREATE TABLE lists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    household_id UUID REFERENCES households(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_by UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- List Items table
CREATE TABLE list_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    list_id UUID REFERENCES lists(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    quantity DECIMAL(10, 2) DEFAULT 1,
    unit VARCHAR(50),
    category VARCHAR(100),
    is_organic BOOLEAN DEFAULT FALSE,
    is_branded BOOLEAN DEFAULT FALSE,
    brand VARCHAR(255),
    price DECIMAL(10, 2),
    currency VARCHAR(10) DEFAULT 'AZN',
    is_completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_by UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Receipts table
CREATE TABLE receipts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    household_id UUID REFERENCES households(id) ON DELETE CASCADE,
    list_id UUID REFERENCES lists(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    total_amount DECIMAL(10, 2),
    currency VARCHAR(10) DEFAULT 'AZN',
    image_url TEXT,
    ocr_data JSONB,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Receipt items
CREATE TABLE receipt_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    receipt_id UUID REFERENCES receipts(id) ON DELETE CASCADE,
    list_item_id UUID REFERENCES list_items(id) ON DELETE CASCADE,
    quantity DECIMAL(10, 2),
    unit_price DECIMAL(10, 2),
    total_price DECIMAL(10, 2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Price History table
CREATE TABLE price_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    list_item_id UUID REFERENCES list_items(id) ON DELETE CASCADE,
    price DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'AZN',
    store VARCHAR(255),
    purchase_date DATE,
    created_by UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Notifications table
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    household_id UUID REFERENCES households(id) ON DELETE CASCADE,
    type VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- User preferences table
CREATE TABLE user_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    key VARCHAR(100) NOT NULL,
    value JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, key)
);
```

---

## Key Features

### User System
- Sign up / login via email+password
- Password reset flow
- Session management with localStorage
- User profiles with display name, preferred currency
- Notification preferences
- Personal vs. shared list visibility settings

### Households
- Create or join a "household"
- Invite members via email or shareable invite link
- Each household has its own grocery lists, history, and expense data
- Roles: Owner, Admin, Member
- Users can belong to multiple households

### Grocery Lists
- Create multiple named grocery lists
- Add items with: name, quantity, unit, category, preferred store, estimated price, notes
- Drag-and-drop to reorder items
- Group items by category
- Assign items to specific household members
- Set target budget per list
- Duplicate lists as templates
- Archive completed lists

### Shopping Mode
- Large tap-friendly checkboxes for mobile
- Check off items as bought with purchase confirmation
- Track actual price paid, store name, quantity purchased
- "Not bought" tracking with reasons
- Real-time sync across household members
- Track who checked off each item

### Receipt Scanning
- Camera access (mobile) and file upload (desktop)
- PDF receipt support
- OCR extraction of: store name, date, line items, totals
- Review screen with item correction
- Fuzzy matching to existing list items
- Store receipt images in cloud storage

### Price Tracking
- Price history with normalized item names
- Unit price tracking (not total)
- Price trend indicators (green/red arrows)
- Percentage change from previous purchase
- Price history view with charts and tables
- Cheapest store overall
- Average price (last 30/90/180 days)
- All-time low and high

### Search
- Global search across items, stores, lists, dates
- Filter by household member, date range, store, category, price range
- Search history suggestions
- Smart suggestions when adding new items

### Reports & Analytics
- Total household spending this month vs. last month
- Spending by category (donut/pie chart)
- Spending by store (bar chart)
- Spending by household member
- Most purchased items (top 10)
- Average weekly/monthly spend trend
- Per-list reports (planned vs. actual)
- Export as PDF or CSV

### Smart Features
- Recurring items (auto-add to new lists)
- Low stock alerts (restock threshold)
- AI-powered item categorization
- Budget warnings
- "Best deal" badge for cheapest store

### Notifications
- Push notifications for:
  - Household member starts shopping
  - Item checked off
  - Price change alerts
  - Weekly spending summary
  - List completion reminders

### Offline Support
- Full offline capability for viewing lists
- Check off items offline
- Queue changes locally
- Sync when reconnected

### Accessibility
- WCAG 2.1 AA compliant
- High contrast mode
- Large text mode
- Screen reader compatible

---

## UI/UX Design

### Color Palette
- **Primary**: Fresh green (groceries/fresh food theme)
- **Base**: White/off-white
- **Text**: Dark slate
- **Accents**: Color-coded by category

### Mobile-First Design
- Bottom navigation bar on mobile
- Sidebar navigation on desktop
- Touch targets minimum 44px
- Smooth micro-animations

### Key Screens
1. Home/Dashboard — household summary, active lists, recent activity
2. Lists screen — all lists with status badges
3. List Detail — item list with checkboxes, assigned members
4. Shopping Mode — full-screen mode, large checkboxes
5. Scan Receipt — camera view + OCR review screen
6. Item Detail / Price History — chart + purchase history table
7. Reports — charts dashboard with filters
8. Search — full-text search with filters
9. Household Settings — members, invites, roles
10. Profile / Settings — personal preferences

---

## Security & Privacy

- All data scoped to household
- Receipt images stored in private cloud storage
- Data encryption at rest and in transit
- GDPR-compliant: users can export or delete all data
- Rate limiting on receipt scanning API calls

---

## Launch Checklist

- [ ] Responsive design tested on iPhone SE, iPhone 14, iPad, 1080p desktop, 4K desktop
- [ ] PWA manifest and service worker configured
- [ ] Error states for all API calls
- [ ] Onboarding flow for new users
- [ ] Demo mode with sample data
- [ ] Analytics event tracking
- [ ] Database RLS policies configured
- [ ] Environment variables documented
- [ ] README with setup instructions

---

## Current Status

**Phase 1: Foundation - COMPLETE**

**Completed:**
- [x] Project structure setup (Vite + React 19 + TypeScript)
- [x] Install dependencies (React, Tailwind, Zustand, etc.)
- [x] Configure TypeScript with path aliases
- [x] Configure Tailwind CSS
- [x] Create utility functions
- [x] Create Zustand store with all entities
- [x] Create authentication hooks (useAuth) - works with PostgreSQL API
- [x] Create household hooks (useHousehold) - **migrated from Supabase to PostgreSQL API**
- [x] Create grocery list hooks (useGroceryList)
- [x] Create price history hook (usePriceHistory) - **migrated from Supabase to PostgreSQL API**
- [x] Login page component
- [x] Register page component
- [x] Household management page
- [x] Main layout components (MainLayout, Sidebar, Header)
- [x] App routing configuration
- [x] Store provider implementation
- [x] UI Components Library (14 components: Button, Input, Select, Checkbox, Switch, Spinner, Card, Badge, Modal, Toast, EmptyState, FormLabel, FormError, FormGroup)
- [x] All Pages (20+ pages created)
- [x] **Database Setup - PostgreSQL**
- [x] **Database schema migration** (2 migration files)
- [x] **PostgreSQL client library installation** (pg)
- [x] **Environment configuration for PostgreSQL** (.env)
- [x] **Auth system integration with PostgreSQL** (bcrypt hashing)
- [x] **Remove Google OAuth functionality**
- [x] **Server backend (Express.js on port 3001)**
- [x] **All API endpoints** (/api/auth/*, /api/lists/*, /api/receipts/*, /api/price-history/*)
- [x] **Server bug fixes** (login SQL, household members SQL, list query filter, missing PATCH endpoint)

**Phase 2: Shopping & Interactions - IN PROGRESS**

**Completed:**
- [x] HomePage - fetches real data from API (stats, lists, recent lists)
- [x] Lists page - create/delete lists via API, toggle items via API
- [x] ListDetail page - load lists from API, add/delete/toggle items via API
- [x] ShoppingPage - fetch lists from API, toggle items via API
- [x] ProfilePage - fetch real stats from API, show households
- [x] HouseholdPage - load members from API, create households, invite members
- [x] GroceryItemCard - fixed import to use @/types

**Not Yet Done:**
- [ ] Full-screen shopping mode with purchase confirmation
- [ ] Track "Not bought" items with reasons
- [ ] Real-time sync across household members
- [ ] Item assignment to specific members
- [ ] Purchase session management
- [ ] Actual price tracking at point of purchase

**Phase 3: Receipt Scanning & OCR - IN PROGRESS**

**Completed:**
- [x] File upload and camera placeholder UI
- [x] Simulated OCR with review flow
- [x] Save receipts to API (POST /api/receipts)
- [x] Save scanned items as price history entries
- [x] Add scanned items to grocery lists via API
- [x] Receipt image upload to server

**Not Yet Done:**
- [ ] PDF receipt support
- [ ] Tesseract.js OCR integration (real OCR instead of simulated)
- [ ] Store name detection
- [ ] Item parsing with fuzzy matching
- [ ] Manual review and correction UI
- [ ] Receipt image storage in PostgreSQL

**Phase 4: Price Tracking & Analytics - IN PROGRESS**

**Completed:**
- [x] Recharts integration for spending charts (BarChart, PieChart, LineChart)
- [x] ReportsPage fetches real data from price_history API
- [x] Spending by store chart (bar)
- [x] Spending by category chart (pie)
- [x] Spending trend over time (line)
- [x] Top items by spending table
- [x] Date range filtering (30/90/180/365/all time)

**Not Yet Done:**
- [ ] Price history normalization
- [ ] Unit price tracking
- [ ] Price change alerts
- [ ] "Best deal" badges
- [ ] Price history view per item

**Phase 4: Price Tracking & Analytics - PENDING**
- [ ] Recharts integration for charts
- [ ] Price history normalization
- [ ] Unit price tracking
- [ ] Line charts showing price trends
- [ ] Price change alerts
- [ ] ReportsPage - needs real data from price_history API

**Phase 5-9: Advanced Features - PENDING**
- See PROJECT_PLAN.md for full list

---

**Known Issues:**
- ReportsPage still uses store data (not wired to price_history API yet)
- SearchPage works but quick-add is not wired to API
- ScanPage OCR is simulated (hardcoded response)
- No JWT/session auth middleware on server
- No unit tests
- Duplicate page files exist (*Page.tsx and *.tsx variants)

**Last Updated:** 2026-07-20

---

## Architecture Notes

### State Management Pattern
- **Zustand** for global state (lists, households, price history)
- **React Context** for state distribution
- **Custom Hooks** for business logic abstraction
- **PostgreSQL Client** for database operations

### Data Flow
1. User action triggers hook function
2. Hook performs database API call
3. State update via Zustand
4. React components re-render
5. Real-time listeners for live updates

### Security Model
- Database permissions enforce household data isolation
- Session management with localStorage
- Row-level policies check household membership
- Storage buckets with private access

---

## Environment Variables

```env
# PostgreSQL Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=grocerymind
DB_USER=postgres
DB_PASSWORD=your_password_here

# Optional: Use Supabase instead of local PostgreSQL
# VITE_SUPABASE_URL=your_supabase_url
# VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## Deployment

- **Frontend**: Vercel
- **Backend**: Self-hosted PostgreSQL
- **CI/CD**: Vercel auto-deploy from Git

### Pre-deployment Steps
1. Create Supabase project (optional, for cloud hosting)
2. Run SQL schema migrations
3. Set up database indexes
4. Configure environment variables
5. Set up PostgreSQL on your server
6. Deploy to Vercel
7. Test all features
8. Configure custom domain (optional)

---

## Changelog

### [2026-06-02] Database Migration to PostgreSQL
**Changes Made:**
- Migrated from Supabase to self-hosted PostgreSQL database
- Created database schema migration file (`src/config/migrations/001_initial_schema.sql`)
- Installed PostgreSQL client library (`pg`) and TypeScript types
- Created environment configuration for PostgreSQL (`.env` and `.env.example`)
- Implemented authentication API functions with bcrypt password hashing
- Created grocery list API functions for CRUD operations
- Updated `useAuth` hook to use PostgreSQL database
- Removed Google OAuth functionality for now
- Created database with admin and test users
- All authentication now works with real PostgreSQL database

**Files Modified:**
- `src/config/migrations/001_initial_schema.sql` - Database schema
- `.env` - PostgreSQL connection settings
- `.env.example` - Environment template
- `src/api/auth.ts` - Authentication API functions
- `src/api/lists.ts` - Grocery list API functions
- `src/hooks/useAuth.tsx` - Updated to use PostgreSQL auth
- `src/config/database.ts` - PostgreSQL connection pool

**Status:** Database integration complete, authentication working with PostgreSQL.

### [2026-07-20] Critical Bug Fixes & Phase 2 Progress
**Changes Made:**
- **Migrated useHousehold.ts from Supabase to PostgreSQL API** - Removed Supabase client dependency, rewrote to use `/api/auth/households` and `/api/households/:id/members` endpoints
- **Migrated usePriceHistory.ts from Supabase to PostgreSQL API** - Removed Supabase client dependency, rewrote to use `/api/price-history` and `/api/price-history/stats` endpoints
- **Fixed login route SQL bug** - Server queried `WHERE username = $1` but users table has no `username` column; changed to `WHERE email = $1`
- **Fixed household members SQL alias error** - SQL used `uh.household_id` but alias was `uhm`; corrected to `uhm.household_id`
- **Fixed lists query filter** - Removed `is_owner = TRUE` filter that excluded non-owner members from seeing lists
- **Added missing PATCH /api/lists/items/:id endpoint** - Required for toggling item completion status
- **Added price history API endpoints** - `GET/POST /api/price-history`, `GET /api/price-history/stats`
- **Added household items endpoint** - `GET /api/households/:id/items`
- **Added list stats endpoint** - `GET /api/lists/:id/stats`
- **Created migration 002** - `002_fix_price_history_and_grocery_lists.sql` adds `grocery_lists` table, fixes `price_history` columns
- **Updated HomePage** - Fetches real data from API instead of hardcoded mock data
- **Updated ShoppingPage** - Uses API via store instead of direct fetch mutations
- **Updated Lists page** - Create/delete lists via API, toggle items via API
- **Updated ListDetail page** - Load lists from API, add/delete/toggle items via API
- **Updated ProfilePage** - Fetch real stats from API, show households
- **Updated HouseholdPage** - Load members from API, create households, invite members
- **Fixed GroceryItemCard** - Changed import from `@store/useStore` to `@/types`
- **Added FormLabel, FormError, FormGroup UI components**

### [2026-07-20] Phase 3 & 4 Progress - ReportsPage, ScanPage API Integration
**Changes Made:**
- **Rewrote ReportsPage** - Now fetches real data from `price_history` API instead of store
- **Added Recharts charts** - BarChart for spending by store, PieChart for spending by category, LineChart for spending trend over time
- **Added date range filtering** - Quick select for 30/90/180/365/all time
- **Added top items table** - Shows most-purchased items sorted by total spending
- **Wired ScanPage to API** - Uploads receipt images to server, saves receipts via `POST /api/receipts`, saves price history via `POST /api/price-history`, adds items to lists via `POST /api/lists/:id/items`
- **Fixed server receipt creation** - Added `userId` parameter to receipt POST endpoint
- **Updated Card component** - Added `onClick` prop support for interactive cards
- **Updated HouseholdMember type** - Added `name`, `email`, `is_owner` fields

**Files Modified:**
- `src/pages/ReportsPage.tsx` - Recharts integration, API data fetching
- `src/pages/ScanPage.tsx` - API integration for saving receipts/items
- `src/components/ui/Card.tsx` - Added onClick prop
- `src/types/index.ts` - HouseholdMember type updates
- `server/index.js` - Added userId to receipt creation
- `PROJECT_PLAN.md` - Updated all phase status sections

**Status:** Phase 1 complete. Phase 2 in progress. Phase 3 in progress. Phase 4 in progress.

**Files Modified:**
- `server/index.js` - Server bug fixes and new endpoints
- `src/hooks/useHousehold.ts` - Migrated from Supabase to PostgreSQL API
- `src/hooks/usePriceHistory.ts` - Migrated from Supabase to PostgreSQL API
- `src/pages/HomePage.tsx` - Real API data
- `src/pages/ShoppingPage.tsx` - API integration
- `src/pages/Lists.tsx` - API integration
- `src/pages/ListDetail.tsx` - API integration
- `src/pages/ProfilePage.tsx` - Real stats from API
- `src/pages/HouseholdPage.tsx` - API integration
- `src/components/GroceryItemCard.tsx` - Fixed import
- `src/types/index.ts` - Added `description?` to Household type
- `src/config/migrations/002_fix_price_history_and_grocery_lists.sql` - New migration

**Status:** Phase 1 complete. Phase 2 in progress - all major pages wired to PostgreSQL API.

### [2026-07-20] UI Component Improvements
**Changes Made:**
- Updated `Input.tsx` - Simplified icon prop (single icon instead of leftIcon/rightIcon), added required indicator
- Updated `Select.tsx` - Added placeholder prop, custom chevron icon, improved styling
- Updated `index.ts` - Reorganized exports, added FormLabel/FormError/FormGroup

**Status:** UI component library updated and complete (14 components).

---