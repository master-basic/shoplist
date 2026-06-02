// =====================================================
// GroceryMind - Onboarding Page
// =====================================================

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@store/useStore';
import { Button } from '@components/ui/Button';
import { EmptyState } from '@components/ui/EmptyState';

export const Onboarding: React.FC = () => {
  const [householdName, setHouseholdName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const addHousehold = useStore((state) => state.addHousehold);
  const navigate = useNavigate();
  
  const handleCreateHousehold = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call - replace with actual Supabase call
    setTimeout(() => {
      const newHousehold: any = {
        id: 'demo-household-1',
        name: householdName || 'My Household',
        currency: 'AZN',
        created_by: 'user-1',
        members: [],
        lists: [],
        created_at: new Date().toISOString(),
        settings: {
          invite_code: '',
          invite_link: '',
          default_category: 'produce',
          default_store: '',
          auto_sync: true,
        },
      };
      
      addHousehold(newHousehold);
      navigate('/');
      setIsLoading(false);
    }, 500);
  };
  
  const handleJoinHousehold = () => {
    navigate('/join-household');
  };
  
  const handleDemo = () => {
    // Create demo household
    const demoHousehold: any = {
      id: 'demo-household-1',
      name: 'Demo Household',
      currency: 'AZN',
      created_by: 'user-1',
      members: [],
      lists: [],
      created_at: new Date().toISOString(),
      settings: {
        invite_code: '',
        invite_link: '',
        default_category: 'produce',
        default_store: '',
        auto_sync: true,
      },
    };
    
    addHousehold(demoHousehold);
    navigate('/');
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 px-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Get started</h1>
          <p className="text-gray-600 mt-2">Create or join a household to begin</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="space-y-6">
            <div>
              <label htmlFor="householdName" className="block text-sm font-medium text-gray-700 mb-2">
                Household Name
              </label>
              <input
                id="householdName"
                type="text"
                value={householdName}
                onChange={(e) => setHouseholdName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="e.g., Smith Family, Roommates, Office Pantry"
              />
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              <Button 
                type="button" 
                className="w-full" 
                onClick={handleCreateHousehold} 
                isLoading={isLoading}
              >
                Create new household
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full"
                onClick={handleJoinHousehold}
              >
                Join existing household
              </Button>
              
              <Button 
                variant="ghost" 
                className="w-full"
                onClick={handleDemo}
              >
                Use demo household
              </Button>
            </div>
          </div>
        </div>
        
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">What's next?</h3>
          <ul className="space-y-3 text-gray-600">
            <li className="flex items-start">
              <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Create your first grocery list
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Invite family members or roommates
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Track prices and find the best deals
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Scan receipts with your camera
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};