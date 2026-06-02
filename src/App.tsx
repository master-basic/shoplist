import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/hooks/useAuth';
import { StoreProvider } from '@/store/useStore';

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

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <StoreProvider>
        <AuthProvider>
          <Routes>
              {/* Auth Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/onboarding" element={<Onboarding />} />
              
              {/* Main App Routes */}
              <Route path="/" element={<MainLayout children={<Navigate to="/lists" replace />} />}>
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
              
              
              {/* Catch all */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </AuthProvider>
      </StoreProvider>
    </QueryClientProvider>
  );
}

export default App;