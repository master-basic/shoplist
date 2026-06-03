import React, { useState } from 'react';
import { useStore } from '@/store/useStore';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';

const ProfilePage: React.FC = () => {
  const { user } = useStore();
  const [editedName, setEditedName] = useState('');
  const [editedEmail, setEditedEmail] = useState('');

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">User Not Found</h1>
          <p className="text-gray-600 mb-6">Please log in to view your profile.</p>
          <Button onClick={() => window.location.href = '/login'}>Log In</Button>
        </Card>
      </div>
    );
  }

  const handleSave = () => {
    // Save user updates (would call API in real app)
    localStorage.setItem('user_name', editedName || user.name);
    localStorage.setItem('user_email', editedEmail || user.email);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Profile</h1>

        {/* User Info */}
        <Card className="p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Account Information</h2>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-blue-600">
                {user.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-600">Member since</p>
              <p className="font-medium text-gray-800">
                {new Date(user.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <Input
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                placeholder={user.name}
                className="mb-2"
              />
              <p className="text-sm text-gray-600">{user.name}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <Input
                type="email"
                value={editedEmail}
                onChange={(e) => setEditedEmail(e.target.value)}
                placeholder={user.email}
                className="mb-2"
              />
              <p className="text-sm text-gray-600">{user.email}</p>
            </div>
          </div>

          <div className="mt-6">
            <Button onClick={handleSave} variant="primary">
              Save Changes
            </Button>
          </div>
        </Card>

        {/* Statistics */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Your Statistics</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-gray-800">12</p>
              <p className="text-sm text-gray-600">Lists Created</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-gray-800">48</p>
              <p className="text-sm text-gray-600">Items Purchased</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-gray-800">$245</p>
              <p className="text-sm text-gray-600">Total Spent</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-gray-800">5</p>
              <p className="text-sm text-gray-600">Favorite Stores</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export { ProfilePage };