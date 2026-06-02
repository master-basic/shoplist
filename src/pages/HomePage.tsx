// =====================================================
// GroceryMind - Home Page (Dashboard)
// =====================================================

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@store/useStore';
import { useAuth } from '@hooks/useAuth';
import { formatCurrency } from '@utils/formatCurrency';
import { Button } from '@components/ui/Button';
import { Card } from '@components/ui/Card';
import { Badge } from '@components/ui/Badge';
import { EmptyState } from '@components/ui/EmptyState';

export const HomePage: React.FC = () => {
  const { user } = useAuth();
  const { currentHouseholdId, lists, setCurrentHouseholdId } = useStore();
  const navigate = useNavigate();
  
  const activeList = lists.find(l => l.status === 'active');
  
  // Calculate stats
  const totalItems = lists.reduce((sum, list) => sum + list.items.length, 0);
  const checkedItems = lists.reduce((sum, list) => sum + list.items.filter((i: any) => i.checked_by).length, 0);
  const progress = totalItems > 0 ? Math.round((checkedItems / totalItems) * 100) : 0;
  
  const totalSpent = lists.reduce((sum, list) => {
    return sum + list.items.filter((i: any) => i.checked_by).reduce((itemSum, item: any) => itemSum + (item.estimated_price || 0), 0);
  }, 0);
  
  const handleCreateList = () => {
    navigate('/lists/new');
  };
  
  const handleStartShopping = () => {
    if (activeList) {
      navigate(`/shopping/${activeList.id}`);
    }
  };
  
  const handleJoinHousehold = () => {
    navigate('/join-household');
  };
  
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <EmptyState
          title="Please sign in"
          description="Redirecting to login..."
          icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14" /></svg>}
        />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                GroceryMind
              </h1>
              <p className="text-sm text-gray-500">
                Your household grocery tracker
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={() => navigate('/lists')}>
                All Lists
              </Button>
              <Button onClick={handleCreateList} className="bg-green-600 hover:bg-green-700">
                + New List
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Items</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{totalItems}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Checked</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{checkedItems} / {totalItems}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Spent</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{formatCurrency(totalSpent)}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Progress</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{progress}%</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
        </Card>
      </div>
      
      {/* Progress Bar */}
      {totalItems > 0 && (
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeList ? (
          <div className="space-y-6">
            {/* Active List Card */}
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">{activeList.name}</h2>
                  <p className="text-sm text-gray-500">
                    {activeList.status === 'active' ? 'Active list' : activeList.status}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="success">
                    {activeList.items.filter((i: any) => !i.checked_by).length} items
                  </Badge>
                  <Button onClick={handleStartShopping}>
                    Start Shopping
                  </Button>
                </div>
              </div>
            </Card>
            
            {/* Recent Lists */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Lists</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {lists.slice(0, 3).map((list) => (
                  <div key={list.id} className="bg-white border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-800">{list.name}</h4>
                    <p className="text-sm text-gray-500 mt-1">
                      {list.items.filter((i: any) => i.checked_by).length} / {list.items.length} items
                    </p>
                    <span className={`mt-2 inline-block px-2 py-1 text-xs rounded-full ${
                      list.status === 'active' ? 'bg-green-100 text-green-700' :
                      list.status === 'completed' ? 'bg-green-100 text-green-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {list.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <EmptyState
            title="No active list"
            description="Create a new grocery list to get started"
            icon={<svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>}
            actionLabel="Create List"
            onAction={handleCreateList}
          />
        )}
      </main>
    </div>
  );
};