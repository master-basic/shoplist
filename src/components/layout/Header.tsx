// =====================================================
// GroceryMind - Header Component
// =====================================================

import { useState } from 'react';
import { useAuth } from '@hooks/useAuth';
import { useHousehold } from '@hooks/useHousehold';
import { useGroceryList } from '@hooks/useGroceryList';

export function Header() {
  const { user } = useAuth();
  const { currentHouseholdId } = useHousehold();
  const { lists } = useGroceryList();
  const [showNotifications, setShowNotifications] = useState(false);

  // Calculate unread notifications
  const unreadCount = 3; // Placeholder - would come from real notifications

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
      <div className="flex items-center justify-between px-4 py-3 lg:px-6">
        {/* Left section - Mobile menu toggle */}
        <div className="flex items-center gap-4">
          <button
            className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
            onClick={() => {}} // Would toggle sidebar
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <div className="hidden sm:block">
            <h1 className="text-xl font-bold text-slate-900">
              {currentHouseholdId 
                ? 'GroceryMind' 
                : 'Welcome back'}
            </h1>
            <p className="text-sm text-slate-500">
              {user?.name}
            </p>
          </div>
        </div>

        {/* Center section - Search bar (desktop) */}
        <div className="hidden md:flex flex-1 max-w-xl mx-4">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search items, stores, lists..."
              className="w-full px-4 py-2 pl-10 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white"
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg relative"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs flex items-center justify-center rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>

          {/* Currency selector */}
          <select
            defaultValue="AZN"
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="AZN">AZN ₼</option>
            <option value="USD">USD $</option>
            <option value="EUR">EUR €</option>
          </select>

          {/* User avatar */}
          <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold ml-2 cursor-pointer">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
        </div>
      </div>
    </header>
  );
}