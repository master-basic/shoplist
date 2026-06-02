// =====================================================
// GroceryMind - Dashboard Page
// =====================================================

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '@store/useStore';
import { useAuth } from '@hooks/useAuth';
import { useHousehold } from '@hooks/useHousehold';
import { Button } from '@components/ui/Button';
import { EmptyState } from '@components/ui/EmptyState';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { currentHouseholdId, households } = useHousehold();
  const { lists } = useStore();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState<'overview' | 'lists' | 'recent'>('overview');
  
  // Get active lists
  const activeLists = lists.filter(l => l.status === 'active');
  const completedLists = lists.filter(l => l.status === 'completed');
  const archivedLists = lists.filter(l => l.status === 'archived');
  
  // Calculate spending
  const totalSpending = activeLists.reduce((sum, list) => {
    const listTotal = list.items
      .filter(i => i.checked_by)
      .reduce((itemSum, item) => itemSum + (item.estimated_price || 0), 0);
    return sum + listTotal;
  }, 0);
  
  const totalItems = lists.reduce((count, list) => count + list.items.length, 0);
  const checkedItems = lists.reduce((count, list) => {
    return count + list.items.filter(i => i.checked_by).length;
  }, 0);
  
  const progress = totalItems > 0 ? Math.round((checkedItems / totalItems) * 100) : 0;
  
  const handleNewList = () => {
    navigate('/lists/create');
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {currentHouseholdId ? households.find(h => h.id === currentHouseholdId)?.name : 'GroceryMind'}
              </h1>
              <p className="text-sm text-gray-500">Welcome back, {user?.name}</p>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/scan" className="p-2 bg-green-100 rounded-lg hover:bg-green-200 transition-colors">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </Link>
              <Button variant="outline" onClick={() => navigate('/settings')}>
                Settings
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-sm p-6">
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
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6">
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
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Spent</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{totalSpending.toFixed(2)} AZN</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6">
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
          </div>
        </div>
        
        {/* Progress Bar */}
        {totalItems > 0 && (
          <div className="mt-6 bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Shopping Progress</span>
              <span className="text-sm text-gray-500">{progress}% complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="flex border-b border-gray-200">
            <button
              className={`px-6 py-4 text-sm font-medium ${
                activeTab === 'overview'
                  ? 'text-green-600 border-b-2 border-green-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button
              className={`px-6 py-4 text-sm font-medium ${
                activeTab === 'lists'
                  ? 'text-green-600 border-b-2 border-green-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('lists')}
            >
              All Lists
            </button>
            <button
              className={`px-6 py-4 text-sm font-medium ${
                activeTab === 'recent'
                  ? 'text-green-600 border-b-2 border-green-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('recent')}
            >
              Recent Activity
            </button>
          </div>
          
          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Active Lists */}
                {activeLists.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-semibold text-gray-800">Active Lists</h2>
                      <Button size="sm" onClick={handleNewList}>+ New List</Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {activeLists.map((list) => (
                        <Link key={list.id} to={`/lists/${list.id}`} className="block">
                          <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h3 className="font-medium text-gray-800">{list.name}</h3>
                                <p className="text-sm text-gray-500 mt-1">
                                  {list.items.filter(i => i.checked_by).length} / {list.items.length} items
                                </p>
                              </div>
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                list.items.filter(i => i.checked_by).length === list.items.length
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-yellow-100 text-yellow-700'
                              }`}>
                            {list.items.filter(i => i.checked_by).length === list.items.length
                                  ? 'Completed'
                                  : 'In Progress'}
                              </span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Completed Lists */}
                {completedLists.length > 0 && (
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Completed Lists</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {completedLists.slice(0, 3).map((list) => (
                        <Link key={list.id} to={`/lists/${list.id}`} className="block">
                          <div className="bg-white border border-gray-200 rounded-lg p-4 opacity-75 hover:opacity-100 transition-opacity">
                            <h3 className="font-medium text-gray-800">{list.name}</h3>
                            <p className="text-sm text-gray-500 mt-1">Completed</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Empty State */}
                {activeLists.length === 0 && completedLists.length === 0 && (
                  <EmptyState
                    title="No lists yet"
                    description="Create your first grocery list to get started"
                    action={
                      <Button onClick={handleNewList}>
                        Create your first list
                      </Button>
                    }
                  />
                )}
              </div>
            )}
            
            {activeTab === 'lists' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-800">All Lists</h2>
                </div>
                {lists.length === 0 ? (
                  <EmptyState
                    title="No lists yet"
                    description="Create your first grocery list"
                    action={
                      <Button onClick={handleNewList}>
                        Create list
                      </Button>
                    }
                  />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {lists.map((list) => (
                      <Link key={list.id} to={`/lists/${list.id}`} className="block">
                        <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                          <h3 className="font-medium text-gray-800">{list.name}</h3>
                          <p className="text-sm text-gray-500 mt-1">
                            {list.items.filter(i => i.checked_by).length} / {list.items.length} items
                          </p>
                          <span className={`mt-2 inline-block px-2 py-1 text-xs rounded-full ${
                            list.status === 'active' ? 'bg-green-100 text-green-700' :
                            list.status === 'completed' ? 'bg-green-100 text-green-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {list.status}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'recent' && (
              <EmptyState
                title="No recent activity"
                description="Your shopping activity will appear here"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};