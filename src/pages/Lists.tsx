// =====================================================
// GroceryMind - Lists Page
// =====================================================

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';

export const Lists: React.FC = () => {
  const { currentHouseholdId, households } = useStore();
  const { lists, addList, deleteList } = useStore();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [filter, setFilter] = useState<'all' | 'active' | 'completed' | 'archived'>('all');
  
  // Filter lists
  const filteredLists = lists.filter((list: any) => {
    if (filter === 'all') return true;
    return list.status === filter;
  });
  
  const handleNewList = () => {
    navigate('/lists/create');
  };
  
  const handleDuplicateList = (list: any) => {
    const duplicatedList = {
      ...list,
      id: `list-${Date.now()}`,
      name: `${list.name} (Copy)`,
      status: 'active',
      items: [],
      createdAt: new Date().toISOString(),
    };
    
    addList(duplicatedList);
    navigate(`/lists/${duplicatedList.id}`);
  };
  
  const handleArchiveList = (listId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const list = lists.find((l) => l.id === listId);
    if (list) {
      useStore.getState().archiveList(listId);
    }
  };
  
  const handleJoinHousehold = () => {
    navigate('/join-household');
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Grocery Lists</h1>
              <p className="text-sm text-gray-500">
                {currentHouseholdId ? households.find((h: any) => h.id === currentHouseholdId)?.name : 'Select a household'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={handleJoinHousehold} className="hidden sm:block">
                Join Household
              </Button>
              <Button onClick={handleNewList} className="bg-green-600 hover:bg-green-700">
                + New List
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Filter Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-4">
            {(['all', 'active', 'completed', 'archived'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  filter === f
                    ? 'border-green-600 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
                {f !== 'all' && lists.filter((l: any) => l.status === f).length > 0 && (
                  <span className="ml-2 bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                    {lists.filter((l: any) => l.status === f).length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Lists Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {filteredLists.length === 0 ? (
          <EmptyState
            title="No lists found"
            description={filter === 'all' ? 'Create your first grocery list' : `No ${filter} lists`}
            icon={<svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>}
            actionLabel="Create List"
            onAction={filter === 'all' ? handleNewList : undefined}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredLists.map((list: any) => (
              <div key={list.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1 cursor-pointer" onClick={() => navigate(`/lists/${list.id}`)}>
                    <h3 className="font-medium text-gray-800 hover:text-green-600 transition-colors">
                      {list.name}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {list.items.filter((i: any) => i.isChecked).length} / {list.items.length} items
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(list.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      list.status === 'active' ? 'bg-green-100 text-green-700' :
                      list.status === 'completed' ? 'bg-green-100 text-green-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {list.status}
                    </span>
                    <button
                      onClick={() => handleDuplicateList(list)}
                      className="p-1 hover:bg-gray-100 rounded"
                      title="Duplicate"
                    >
                      <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                    <button
                      onClick={(e) => handleArchiveList(list.id, e)}
                      className="p-1 hover:bg-gray-100 rounded"
                      title="Archive"
                    >
                      <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};