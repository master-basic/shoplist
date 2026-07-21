import React, { useState, useEffect } from 'react';
import { Card, Button, Input, EmptyState, SkeletonCard } from '@/components/ui';
import { useStore } from '@/store/useStore';
import { getUsers, createUser, resetPassword, deleteUser } from '@/api/admin';
import { useLogRender } from '@/hooks/useLogRender';

const AdminPage: React.FC = () => {
  useLogRender('AdminPage');
  const { user } = useStore();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newName, setNewName] = useState('');
  const [resetPw, setResetPw] = useState<{ id: string; email: string } | null>(null);
  const [resetValue, setResetValue] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadUsers = async () => {
    try { setUsers(await getUsers()); } catch (e) { setError('Failed to load users'); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadUsers(); }, []);

  const handleCreate = async () => {
    setError(''); setSuccess('');
    if (!newEmail || !newPassword || !newName) { setError('All fields required'); return; }
    try {
      await createUser(newEmail, newPassword, newName);
      setSuccess(`User ${newEmail} created`);
      setShowCreate(false); setNewEmail(''); setNewPassword(''); setNewName('');
      loadUsers();
    } catch (e: any) { setError(e.message); }
  };

  const handleReset = async () => {
    setError(''); setSuccess('');
    if (!resetPw || !resetValue) return;
    try {
      await resetPassword(resetPw.id, resetValue);
      setSuccess(`Password reset for ${resetPw.email}`);
      setResetPw(null); setResetValue('');
    } catch (e: any) { setError(e.message); }
  };

  const handleDelete = async (userId: string, email: string) => {
    setError(''); setSuccess('');
    if (!window.confirm(`Delete user ${email}?`)) return;
    try {
      await deleteUser(userId);
      setSuccess(`User ${email} deleted`);
      loadUsers();
    } catch (e: any) { setError(e.message); }
  };

  if (loading) return <div className="space-y-4"><SkeletonCard /><SkeletonCard /></div>;

  if (!user?.isAdmin) return <EmptyState title="Access Denied" description="Admin access required" icon="🔒" />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">User Management</h1>
        <Button onClick={() => setShowCreate(!showCreate)} className="gap-2"><span>+</span> Create User</Button>
      </div>

      {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>}
      {success && <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">{success}</div>}

      {showCreate && (
        <Card className="p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Create New User</h2>
          <div className="space-y-3 max-w-md">
            <Input label="Name" value={newName} onChange={e => setNewName(e.target.value)} placeholder="John Doe" />
            <Input label="Email" type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)} placeholder="user@example.com" />
            <Input label="Password" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Password" />
            <div className="flex gap-2">
              <Button onClick={handleCreate}>Create</Button>
              <Button variant="secondary" onClick={() => setShowCreate(false)}>Cancel</Button>
            </div>
          </div>
        </Card>
      )}

      {resetPw && (
        <Card className="p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Reset Password for {resetPw.email}</h2>
          <div className="space-y-3 max-w-md">
            <Input label="New Password" type="password" value={resetValue} onChange={e => setResetValue(e.target.value)} placeholder="New password" />
            <div className="flex gap-2">
              <Button onClick={handleReset}>Reset</Button>
              <Button variant="secondary" onClick={() => setResetPw(null)}>Cancel</Button>
            </div>
          </div>
        </Card>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm bg-white rounded-lg shadow-sm">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="text-left p-3 font-medium text-gray-600">Name</th>
              <th className="text-left p-3 font-medium text-gray-600">Email</th>
              <th className="text-left p-3 font-medium text-gray-600">Username</th>
              <th className="text-left p-3 font-medium text-gray-600">Role</th>
              <th className="text-left p-3 font-medium text-gray-600">Created</th>
              <th className="text-right p-3 font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} className="border-b last:border-0 hover:bg-gray-50">
                <td className="p-3 font-medium text-gray-800">{u.name}</td>
                <td className="p-3 text-gray-600">{u.email}</td>
                <td className="p-3 text-gray-600">{u.username}</td>
                <td className="p-3">{u.is_admin ? <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">Admin</span> : <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">User</span>}</td>
                <td className="p-3 text-gray-500">{new Date(u.created_at).toLocaleDateString()}</td>
                <td className="p-3 text-right">
                  <div className="flex gap-2 justify-end">
                    <Button size="sm" variant="secondary" onClick={() => setResetPw({ id: u.id, email: u.email })}>Reset PW</Button>
                    <Button size="sm" variant="danger" onClick={() => handleDelete(u.id, u.email)} disabled={u.id === user.id}>Delete</Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export { AdminPage };
