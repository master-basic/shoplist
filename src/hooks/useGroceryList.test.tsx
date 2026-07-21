import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useGroceryList } from './useGroceryList';
import { useStore } from '@/store/useStore';
import { useHousehold } from './useHousehold';
import { useAuth } from './useAuth';
import * as apiLists from '@/api/lists';

vi.mock('@/api/lists', () => ({
  getUserLists: vi.fn(),
  createList: vi.fn(),
  deleteList: vi.fn(),
  createListItem: vi.fn(),
  updateListItem: vi.fn(),
  deleteListItem: vi.fn(),
  toggleItemCompletion: vi.fn(),
  apiDeleteList: vi.fn(), // Note: the hook uses apiDeleteList for deleteListMutation
}));

vi.mock('@/store/useStore', () => ({
  useStore: vi.fn(),
}));

vi.mock('@/hooks/useHousehold', () => ({
  useHousehold: vi.fn(),
}));

vi.mock('@/hooks/useAuth', () => ({
  useAuth: vi.fn(),
}));

describe('useGroceryList', () => {
  const createWrapper = () => {
    const qc = new QueryClient({
      defaultQueryFn: () => Promise.resolve(null),
    });
    return ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={qc}>
        {children}
      </QueryClientProvider>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Mock useStore
    vi.mocked(useStore).mockReturnValue({
      lists: [],
      addItemToList: vi.fn(),
      updateItem: vi.fn(),
      duplicateList: vi.fn(),
      archiveList: vi.fn(),
      reorderItems: vi.fn(),
    });
    // Mock useHousehold
    vi.mocked(useHousehold).mockReturnValue({ currentHouseholdId: 'h1' });
    // Mock useAuth
    vi.mocked(useAuth).mockReturnValue({ user: { id: 'u1' } as any });
  });

  it('should fetch lists on mount', async () => {
    const mockLists = [{ id: 'l1', name: 'List 1', items: [] }];
    vi.mocked(apiLists.getUserLists).mockResolvedValue(mockLists as any);

    const { result } = renderHook(() => useGroceryList(), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    expect(apiLists.getUserLists).toHaveBeenCalledWith('u1');
  });

  it('should create a list', async () => {
    const mockList = { id: 'l1', name: 'New List', household_id: 'h1' };
    vi.mocked(apiLists.createList).mockResolvedValue(mockList as any);

    const { result } = renderHook(() => useGroceryList(), { wrapper: createWrapper() });

    await result.current.createList('New List', 'h1');

    expect(apiLists.createList).toHaveBeenCalled();
  });
});
