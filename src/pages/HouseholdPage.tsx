import React, { useState, useMemo } from 'react';
import { useStore } from '@/store/useStore';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Household, HouseholdMember, HouseholdSettings } from '@/types';

interface HouseholdPageProps {
  householdId?: string;
}

const HouseholdPage: React.FC<HouseholdPageProps> = ({ householdId }) => {
  const { user, households, setCurrentHouseholdId } = useStore();
  const [showInviteModal, setShowInviteModal] = useState(false);

  // Get current household - store doesn't have direct household field, need to derive
  const currentHousehold = useMemo<Household | null>(() => {
    const storedHouseholdId = localStorage.getItem('current_household_id');
    if (!storedHouseholdId) return null;
    return households?.find((h: Household) => h.id === storedHouseholdId) || null;
  }, [households]);

  if (!currentHousehold) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Household Not Found</h1>
          <p className="text-gray-600 mb-6">Please create or join a household to continue.</p>
          <Button onClick={() => window.location.href = '/lists'}>Go to Lists</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Household</h1>
          <Button onClick={() => setShowInviteModal(true)}>Invite Members</Button>
        </div>

        {/* Household Info */}
        <Card className="p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">About This Household</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Household Name</p>
              <p className="font-medium text-gray-800">{currentHousehold.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Currency</p>
              <p className="font-medium text-gray-800">{currentHousehold.currency}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Members</p>
              <p className="font-medium text-gray-800">{currentHousehold.members?.length || 0} members</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Default Category</p>
              <p className="font-medium text-gray-800">{currentHousehold.settings?.default_category || 'Pantry'}</p>
            </div>
          </div>
        </Card>

        {/* Household Members */}
        <Card className="p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Members</h2>
          <div className="space-y-3">
            {currentHousehold.members?.map((member: HouseholdMember) => (
              <div key={member.user_id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-blue-600">
                      {member.user_id.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">
                      {user?.name || 'Guest'} {member.user_id === localStorage.getItem('user_id') && '(You)'}
                    </p>
                    <p className="text-sm text-gray-600 capitalize">{member.role}</p>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  Joined {new Date(member.joined_at).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Household Settings */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Settings</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium text-gray-800">Auto-sync Lists</p>
                <p className="text-sm text-gray-600">Automatically sync lists across devices</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked={currentHousehold.settings?.auto_sync ?? false} />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-800">Invite Link</p>
                  <p className="text-sm text-gray-600">Share this link to invite new members</p>
                </div>
                <Badge variant="secondary">
                  {currentHousehold.settings?.invite_link || 'No invite link'}
                </Badge>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export { HouseholdPage };