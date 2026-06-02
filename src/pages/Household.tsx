import React, { useState } from 'react';
import { useStoreContext } from '../store/useStore';
import { formatCurrency } from '../utils/currency';

const Household: React.FC = () => {
  const { user, lists } = useStoreContext();
  const [activeTab, setActiveTab] = useState<'members' | 'invites' | 'settings'>('members');

  const addMember = () => {
    const email = prompt('Enter member email:');
    if (email) {
      console.log('Adding member:', email);
    }
  };

  const inviteByEmail = () => {
    const email = prompt('Enter email to invite:');
    if (email) {
      console.log('Sending invite to:', email);
    }
  };

  const inviteByLink = () => {
    const link = prompt('Enter invite link:');
    if (link) {
      console.log('Sending invite link:', link);
    }
  };

  const handleCreateHousehold = () => {
    const name = prompt('Enter household name:');
    if (name) {
      console.log('Creating household:', name);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Household Settings</h1>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-6">
            <button
              onClick={() => setActiveTab('members')}
              className={`px-4 py-2 border-b-2 transition-colors ${
                activeTab === 'members'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Members
            </button>
            <button
              onClick={() => setActiveTab('invites')}
              className={`px-4 py-2 border-b-2 transition-colors ${
                activeTab === 'invites'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Invites
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-4 py-2 border-b-2 transition-colors ${
                activeTab === 'settings'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Settings
            </button>
          </div>

          {/* Members Tab */}
          {activeTab === 'members' && (
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Household Members</h3>
                <div className="space-y-3">
                  {lists.length > 0 ? (
                    lists.map((list) => (
                      <div key={list.id} className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-gray-800">{list.name}</p>
                            <p className="text-sm text-gray-600">
                            Created {new Date(list.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <button className="px-3 py-1 text-sm text-green-600 hover:bg-green-50 rounded">
                              Edit
                            </button>
                            <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded">
                              Share
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-8">No households yet</p>
                  )}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleCreateHousehold}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  + Create Household
                </button>
              </div>
            </div>
          )}

          {/* Invites Tab */}
          {activeTab === 'invites' && (
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Invite Members</h3>
                <div className="space-y-3">
                  <button
                    onClick={inviteByEmail}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
                  >
                    Invite by Email
                  </button>
                  <button
                    onClick={inviteByLink}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
                  >
                    Send Invite Link
                  </button>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Copy Invite Link</h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value="https://grocerymind.app/join/your-unique-code"
                    readOnly
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                  />
                  <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                    Copy
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Household Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Household Name</label>
                    <input
                      type="text"
                      defaultValue="My Household"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                    <select
                      defaultValue="AZN"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="AZN">AZN (Manat)</option>
                      <option value="USD">USD (Dollar)</option>
                      <option value="EUR">EUR (Euro)</option>
                      <option value="GBP">GBP (Pound)</option>
                      <option value="RUB">RUB (Ruble)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Privacy</h3>
                <div className="space-y-3">
                  <label className="flex items-center justify-between">
                    <span className="text-gray-700">Allow members to add household members</span>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </label>
                  <label className="flex items-center justify-between">
                    <span className="text-gray-700">Require approval for new members</span>
                    <input type="checkbox" className="rounded" />
                  </label>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Notifications</h3>
                <div className="space-y-3">
                  <label className="flex items-center justify-between">
                    <span className="text-gray-700">Email notifications</span>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </label>
                  <label className="flex items-center justify-between">
                    <span className="text-gray-700">Weekly spending summary</span>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Household;