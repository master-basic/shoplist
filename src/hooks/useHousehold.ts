import { useState, useCallback } from 'react';
import { useStore } from '@/store/useStore';
import { getUserHouseholds, createHousehold as apiCreateHousehold, addUserToHousehold, removeUserFromHousehold, getHouseholdMembers } from '@/api/auth';
import type { Household, HouseholdMember } from '@/types';

const API_BASE = 'http://localhost:3001';

function mapApiHousehold(h: any): Household {
  return {
    id: h.id,
    name: h.name,
    currency: 'AZN',
    description: h.description || '',
    created_by: h.created_by,
    created_at: h.created_at,
    members: [],
    lists: [],
    settings: {
      invite_code: '',
      invite_link: '',
      default_category: 'Other',
      default_store: '',
      auto_sync: true,
    },
  };
}

export const useHousehold = () => {
  const { user, currentHouseholdId, setCurrentHouseholdId, households, addHousehold, updateHousehold } = useStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCurrentHousehold = useCallback(async () => {
    if (!currentHouseholdId) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/api/households/${currentHouseholdId}`);
      if (!response.ok) throw new Error('Failed to load household');
      const data = await response.json();
      addHousehold(mapApiHousehold(data.household));
    } catch (err) {
      console.error('Error loading household:', err);
      setError(err instanceof Error ? err.message : 'Failed to load household');
    } finally {
      setLoading(false);
    }
  }, [currentHouseholdId, addHousehold]);

  const loadUserHouseholds = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    setError(null);
    try {
      const householdsData = await getUserHouseholds(user.id);
      householdsData.forEach((h: any) => addHousehold(mapApiHousehold(h)));
    } catch (err) {
      console.error('Error loading user households:', err);
      setError(err instanceof Error ? err.message : 'Failed to load households');
    } finally {
      setLoading(false);
    }
  }, [user?.id, addHousehold]);

  const createHouseholdAction = async (name: string, currency: string = 'AZN') => {
    if (!user?.id) throw new Error('User not logged in');
    setLoading(true);
    setError(null);
    try {
      const household = await apiCreateHousehold(name, '', user.id);
      addHousehold(mapApiHousehold(household));
      setCurrentHouseholdId(household.id);
      return household;
    } catch (err) {
      console.error('Error creating household:', err);
      setError(err instanceof Error ? err.message : 'Failed to create household');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const joinHousehold = async (householdId: string) => {
    if (!user?.id) throw new Error('User not logged in');
    setLoading(true);
    setError(null);
    try {
      await addUserToHousehold(user.id, householdId, 'member');
      await loadUserHouseholds();
      setCurrentHouseholdId(householdId);
    } catch (err) {
      console.error('Error joining household:', err);
      setError(err instanceof Error ? err.message : 'Failed to join household');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const inviteMember = async (householdId: string, email: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/api/households/${householdId}/members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, role: 'member' }),
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to invite member');
      }
    } catch (err) {
      console.error('Error inviting member:', err);
      setError(err instanceof Error ? err.message : 'Failed to invite member');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeMember = async (householdId: string, memberId: string) => {
    setLoading(true);
    setError(null);
    try {
      await removeUserFromHousehold(memberId, householdId);
    } catch (err) {
      console.error('Error removing member:', err);
      setError(err instanceof Error ? err.message : 'Failed to remove member');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateMemberRole = async (householdId: string, memberId: string, role: 'owner' | 'admin' | 'member') => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/api/households/${householdId}/members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: memberId, role }),
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to update member role');
      }
    } catch (err) {
      console.error('Error updating member role:', err);
      setError(err instanceof Error ? err.message : 'Failed to update member role');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getMembers = async (householdId: string): Promise<HouseholdMember[]> => {
    try {
      const members = await getHouseholdMembers(householdId);
      return members.map((m: any) => ({
        user_id: m.id,
        household_id: householdId,
        role: m.role,
        is_owner: m.is_owner,
        joined_at: m.joined_at,
        name: m.name,
        email: m.email,
      }));
    } catch (err) {
      console.error('Error getting members:', err);
      return [];
    }
  };

  return {
    currentHouseholdId,
    setCurrentHouseholdId,
    households,
    loading,
    error,
    loadCurrentHousehold,
    loadUserHouseholds,
    createHousehold: createHouseholdAction,
    joinHousehold,
    inviteMember,
    removeMember,
    updateMemberRole,
    getMembers,
  };
};
