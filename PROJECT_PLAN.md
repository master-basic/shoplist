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
- **Supabase** for backend (Auth, Database, Storage, Real-time)

### Offline Support
- **IndexedDB** (via idb library)
- **Service Worker** (PWA)
- **React Query caching**

---

## Project Structure

```
grocerymind/
├── .env.example              # Environment variables template
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
│   ├── lib/                 # Utility functions and Supabase client
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
- [ ] Real-time sync across household members (Supabase real-time)
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
- [ ] Receipt image storage in Supabase
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

### Phase 8: Database & Supabase
**Status: PENDING**

- [ ] Create all Supabase tables
- [ ] Configure Row Level Security (RLS) policies
- [ ] Set up Supabase Storage for receipts
- [ ] Configure real-time subscriptions
- [ ] Set up functions for OCR processing
- [ ] Create database triggers for price history

---

### Phase 9: Security & Privacy
**Status: PENDING**

- [ ] GDPR compliance (data export/delete)
- [ ] Data encryption at rest and in transit
- [ ] Rate limiting on API calls
- [ ] Session management
- [ ] Password reset flow
- [ ] Google OAuth integration

---

## Database Schema (Supabase)

### Core Tables

```sql
-- Users table (extends Supabase auth.users)
create table users (
  id uuid references auth.users primary key,
  name text,
  email text,
  avatar text,
  preferred_currency text default 'AZN',
  notifications_enabled boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Households
create table households (
  id uuid primary key,
  name text not null,
  currency text default 'AZN',
  created_by uuid references users(id),
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Household members
create table household_members (
  id uuid primary key,
  household_id uuid references households(id),
  user_id uuid references users(id),
  role text check (role in ('owner', 'admin', 'member')),
  joined_at timestamp with time zone default timezone('utc'::text, now()),
  unique(household_id, user_id)
);

-- Grocery lists
create table grocery_lists (
  id uuid primary key,
  household_id uuid references households(id),
  name text not null,
  created_by uuid references users(id),
  created_at timestamp with time zone default timezone('utc'::text, now()),
  status text check (status in ('active', 'completed', 'archived')) default 'active',
  budget numeric
);

-- List items
create table list_items (
  id uuid primary key,
  list_id uuid references grocery_lists(id),
  name text not null,
  category text,
  quantity numeric default 1,
  unit text,
  estimated_price numeric,
  assigned_to uuid[],
  notes text,
  sort_order integer default 0,
  is_recurring boolean default false,
  checked boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Purchase sessions
create table purchase_sessions (
  id uuid primary key,
  list_id uuid references grocery_lists(id),
  bought_by uuid references users(id),
  store_name text,
  purchase_date timestamp with time zone,
  receipt_image_url text,
  total_paid numeric,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Purchased items
create table purchased_items (
  id uuid primary key,
  session_id uuid references purchase_sessions(id),
  list_item_id uuid references list_items(id),
  name text,
  quantity numeric,
  unit_price numeric,
  total_price numeric,
  is_on_list boolean default false,
  ocr_raw_text text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Price history
create table price_history (
  id uuid primary key,
  item_name text not null,
  store_name text,
  unit_price numeric not null,
  purchased_at timestamp with time zone,
  session_id uuid references purchase_sessions(id),
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Notifications
create table notifications (
  id uuid primary key,
  user_id uuid references users(id),
  title text,
  message text,
  is_read boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now())
);
```

---

## Key Features

### User System
- Sign up / login via email+password and Google OAuth
- Password reset flow
- Session management with JWT tokens
- User profiles with display name, avatar, preferred currency
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
- [ ] Supabase RLS policies configured
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
- **Supabase Client** for database operations

### Data Flow
1. User action triggers hook function
2. Hook performs Supabase API call
3. State update via Zustand
4. React components re-render
5. Real-time listeners for live updates

### Security Model
- Supabase RLS enforces household data isolation
- JWT tokens for authenticated requests
- Row-level policies check household membership
- Storage buckets with private access

---

## Environment Variables

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id
```

---

## Deployment

- **Frontend**: Vercel
- **Backend**: Supabase
- **CI/CD**: Vercel auto-deploy from Git

### Pre-deployment Steps
1. Create Supabase project
2. Run SQL schema migrations
3. Set up RLS policies
4. Configure Storage buckets
5. Set environment variables in Vercel
6. Deploy to Vercel
7. Test all features
8. Configure custom domain (optional)