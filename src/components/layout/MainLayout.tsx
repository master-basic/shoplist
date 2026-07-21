// =====================================================
// MainLayout Component
// =====================================================

import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

export interface MainLayoutProps {
  isAuthenticated: boolean;
  user?: {
    id: string;
    name: string;
    email: string;
  };
  onLogout?: () => void;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  isAuthenticated,
  user,
  onLogout,
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/lists', label: 'My Lists', icon: '🛒' },
    { path: '/shopping', label: 'Shopping', icon: '📋' },
    { path: '/purchases', label: 'Purchases', icon: '🧾' },
    { path: '/scan', label: 'Scan', icon: '📷' },
    { path: '/reports', label: 'Reports', icon: '📊' },
    { path: '/search', label: 'Search', icon: '🔍' },
    { path: '/profile', label: 'Profile', icon: '👤' },
  ];

  const isActive = (path: string) => location.pathname === path;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
        <Outlet />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-8">
              {/* Logo */}
              <Link to="/" className="flex items-center gap-2">
                <span className="text-2xl">🛒</span>
                <span className="text-xl font-bold text-gray-800">GroceryMind</span>
              </Link>

              {/* Navigation Links */}
              <div className="hidden md:flex items-center gap-1">
                {navItems.map(item => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`
                      flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                      ${isActive(item.path) 
                        ? 'bg-green-50 text-green-700' 
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
                    `}
                  >
                    <span>{item.icon}</span>
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* User Actions */}
            <div className="flex items-center gap-4">
              {user && (
                <div className="hidden sm:flex items-center gap-3">
                  <span className="text-sm text-gray-600">Hello,</span>
                  <Badge variant="primary">{user.name}</Badge>
                </div>
              )}
              <Button
                variant="outline"
                onClick={() => {
                  onLogout?.();
                  navigate('/login');
                }}
                className="gap-2"
              >
                <span>🚪</span>
                Logout
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="flex items-center gap-1 overflow-x-auto px-4 py-2">
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap
                  ${isActive(item.path)
                    ? 'bg-green-50 text-green-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
                `}
              >
                <span>{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
};