import React, { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { useHousehold } from '@/hooks/useHousehold';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { SkeletonCard } from '@/components/ui/Skeleton';
import { Skeleton } from '@/components/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import type { Household, HouseholdMember } from '@/types';
import { useLogRender } from '@/hooks/useLogRender';

const HouseholdPage: React.FC = () => {
  useLogRender('HouseholdPage');
  const { user, currentHouseholdId, setCurrentHouseholdId } = useStore();
  const { loading, households, loadUserHouseholds, createHousehold, getMembers, fetchMembers, inviteMember, removeMember } = useHousehold();
  const [members, setMembers] = useState<HouseholdMember[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [newHouseholdName, setNewHouseholdName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [membersLoading, setMembersLoading] = useState(false);

  const currentHousehold = households.find((h: Household) => h.id === currentHouseholdId);

  useEffect(() => {
    const loadData = async () => {
      if (!user?.id) return;
      await loadUserHouseholds();
    };
    loadData();
  }, [user?.id]);

  useEffect(() => {
    const loadMembers = async () => {
      if (!currentHouseholdId) { setMembers([]); return; }
      setMembersLoading(true);
      try {
        const m = await fetchMembers(currentHouseholdId);
        setMembers(m);
      } catch (err) {
        console.error('Error loading members:', err);
      } finally {
        setMembersLoading(false);
      }
    };
    loadMembers();
  }, [currentHouseholdId]);

  const handleCreateHousehold = async () => {
    if (!newHouseholdName.trim()) return;
    try {
      const household = await createHousehold(newHouseholdName.trim());
      setCurrentHouseholdId(household.id);
      setNewHouseholdName('');
      setShowCreateModal(false);
    } catch (err) {
      console.error('Error creating household:', err);
    }
  };

  const handleInvite = async () => {
    if (!currentHouseholdId || !inviteEmail.trim()) return;
    try {
      await inviteMember(currentHouseholdId, inviteEmail.trim());
      setInviteEmail('');
      setShowInviteModal(false);
      const m = await fetchMembers(currentHouseholdId);
      setMembers(m);
    } catch (err) {
      console.error('Error inviting member:', err);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!currentHouseholdId) return;
    if (confirm('Remove this member from the household?')) {
      try {
        await removeMember(currentHouseholdId, memberId);
        setMembers(members.filter((m) => m.user_id !== memberId));
      } catch (err) {
        console.error('Error removing member:', err);
      }
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Please Log In</h1>
          <p className="text-gray-600 mb-6">You need to be logged in to manage your household.</p>
          <Button onClick={() => window.location.href = '/login'}>Log In</Button>
        </Card>
      </div>
    );
  }

  if (loading) {
    return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"><SkeletonCard /><SkeletonCard /></div>;
  }

  if (!currentHouseholdId || !currentHousehold) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Household</h1>
          <EmptyState
            title="No Household Selected"
            description="Create or join a household to share lists with family and friends"
            icon="🏠"
            actionLabel="Create Household"
            onAction={() => setShowCreateModal(true)}
          />

          {households.length > 0 && (
            <Card className="p-6 mt-6">
              <h2 className="text-lg font-semibold mb-4">Your Households</h2>
              <div className="space-y-3">
                {households.map((h: Household) => (
                  <div key={h.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-800">{h.name}</p>
                      <p className="text-sm text-gray-600">{h.description || 'No description'}</p>
                    </div>
                    <Button size="sm" variant="primary" onClick={() => setCurrentHouseholdId(h.id)}>
                      Select
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {showCreateModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <Card className="w-full max-w-md mx-4 p-6">
                <h3 className="text-lg font-semibold mb-4">Create Household</h3>
                <Input
                  label="Household Name"
                  value={newHouseholdName}
                  onChange={(e) => setNewHouseholdName(e.target.value)}
                  placeholder="e.g., My Family"
                  autoFocus
                />
                <div className="flex gap-2 mt-4">
                  <Button onClick={handleCreateHousehold} className="flex-1">Create</Button>
                  <Button variant="secondary" onClick={() => setShowCreateModal(false)} className="flex-1">Cancel</Button>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Household</h1>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setShowInviteModal(true)}>Invite Members</Button>
            <Button variant="secondary" onClick={() => setCurrentHouseholdId(null)}>Switch Household</Button>
          </div>
        </div>

        <Card className="p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Household Info</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Name</p>
              <p className="font-medium text-gray-800">{currentHousehold.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Currency</p>
              <p className="font-medium text-gray-800">{currentHousehold.currency}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Members</p>
              <p className="font-medium text-gray-800">{members.length} member{members.length !== 1 ? 's' : ''}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Lists</p>
              <p className="font-medium text-gray-800">
                {useStore.getState().lists.filter((l) => l.household_id === currentHouseholdId).length} list(s)
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Members</h2>
          {membersLoading ? (
            <div className="flex justify-center py-4"><Skeleton className="h-8 w-8" /></div>
          ) : members.length === 0 ? (
            <p className="text-gray-500">No members found.</p>
          ) : (
            <div className="space-y-3">
              {members.map((member) => (
                <div key={member.user_id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-green-600">
                        {member.name?.charAt(0)?.toUpperCase() || member.email?.charAt(0)?.toUpperCase() || '?'}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">
                        {member.name || member.email || 'Unknown'}
                        {member.user_id === user.id && ' (You)'}
                      </p>
                      <p className="text-sm text-gray-600 capitalize">{member.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={member.role === 'owner' ? 'primary' : 'secondary'}>{member.role}</Badge>
                    {member.user_id !== user.id && (
                      <button
                        onClick={() => handleRemoveMember(member.user_id)}
                        className="text-sm text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {showInviteModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md mx-4 p-6">
              <h3 className="text-lg font-semibold mb-4">Invite Member</h3>
              <Input
                label="Email Address"
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="member@example.com"
                autoFocus
              />
              <div className="flex gap-2 mt-4">
                <Button onClick={handleInvite} className="flex-1">Send Invite</Button>
                <Button variant="secondary" onClick={() => setShowInviteModal(false)} className="flex-1">Cancel</Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export { HouseholdPage };
