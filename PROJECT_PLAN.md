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
**Status: IN PROGRESS**

**Completed:**
- [x] Project structure setup
- [x] Install dependencies (React, Tailwind, Zustand, Supabase, etc.)
- [x] Configure TypeScript with path aliases
- [x] Configure Tailwind CSS
- [x] Create utility functions
- [x] Create Zustand store with all entities
- [x] Create authentication hooks (useAuth)
- [x] Create household hooks (useHousehold)
- [x] Create grocery list hooks (useGroceryList)
- [x] Login page component
- [x] Register page component
- [x] Household management page
- [x] Main layout components (MainLayout, MobileLayout)
- [x] App routing configuration
- [x] Error boundary implementation
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
- [x] **Database schema migration**
- [x] **PostgreSQL client library installation**
- [x] **Environment configuration for PostgreSQL**
- [x] **Auth system integration with PostgreSQL**
- [x] **Remove Google OAuth functionality**

**Next Steps:**
- [ ] Create household system UI components
- [ ] Create basic grocery list CRUD UI components
- [ ] Create UI components library (Button, Input, Modal, etc.)
- [ ] Create main layouts with navigation
- [ ] Create HomePage/Dashboard
- [ ] Create Lists screen
- [ ] Create List Detail view
- [ ] Create Shopping Mode view
- [ ] Create Receipt Scanning UI
- [ ] Create Price History view
- [ ] Create Reports dashboard
- [ ] Create Search page
- [ ] Create Profile/Settings page
- [ ] Create NotFound page

---

### Phase 2: Shopping & Interactions
**Status: PENDING**

- [ ] Shopping mode view (large tap-friendly checkboxes)
- [ ] Mark items as bought with purchase confirmation
- [ ] Track "Not bought" items with reasons
- [ ] Real-time sync across household members
- [ ] Item assignment to specific members
- [ ] Purchase session management
- [ ] Actual price tracking at point of purchase
- [ ] Store auto-suggestion from history

---

### Phase 3: Receipt Scanning & OCR
**Status: PENDING**

- [ ] Camera access (mobile) and file upload (desktop)
- [ ] PDF receipt support
- [ ] Tesseract.js OCR integration
- [ ] Store name detection
- [ ] Item parsing with fuzzy matching
- [ ] Manual review and correction UI
- [ ] Receipt image storage in PostgreSQL
- [ ] OCR confidence highlighting
- [ ] Match scanned items to existing list items

---

### Phase 4: Price Tracking & Analytics
**Status: PENDING**

- [ ] Price history normalization (strip brands, standardize units)
- [ ] Unit price tracking (not total)
- [ ] Line charts showing price trends (Recharts)
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

**Phase 1: Foundation - IN PROGRESS**

**Completed:**
- [x] Project structure setup
- [x] Install dependencies
- [x] Configure TypeScript with path aliases
- [x] Configure Tailwind CSS
- [x] Create utility functions
- [x] Create Zustand store with all entities
- [x] Create authentication hooks (useAuth)
- [x] Create household hooks (useHousehold)
- [x] Create grocery list hooks (useGroceryList)
- [x] Login page component
- [x] Register page component
- [x] Household management page
- [x] Main layout components (MainLayout, MobileLayout)
- [x] App routing configuration
- [x] Error boundary implementation
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
- [x] **Database schema migration**
- [x] **PostgreSQL client library installation**
- [x] **Environment configuration for PostgreSQL**
- [x] **Auth system integration with PostgreSQL**
- [x] **Remove Google OAuth functionality**

**Next Steps:**
- [ ] Create household system UI components
- [ ] Create basic grocery list CRUD UI components
- [ ] Create UI components library (Button, Input, Modal, etc.)
- [ ] Create main layouts with navigation
- [ ] Create HomePage/Dashboard
- [ ] Create Lists screen
- [ ] Create List Detail view
- [ ] Create Shopping Mode view
- [ ] Create Receipt Scanning UI
- [ ] Create Price History view
- [ ] Create Reports dashboard
- [ ] Create Search page
- [ ] Create Profile/Settings page
- [ ] Create NotFound page
- [ ] Implement Supabase database schema
- [ ] Configure Row Level Security (RLS) policies
- [ ] Set up Supabase Storage
- [ ] Implement real-time subscriptions
- [ ] Integrate Google OAuth
- [ ] Implement price tracking features
- [ ] Integrate OCR (Tesseract.js)
- [ ] Implement charts/analytics
- [ ] Create PWA manifest and service worker
- [ ] Implement offline capability
- [ ] Add accessibility features
- [ ] Set up notifications
- [ ] Configure deployment pipeline
- [ ] Write comprehensive README

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

---