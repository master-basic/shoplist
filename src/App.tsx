import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { StoreProvider } from '@/store/useStore';
import { getUserById } from '@/api/auth';

// Pages
import { HomePage } from './pages/HomePage.tsx';
import { Lists } from './pages/Lists.tsx';
import { ListDetail } from './pages/ListDetail.tsx';
import { ShoppingPage } from './pages/ShoppingPage.tsx';
import { ScanPage } from './pages/ScanPage.tsx';
import { ReportsPage } from './pages/ReportsPage.tsx';
import { SearchPage } from './pages/SearchPage.tsx';
import { ProfilePage } from './pages/ProfilePage.tsx';
import { HouseholdPage } from './pages/HouseholdPage.tsx';
import { PurchaseHistoryPage } from './pages/PurchaseHistoryPage.tsx';
import { OnboardingPage } from './pages/OnboardingPage.tsx';
import NotFound from './pages/NotFound.tsx';

// Auth Components
import { Login } from './components/auth/Login';
import { Register } from './components/auth/Register';

// Layouts
import { MainLayout } from './components/layout/MainLayout';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

// Public routes that don't require authentication
const PUBLIC_ROUTES = ['/login', '/register', '/onboarding'];

function App() {
  const location = useLocation();
  
  // Check if current route is a public route
  const isPublicRoute = PUBLIC_ROUTES.some(route => location.pathname === route);
  
  // Initialize auth - MUST be called unconditionally at top level
  const auth = useAuth();
  
  // Use the auth user or localStorage fallback for display
  const user = React.useMemo(() => {
    if (auth.user) {
      return auth.user;
    }
    return {
      id: localStorage.getItem('user_id') || '',
      name: localStorage.getItem('user_name') || 'User',
      email: localStorage.getItem('user_email') || '',
    };
  }, [auth.user]);
  
  const isAuthenticated = !!auth.user;
  
  // Determine which page to render based on route
  const renderPage = () => {
    switch (location.pathname) {
      case '/':
        return <HomePage />;
      case '/lists':
        return <Lists />;
      case '/list/':
        return <ListDetail />;
      case '/shopping':
        return <ShoppingPage />;
      case '/scan':
        return <ScanPage />;
      case '/reports':
        return <ReportsPage />;
      case '/search':
        return <SearchPage />;
      case '/household':
        return <HouseholdPage />;
      case '/profile':
        return <ProfilePage />;
      case '/purchases':
        return <PurchaseHistoryPage />;
      default:
        return <NotFound />;
    }
  };
  
  return (
    <QueryClientProvider client={queryClient}>
      <StoreProvider>
        <Routes>
          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
          
          {/* Main App Routes - only accessible when authenticated */}
          <Route
            path="/"
            element={
              isAuthenticated
                ? <MainLayout isAuthenticated={true} user={user} onLogout={() => localStorage.removeItem('user_id')} />
                : <Navigate to="/login" replace />
            }
          >
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
    </QueryClientProvider>
  );
}

export default App;