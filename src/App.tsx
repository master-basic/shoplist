import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useWebSocket } from '@/hooks/useWebSocket';
import { StoreProvider, useStore } from '@/store/useStore';
import log from '@/utils/debug';

// Pages
import { HomePage } from './pages/HomePage.tsx';
import { Lists } from './pages/Lists.tsx';
import { ListDetail } from './pages/ListDetail.tsx';
import { ShoppingPage } from './pages/ShoppingPage.tsx';
import { ScanPage } from './pages/ScanPage.tsx';
import { ReportsPage } from './pages/ReportsPage.tsx';
import { ProfilePage } from './pages/ProfilePage.tsx';
import { HouseholdPage } from './pages/HouseholdPage.tsx';
import { AdminPage } from './pages/AdminPage.tsx';
import { PriceCheckPage } from './pages/PriceCheckPage.tsx';
import { DashboardPage } from './pages/DashboardPage.tsx';
import { ItemPriceHistory } from './pages/ItemPriceHistory.tsx';
import { SearchPage } from './pages/SearchPage.tsx';
import NotFound from './pages/NotFound.tsx';

// Auth Components
import { Login } from './components/auth/Login';
import { Register } from './components/auth/Register';

// Layouts
import { MainLayout } from './components/layout/MainLayout';

// Public routes that don't require authentication
const PUBLIC_ROUTES = ['/login', '/register', '/onboarding'];

function WebSocketConnector() {
  useWebSocket();
  return null;
}

function App() {
  const location = useLocation();
  log.info('App rendered', { path: location.pathname });
  
  // Check if current route is a public route
  const isPublicRoute = PUBLIC_ROUTES.some(route => location.pathname === route);
  
  // Initialize auth - MUST be called unconditionally at top level
  const auth = useAuth();
  
  log.info('Auth state', { isAuthenticated: auth.isAuthenticated, user: auth.user?.id, loading: auth.isLoading, error: auth.error });
  
  // Use the auth user or localStorage fallback for display
  const user = React.useMemo(() => {
    if (auth.user) {
      log.info('Using auth user', { id: auth.user.id, name: auth.user.name });
      return auth.user;
    }
    const fallbackId = localStorage.getItem('user_id');
    log.info('Using localStorage fallback', { id: fallbackId });
    return {
      id: fallbackId || '',
      name: localStorage.getItem('user_name') || 'User',
      email: localStorage.getItem('user_email') || '',
    };
  }, [auth.user]);
  
  const isAuthenticated = !!auth.user || !!localStorage.getItem('user_id');
  log.info('isAuthenticated', { value: isAuthenticated });

  // Sync user to Zustand store
  useEffect(() => {
    if (auth.user) {
      useStore.getState().setUser(auth.user);
    } else if (localStorage.getItem('user_id')) {
      useStore.getState().setUser({
        id: localStorage.getItem('user_id') || '',
        name: localStorage.getItem('user_name') || '',
        email: localStorage.getItem('user_email') || '',
        isAdmin: false,
        created_at: '',
        preferred_currency: '',
        notification_preferences: { push_notifications: false, price_change_alerts: false, weekly_summary: false, list_updates: false, reminders: false },
        households: [],
      });
    }
  }, [auth.user]);

  // Determine which page to render based on route
  const renderPage = () => {
    const path = location.pathname;
    if (path.startsWith('/list/') && path.length > 6) {
      return <ListDetail />;
    }
    switch (path) {
      case '/':
        return <HomePage />;
      case '/lists':
      case '/search':
        return <Lists />;
      case '/list/':
        return <ListDetail />;
      case '/shopping':
        return <ShoppingPage />;
      case '/scan':
        return <ScanPage />;
      case '/reports':
        return <ReportsPage />;
      case '/household':
        return <HouseholdPage />;
      case '/profile':
        return <ProfilePage />;
      case '/admin':
        return <AdminPage />;
      case '/purchases':
        return <ReportsPage />;
      case '/price-check':
        return <PriceCheckPage />;
      case '/dashboard':
        return <DashboardPage />;
      case '/price-history':
        return <ItemPriceHistory />;
      case '/global-search':
        return <SearchPage />;
      default:
        return <NotFound />;
    }
  };
  
  return (
    <>
      <WebSocketConnector />
      <StoreProvider>
        <Routes>
          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/onboarding" element={<Register />} />
          
          {/* Main App Routes - only accessible when authenticated */}
          <Route
            path="/"
            element={
              isAuthenticated
                ? <MainLayout isAuthenticated={true} user={user} onLogout={() => localStorage.removeItem('user_id')} />
                : <Navigate to="/login" replace />
            }
          >
            <Route path="/list/:id" element={<ListDetail />} />
            <Route path="*" element={renderPage()} />
          </Route>
          
          {/* Catch all - redirect to login if not authenticated, otherwise to home */}
          <Route path="*" element={
            !isPublicRoute && !isAuthenticated
              ? <Navigate to="/login" replace /> 
              : <Navigate to="/" replace />
          } />
        </Routes>
      </StoreProvider>
    </>
  );
}

export default App;