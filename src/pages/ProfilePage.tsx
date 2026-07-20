import React, { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { useHousehold } from '@/hooks/useHousehold';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Spinner } from '@/components/ui/Spinner';
import { getUserLists } from '@/api/lists';

const ProfilePage: React.FC = () => {
  const { user, setUser } = useStore();
  const { households, loadUserHouseholds } = useHousehold();
  const [editedName, setEditedName] = useState('');
  const [editedEmail, setEditedEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ lists: 0, items: 0, completed: 0 });

  useEffect(() => {
    const loadData = async () => {
      if (!user?.id) { setLoading(false); return; }
      try {
        setEditedName(user.name);
        setEditedEmail(user.email);
        await loadUserHouseholds();
        const lists = await getUserLists(user.id);
        const totalItems = lists.reduce((sum: number, l: any) => sum + (l.items?.length || 0), 0);
        const completedItems = lists.reduce((sum: number, l: any) => sum + (l.items?.filter((i: any) => i.is_checked).length || 0), 0);
        setStats({ lists: lists.length, items: totalItems, completed: completedItems });
      } catch (err) {
        console.error('Error loading profile data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [user?.id]);

  const handleSave = () => {
    if (user) {
      setUser({ ...user, name: editedName || user.name, email: editedEmail || user.email });
    }
  };

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

  if (loading) {
    return <div className="flex justify-center py-12"><Spinner /></div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Profile</h1>

        <Card className="p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Account Information</h2>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-green-600">
                {user.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="font-medium text-gray-800">{user.name}</p>
              <p className="text-sm text-gray-600">{user.email}</p>
              <p className="text-sm text-gray-500">Member since {new Date(user.created_at).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="space-y-4">
            <Input label="Name" value={editedName} onChange={(e) => setEditedName(e.target.value)} placeholder={user.name} />
            <Input label="Email" type="email" value={editedEmail} onChange={(e) => setEditedEmail(e.target.value)} placeholder={user.email} />
          </div>

          <div className="mt-6">
            <Button onClick={handleSave} variant="primary">Save Changes</Button>
          </div>
        </Card>

        <Card className="p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Your Statistics</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-gray-800">{stats.lists}</p>
              <p className="text-sm text-gray-600">Lists Created</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-gray-800">{stats.items}</p>
              <p className="text-sm text-gray-600">Total Items</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-gray-800">{stats.completed}</p>
              <p className="text-sm text-gray-600">Items Completed</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Households</h2>
          {households.length === 0 ? (
            <p className="text-gray-500">No households yet. Create or join one from the Household page.</p>
          ) : (
            <div className="space-y-3">
              {households.map((h) => (
                <div key={h.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">{h.name}</p>
                    <p className="text-sm text-gray-600">{h.description || 'No description'}</p>
                  </div>
                  <Button size="sm" variant="secondary" onClick={() => window.location.href = '/household'}>Manage</Button>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export { ProfilePage };
