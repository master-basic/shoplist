import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useStore } from '@/store/useStore';
import { API_BASE } from '@/config';
import { authHeaders } from '@/api/client';
import { getUserHouseholds, createHousehold as apiCreateHousehold, addUserToHousehold, removeUserFromHousehold, getHouseholdMembers } from '@/api/auth';
import type { Household, HouseholdMember } from '@/types';

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

  const queryClient = useQueryClient();

  const loadCurrentHousehold = async () => {
    if (!currentHouseholdId) return;
    const response = await fetch(`${API_BASE}/api/households/${currentHouseholdId}`, { headers: { 'Content-Type': 'application/json', ...authHeaders() } });
    if (!response.ok) throw new Error('Failed to load household');
    const data = await response.json();
    return mapApiHousehold(data.household);
  };

  const loadUserHouseholds = async () => {
    if (!user?.id) return;
    const householdsData = await getUserHouseholds(user.id);
    return householdsData.map((h: any) => mapApiHousehold(h));
  };

  const householdsQuery = useQuery({
    queryKey: ['households', user?.id],
    queryFn: loadUserHouseholds,
    enabled: !!user?.id,
  });

  const currentHouseholdQuery = useQuery({
    queryKey: ['currentHousehold', currentHouseholdId],
    queryFn: loadCurrentHousehold,
    enabled: !!currentHouseholdId,
  });

  const createHouseholdMutation = useMutation({
    mutationFn: async (name: string) => {
      if (!user?.id) throw new Error('User not logged in');
      const household = await apiCreateHousehold(name, '', user.id);
      addHousehold(mapApiHousehold(household));
      setCurrentHouseholdId(household.id);
      return household;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['households', user?.id] });
    },
  });

  const joinHouseholdMutation = useMutation({
    mutationFn: async (householdId: string) => {
      if (!user?.id) throw new Error('User not logged in');
      await addUserToHousehold(user.id, householdId, 'member');
      setCurrentHouseholdId(householdId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['households', user?.id] });
    },
  });

  const inviteMemberMutation = useMutation({
    mutationFn: async (args: { householdId: string; email: string }) => {
      const response = await fetch(`${API_BASE}/api/households/${args.householdId}/members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify({ email: args.email, role: 'member' }),
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to invite member');
      }
    },
  });

  const removeMemberMutation = useMutation({
    mutationFn: async (args: { householdId: string; memberId: string }) => {
      await removeUserFromHousehold(args.memberId, args.householdId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['households', user?.id] });
    },
  });

  const updateMemberRoleMutation = useMutation({
    mutationFn: async (args: { householdId: string; memberId: string; role: 'owner' | 'admin' | 'member' }) => {
      await addUserToHousehold(args.memberId, args.householdId, args.role);
    },
  });

  const getMembersQuery = useQuery({
    queryKey: ['householdMembers', currentHouseholdId],
    queryFn: async (): Promise<HouseholdMember[]> => {
      if (!currentHouseholdId) return [];
      const members = await getHouseholdMembers(currentHouseholdId);
      return members.map((m: any) => ({
        user_id: m.id,
        household_id: currentHouseholdId,
        role: m.role,
        is_owner: m.is_owner,
        joined_at: m.joined_at,
        name: m.name,
        email: m.email,
      }));
    },
    enabled: !!currentHouseholdId,
  });

  const fetchMembers = async (householdId: string): Promise<HouseholdMember[]> => {
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
  };

  return {
    currentHouseholdId,
    setCurrentHouseholdId,
    households: householdsQuery.data || [],
    loading: householdsQuery.isLoading || currentHouseholdQuery.isLoading,
    error: householdsQuery.error as Error | null,
    loadUserHouseholds: () => queryClient.invalidateQueries({ queryKey: ['households', user?.id] }),
    createHousehold: (name: string) => createHouseholdMutation.mutateAsync(name),
    joinHousehold: (householdId: string) => joinHouseholdMutation.mutateAsync(householdId),
    inviteMember: (householdId: string, email: string) => inviteMemberMutation.mutateAsync({ householdId, email }),
    removeMember: (householdId: string, memberId: string) => removeMemberMutation.mutateAsync({ householdId, memberId }),
    updateMemberRole: (householdId: string, memberId: string, role: 'owner' | 'admin' | 'member') => updateMemberRoleMutation.mutateAsync({ householdId, memberId, role }),
    getMembers: getMembersQuery.data || [],
    fetchMembers,
  };
};
