// =====================================================
// GroceryMind - Household Hook
// =====================================================

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useStore } from '@/store/useStore';
import type { Household, HouseholdMember } from '@/types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

export const useHousehold = () => {
  const { currentHouseholdId, setCurrentHouseholdId, households, addHousehold, updateHousehold } = useStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load current household
  const loadCurrentHousehold = useCallback(async () => {
    if (!currentHouseholdId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('households')
        .select('*')
        .eq('id', currentHouseholdId)
        .single();
      
      if (error) throw error;
      
      addHousehold(data as Household);
    } catch (err) {
      console.error('Error loading household:', err);
      setError(err instanceof Error ? err.message : 'Failed to load household');
    } finally {
      setLoading(false);
    }
  }, [currentHouseholdId, addHousehold]);

  // Load all households for current user
  const loadUserHouseholds = useCallback(async () => {
    if (!currentHouseholdId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const { data: members } = await supabase
        .from('household_members')
        .select('household_id')
        .eq('user_id', currentHouseholdId);
      
      if (members?.length) {
        const householdIds = members.map(m => m.household_id);
        const { data: householdsData } = await supabase
          .from('households')
          .select('*')
          .in('id', householdIds);
        
        if (householdsData) {
          householdsData.forEach(h => addHousehold(h as Household));
        }
      }
    } catch (err) {
      console.error('Error loading user households:', err);
      setError(err instanceof Error ? err.message : 'Failed to load households');
    } finally {
      setLoading(false);
    }
  }, [currentHouseholdId, addHousehold]);

  // Create household
  const createHousehold = async (name: string, currency: string = 'AZN') => {
    setLoading(true);
    setError(null);
    
    try {
      // Create household
      const { data: household, error: householdError } = await supabase
        .from('households')
        .insert([{
          name,
          currency,
          created_by: currentHouseholdId,
        }])
        .select()
        .single();
      
      if (householdError) throw householdError;
      
      // Add creator as owner
      const { error: memberError } = await supabase
        .from('household_members')
        .insert([{
          household_id: household.id,
          user_id: currentHouseholdId,
          role: 'owner',
        }]);
      
      if (memberError) throw memberError;
      
      addHousehold(household as Household);
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

  // Join household
  const joinHousehold = async (householdId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Verify household exists
      const { data: household, error: fetchError } = await supabase
        .from('households')
        .select('*')
        .eq('id', householdId)
        .single();
      
      if (fetchError) throw fetchError;
      
      // Add member
      const { error: memberError } = await supabase
        .from('household_members')
        .insert([{
          household_id: householdId,
          user_id: currentHouseholdId,
          role: 'member',
        }]);
      
      if (memberError) throw memberError;
      
      // Load and set household
      await loadCurrentHousehold();
      
      return household;
    } catch (err) {
      console.error('Error joining household:', err);
      setError(err instanceof Error ? err.message : 'Failed to join household');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Invite member
  const inviteMember = async (householdId: string, email: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Create invite token
      const { data: inviteToken, error: tokenError } = await supabase
        .rpc('create_household_invite', {
          household_id: householdId,
          email,
        });
      
      if (tokenError) throw tokenError;
      
      return inviteToken;
    } catch (err) {
      console.error('Error inviting member:', err);
      setError(err instanceof Error ? err.message : 'Failed to invite member');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Remove member
  const removeMember = async (householdId: string, memberId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase
        .from('household_members')
        .delete()
        .eq('household_id', householdId)
        .eq('user_id', memberId);
      
      if (error) throw error;
    } catch (err) {
      console.error('Error removing member:', err);
      setError(err instanceof Error ? err.message : 'Failed to remove member');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update member role
  const updateMemberRole = async (householdId: string, memberId: string, role: 'owner' | 'admin' | 'member') => {
    setLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase
        .from('household_members')
        .update({ role })
        .eq('household_id', householdId)
        .eq('user_id', memberId);
      
      if (error) throw error;
    } catch (err) {
      console.error('Error updating member role:', err);
      setError(err instanceof Error ? err.message : 'Failed to update member role');
      throw err;
    } finally {
      setLoading(false);
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
    createHousehold,
    joinHousehold,
    inviteMember,
    removeMember,
    updateMemberRole,
  };
};