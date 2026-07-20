# GroceryMind

A modern, multi-user grocery list management web application with receipt scanning, price tracking, and spending analytics. Built with React 19, TypeScript, and PostgreSQL.

## Features

### 📋 Grocery Lists
- Create multiple named grocery lists per household
- Add items with quantity, unit, category, and estimated price
- Check off items while shopping with tap-friendly UI
- Track completion progress per list

### 🏠 Households
- Create or join households to share lists with family/roommates
- Invite members via email
- Role-based access (Owner, Admin, Member)

### 📷 Receipt Scanning
- Upload receipt images (JPG, PNG)
- Simulated OCR with review workflow
- Match scanned items to existing list items
- Save purchase prices to price history

### 📊 Price Tracking & Analytics
- Automatic price history tracking per item per store
- Spending charts: by store (bar), by category (pie), over time (line)
- Top items by total spending
- Date range filtering (30/90/180/365 days)
- Recharts-powered interactive visualizations

### 🔍 Search
- Full-text search across items, lists, stores, and purchase history
- Fuzzy matching for typo-tolerant results
- Smart suggestions based on purchase history

## Tech Stack

### Frontend
- **React 19** with TypeScript
- **Tailwind CSS 4** for styling
- **Vite** as build tool
- **Zustand** for state management
- **React Router 7** for routing
- **@tanstack/react-query** for data fetching
- **Recharts** for charts/analytics

### Backend
- **Express.js** REST API on port 3001
- **PostgreSQL** database (self-hosted)
- **bcrypt** for password hashing
- **multer** for file uploads

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm

### 1. Clone and install dependencies

```bash
git clone https://github.com/master-basic/shoplist.git
cd shoplist

# Frontend dependencies
npm install

# Server dependencies
cd server && npm install && cd ..
```

### 2. Set up PostgreSQL

Create a database:

```bash
createdb grocerymind
```

Copy `.env.example` to `.env` and update with your PostgreSQL credentials:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=grocerymind
DB_USER=postgres
DB_PASSWORD=your_password
```

### 3. Run migrations

```bash
psql -d grocerymind -f src/config/migrations/001_initial_schema.sql
psql -d grocerymind -f src/config/migrations/002_fix_price_history_and_grocery_lists.sql
```

Default users (password for both: `admin123`):
- Admin: `admin@grocerymind.com`
- Test user: `user@grocerymind.com`

### 4. Start the application

```bash
# Terminal 1: Start the API server
cd server && npm run dev

# Terminal 2: Start the frontend dev server
cd shoplist && npm run dev
```

Open http://localhost:5173 in your browser.

## Project Structure

```
shoplist/
├── server/                  # Express.js backend
│   ├── index.js            # API routes & server config
│   └── schema.sql          # Database schema
├── src/
│   ├── api/                # API client functions
│   │   ├── auth.ts         # Auth API (login, register, households)
│   │   ├── lists.ts        # List CRUD API
│   │   └── receipts.ts     # Receipt API
│   ├── components/
│   │   ├── ui/             # Reusable UI components (14 components)
│   │   ├── auth/           # Login, Register forms
│   │   ├── layout/         # MainLayout, Sidebar, Header
│   │   ├── GroceryItemCard.tsx
│   │   ├── ListCard.tsx
│   │   ├── AddItemModal.tsx
│   │   ├── ShoppingMode.tsx
│   │   └── CategoryGroup.tsx
│   ├── config/migrations/  # SQL migration files
│   ├── hooks/              # Custom React hooks
│   │   ├── useAuth.tsx
│   │   ├── useHousehold.ts
│   │   ├── useGroceryList.ts
│   │   └── usePriceHistory.ts
│   ├── pages/              # Route pages (20 pages)
│   ├── store/useStore.tsx   # Zustand state management
│   ├── types/index.ts      # TypeScript type definitions
│   └── utils/              # Utility functions
├── PROJECT_PLAN.md         # Detailed project plan & status
├── .env.example            # Environment variables template
└── package.json
```

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login with email + password |
| GET | `/api/auth/user/:id` | Get user by ID |
| GET | `/api/auth/user/:id/households` | Get user's households |
| POST | `/api/auth/households` | Create a household |

### Households
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/households/:id` | Get household details |
| GET | `/api/households/:id/members` | Get household members |
| POST | `/api/households/:id/members` | Add member to household |
| DELETE | `/api/households/:id/members/:userId` | Remove member |
| GET | `/api/households/:id/items` | Get all items in household |

### Lists
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/lists` | Get all lists (optional `householdId`) |
| GET | `/api/lists/my` | Get user's lists with items |
| POST | `/api/lists` | Create a grocery list |
| GET | `/api/lists/:id` | Get list with items |
| PUT | `/api/lists/:id` | Update list |
| DELETE | `/api/lists/:id` | Delete list |
| GET | `/api/lists/:id/items` | Get list items |
| POST | `/api/lists/:id/items` | Add item to list |
| PUT | `/api/lists/:listId/items/:itemId` | Update item |
| DELETE | `/api/lists/:listId/items/:itemId` | Delete item |
| PATCH | `/api/lists/items/:id` | Toggle item completion |
| GET | `/api/lists/:id/stats` | Get list statistics |

### Price History
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/price-history` | Get price history (filterable) |
| POST | `/api/price-history` | Add price history entry |
| GET | `/api/price-history/stats` | Get price statistics |

### Receipts
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/receipts/upload` | Upload receipt image |
| POST | `/api/receipts` | Create receipt |
| GET | `/api/receipts/:id` | Get receipt with items |
| GET | `/api/receipts/user/:userId` | Get user's receipts |
| PUT | `/api/receipts/:id/status` | Update receipt status |
| DELETE | `/api/receipts/:id` | Delete receipt |

### Health
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Database connection health check |

## Implementation Status

| Phase | Status |
|-------|--------|
| Phase 1: Foundation (Auth, DB, UI, Pages) | ✅ Complete |
| Phase 2: Shopping & Interactions | 🔄 In Progress |
| Phase 3: Receipt Scanning & OCR | 🔄 In Progress |
| Phase 4: Price Tracking & Analytics | 🔄 In Progress |
| Phase 5: Advanced Features | ⏳ Pending |
| Phase 6: PWA & Accessibility | ⏳ Pending |
| Phase 7: Notifications | ⏳ Pending |
| Phase 8: Database Optimization | ⏳ Pending |
| Phase 9: Security & Privacy | ⏳ Pending |

See [PROJECT_PLAN.md](PROJECT_PLAN.md) for detailed status.

## License

MIT
