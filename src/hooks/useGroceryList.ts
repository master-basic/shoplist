import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useStore } from '@store/useStore';
import { useHousehold } from './useHousehold';
import { useAuth } from './useAuth';
import type { ListItem } from '@/types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

export const useGroceryList = () => {
  const { lists, addItemToList, updateItem, duplicateList, archiveList, reorderItems: reorderItemsAction } = useStore();
  const { currentHouseholdId } = useHousehold();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load lists for current household
  const loadLists = useCallback(async (householdId?: string) => {
    const id = householdId || currentHouseholdId;
    if (!id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('grocery_lists')
        .select('id, name, household_id, created_by, created_at, status, budget')
        .eq('household_id', id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      if (data) {
        data.forEach(list => {
          addItemToList(list.id, {
            name: list.name,
            quantity: 1,
            unit: 'pcs',
            category: '',
            estimated_price: 0,
            assigned_to: [],
            notes: '',
            sort_order: 0,
            is_recurring: false,
          } as unknown as Omit<ListItem, 'id'>);
        });
      }
    } catch (err) {
      console.error('Error loading lists:', err);
      setError(err instanceof Error ? err.message : 'Failed to load lists');
    } finally {
      setLoading(false);
    }
  }, [addItemToList, currentHouseholdId]);

  // Create grocery list
  const createList = async (name: string, householdId?: string) => {
    const id = householdId || currentHouseholdId;
    if (!id) throw new Error('No household selected');
    
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('grocery_lists')
        .insert([{
          name,
          household_id: id,
          created_by: user?.id,
        }])
        .select()
        .single();
      
      if (error) throw error;
      
      addItemToList(data.id, {
        name: data.name,
        quantity: 1,
        unit: 'pcs',
        category: '',
        estimated_price: 0,
        assigned_to: [],
        notes: '',
        sort_order: 0,
        is_recurring: false,
      } as unknown as Omit<ListItem, 'id'>);
      
      return data;
    } catch (err) {
      console.error('Error creating list:', err);
      setError(err instanceof Error ? err.message : 'Failed to create list');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete grocery list
  const deleteList = async (listId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase
        .from('grocery_lists')
        .delete()
        .eq('id', listId);
      
      if (error) throw error;
    } catch (err) {
      console.error('Error deleting list:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete list');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Add item to list
  const addItem = async (listId: string, item: Omit<ListItem, 'id'>) => {
    setLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase
        .from('list_items')
        .insert([{
          list_id: listId,
          name: item.name,
          category: item.category,
          quantity: item.quantity,
          unit: item.unit,
          estimated_price: item.estimated_price || 0,
          assigned_to: item.assigned_to || [],
          notes: item.notes || '',
          sort_order: item.sort_order || 0,
          is_recurring: false,
        }]);
      
      if (error) throw error;
      
      addItemToList(listId, { ...item, checked_by: undefined, checked_at: undefined } as Omit<ListItem, 'id'>);
    } catch (err) {
      console.error('Error adding item:', err);
      setError(err instanceof Error ? err.message : 'Failed to add item');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update item
  const updateItemFn = async (listId: string, itemId: string, updates: Partial<ListItem>) => {
    setLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase
        .from('list_items')
        .update({
          name: updates.name,
          category: updates.category,
          quantity: updates.quantity,
          unit: updates.unit,
          estimated_price: updates.estimated_price,
          assigned_to: updates.assigned_to,
          notes: updates.notes,
          sort_order: updates.sort_order,
          is_recurring: updates.is_recurring,
        })
        .eq('id', itemId)
        .eq('list_id', listId);
      
      if (error) throw error;
      
      updateItem(listId, itemId, updates);
    } catch (err) {
      console.error('Error updating item:', err);
      setError(err instanceof Error ? err.message : 'Failed to update item');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete item
  const deleteItem = async (listId: string, itemId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase
        .from('list_items')
        .delete()
        .eq('id', itemId)
        .eq('list_id', listId);
      
      if (error) throw error;
    } catch (err) {
      console.error('Error deleting item:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete item');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Toggle item checked status
  const toggleItemFn = async (listId: string, itemId: string) => {
    const list = lists.find(l => l.id === listId);
    if (!list) return;
    
    const item = list.items.find(i => i.id === itemId);
    if (!item) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const isChecked = !item.checked_by;
      
      await supabase
        .from('list_items')
        .update({
          checked_by: isChecked ? user?.id : undefined,
          checked_at: isChecked ? new Date().toISOString() : null,
        })
        .eq('id', itemId)
        .eq('list_id', listId);
      
      useStore.getState().toggleItem(listId, itemId);
    } catch (err) {
      console.error('Error toggling item:', err);
      setError(err instanceof Error ? err.message : 'Failed to toggle item');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Mark all items as checked
  const markAllChecked = async (listId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const list = lists.find(l => l.id === listId);
      if (!list) return;
      
      const itemIds = list.items.map(i => i.id);
      
      await supabase
        .from('list_items')
        .update({ checked_by: user?.id, checked_at: new Date().toISOString() })
        .in('id', itemIds);
    } catch (err) {
      console.error('Error marking all checked:', err);
      setError(err instanceof Error ? err.message : 'Failed to mark all items');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Mark all items as unchecked
  const markAllUnchecked = async (listId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const list = lists.find(l => l.id === listId);
      if (!list) return;
      
      const itemIds = list.items.map(i => i.id);
      
      await supabase
        .from('list_items')
        .update({ checked_by: null, checked_at: null })
        .in('id', itemIds);
    } catch (err) {
      console.error('Error marking all unchecked:', err);
      setError(err instanceof Error ? err.message : 'Failed to mark all items');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Duplicate list
  const duplicateListFn = async (listId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const originalList = lists.find(l => l.id === listId);
      if (!originalList) return;
      
      const { data, error } = await supabase
        .from('grocery_lists')
        .insert([{
          name: `${originalList.name} (Copy)`,
          household_id: originalList.household_id,
          created_by: originalList.created_by,
        }])
        .select()
        .single();
      
      if (error) throw error;
      
      // Copy items
      const { data: items, error: itemsError } = await supabase
        .from('list_items')
        .select('*')
        .eq('list_id', listId);
      
      if (itemsError) throw itemsError;
      
      if (items) {
        const insertData = items.map(item => ({
          list_id: data.id,
          name: item.name,
          category: item.category,
          quantity: item.quantity,
          unit: item.unit,
          estimated_price: item.estimated_price || 0,
          assigned_to: item.assigned_to || [],
          notes: item.notes || '',
          sort_order: item.sort_order,
          is_recurring: item.is_recurring,
        }));
        
        await supabase
          .from('list_items')
          .insert(insertData);
      }
      
      return duplicateList(listId);
    } catch (err) {
      console.error('Error duplicating list:', err);
      setError(err instanceof Error ? err.message : 'Failed to duplicate list');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Archive list
  const archiveListFn = async (listId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      await supabase
        .from('grocery_lists')
        .update({ status: 'archived' })
        .eq('id', listId);
      
      archiveList(listId);
    } catch (err) {
      console.error('Error archiving list:', err);
      setError(err instanceof Error ? err.message : 'Failed to archive list');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Restore archived list
  const restoreList = async (listId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      await supabase
        .from('grocery_lists')
        .update({ status: 'active' })
        .eq('id', listId);
      
      loadLists();
    } catch (err) {
      console.error('Error restoring list:', err);
      setError(err instanceof Error ? err.message : 'Failed to restore list');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Reorder items
  const reorderItems = async (listId: string, itemIds: string[]) => {
    setLoading(true);
    setError(null);
    
    try {
      for (let i = 0; i < itemIds.length; i++) {
        await supabase
          .from('list_items')
          .update({ sort_order: i })
          .eq('id', itemIds[i])
          .eq('list_id', listId);
      }
      
      reorderItemsAction(listId, itemIds);
    } catch (err) {
      console.error('Error reordering items:', err);
      setError(err instanceof Error ? err.message : 'Failed to reorder items');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    lists,
    loading,
    error,
    loadLists,
    createList,
    deleteList,
    addItem,
    updateItem: updateItemFn,
    deleteItem,
    toggleItem: toggleItemFn,
    markAllChecked,
    markAllUnchecked,
    duplicateList: duplicateListFn,
    archiveList: archiveListFn,
    restoreList,
    reorderItems,
  };
};
