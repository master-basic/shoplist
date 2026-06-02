import React, { useState } from 'react';
import { useStore } from '@store/useStore';
import { formatCurrency } from '@utils/formatCurrency';

const Profile: React.FC = () => {
  const { user, households } = useStore((state) => ({ user: state.user, households: state.households }));
  const [activeTab, setActiveTab] = useState<'profile' | 'preferences' | 'households'>('profile');
  const [displayName, setDisplayName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [preferredCurrency, setPreferredCurrency] = useState<'AZN' | 'USD' | 'EUR' | 'GBP' | 'RUB'>('AZN');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const handleSaveProfile = () => {
    console.log('Saving profile:', { displayName, email, preferredCurrency, notificationsEnabled, darkMode });
    alert('Profile saved!');
  };

  const handleDeleteAccount = () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      console.log('Account deleted');
      alert('Account deleted!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Profile</h1>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-6">
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-4 py-2 border-b-2 transition-colors ${
                activeTab === 'profile'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Profile
            </button>
            <button
              onClick={() => setActiveTab('preferences')}
              className={`px-4 py-2 border-b-2 transition-colors ${
                activeTab === 'preferences'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Preferences
            </button>
            <button
              onClick={() => setActiveTab('households')}
              className={`px-4 py-2 border-b-2 transition-colors ${
                activeTab === 'households'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Households
            </button>
          </div>

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              {/* Avatar */}
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-3xl">👤</span>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">{displayName}</h2>
                  <p className="text-gray-600">{email}</p>
                  <p className="text-sm text-gray-500">Member since {new Date().toLocaleDateString()}</p>
                </div>
              </div>

              {/* Personal Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Account Actions */}
              <div className="space-y-3">
                <button
                  onClick={handleSaveProfile}
                  className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Save Changes
                </button>
                <button
                  onClick={handleDeleteAccount}
                  className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Delete Account
                </button>
              </div>
            </div>
          )}

          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <div className="space-y-6">
              {/* App Preferences */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">App Preferences</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Currency</label>
                    <select
                      value={preferredCurrency}
                      onChange={(e) => setPreferredCurrency(e.target.value as any)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="AZN">AZN (Manat)</option>
                      <option value="USD">USD (Dollar)</option>
                      <option value="EUR">EUR (Euro)</option>
                      <option value="GBP">GBP (Pound)</option>
                      <option value="RUB">RUB (Ruble)</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-800">Dark Mode</p>
                      <p className="text-sm text-gray-600">Use dark theme for the app</p>
                    </div>
                    <button
                      onClick={() => setDarkMode(!darkMode)}
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        darkMode ? 'bg-green-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                          darkMode ? 'left-7' : 'left-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Notification Preferences */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Notifications</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-800">Push Notifications</p>
                      <p className="text-sm text-gray-600">Receive notifications for list updates and price changes</p>
                    </div>
                    <button
                      onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        notificationsEnabled ? 'bg-green-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                          notificationsEnabled ? 'left-7' : 'left-1'
                        }`}
                      />
                    </button>
                  </div>
                  {notificationsEnabled && (
                    <div className="pl-4 border-l-2 border-gray-200 space-y-2">
                      <label className="flex items-center gap-2">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <span className="text-sm text-gray-700">Price change alerts</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <span className="text-sm text-gray-700">List update notifications</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" className="rounded" />
                        <span className="text-sm text-gray-700">Weekly spending summary</span>
                      </label>
                    </div>
                  )}
                </div>
              </div>

              {/* Data Management */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Data Management</h3>
                <div className="space-y-3">
                  <button className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 text-left">
                    Export all data
                  </button>
                  <button className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 text-left">
                    Clear cache
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Households Tab */}
          {activeTab === 'households' && (
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">My Households</h3>
                <div className="space-y-3">
                  {households.length > 0 ? (
                    households.map((household) => (
                      <div key={household.id} className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-gray-800">{household.name}</p>
                            <p className="text-sm text-gray-600">
                              Created {new Date(household.created_at).toLocaleDateString()}
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

              <button className="w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:bg-gray-50">
                + Create New Household
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;