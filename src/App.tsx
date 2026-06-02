import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { StoreProvider } from '@/store/useStore';
import { getUserById } from '@/api/auth';

// Pages
import { HomePage } from './pages/HomePage';
import { Lists } from './pages/Lists';
import ListDetail from './pages/ListDetail';
import Shopping from './pages/Shopping';
import Scan from './pages/Scan';
import Reports from './pages/Reports';
import Search from './pages/Search';
import Profile from './pages/Profile';
import Household from './pages/Household';
import { Login } from './components/auth/Login';
import { Register } from './components/auth/Register';
import { Onboarding } from './pages/Onboarding';
import NotFound from './pages/NotFound';

// Layouts
import MainLayout from './components/layout/MainLayout';

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
  
  // Load user data on mount if authenticated
  useEffect(() => {
    const auth = useAuth();
    if (auth.isAuthenticated) {
      const loadUser = async () => {
        const userId = localStorage.getItem('user_id');
        if (userId) {
          try {
            const userData = await getUserById(userId);
            if (userData) {
              localStorage.setItem('user_name', userData.name);
              localStorage.setItem('user_email', userData.email);
            }
          } catch (err) {
            console.error('Error loading user:', err);
          }
        }
      };
      loadUser();
    }
  }, []);
  
  return (
    <QueryClientProvider client={queryClient}>
      <StoreProvider>
        <Routes>
            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/onboarding" element={<Onboarding />} />
            
            {/* Main App Routes - only accessible when authenticated */}
            <Route path="/" element={<MainLayout />}>
              <Route index element={<HomePage />} />
              <Route path="lists" element={<Lists />} />
              <Route path="list/:id" element={<ListDetail />} />
              <Route path="shopping" element={<Shopping />} />
              <Route path="scan" element={<Scan />} />
              <Route path="reports" element={<Reports />} />
              <Route path="search" element={<Search />} />
              <Route path="household" element={<Household />} />
              <Route path="profile" element={<Profile />} />
            </Route>
            
            {/* Catch all - redirect to login if not authenticated, otherwise to home */}
            <Route path="*" element={
              !isPublicRoute && !localStorage.getItem('user_id')
                ? <Navigate to="/login" replace /> 
                : <Navigate to="/" replace />
            } />
          </Routes>
      </StoreProvider>
    </QueryClientProvider>
  );
}

export default App;