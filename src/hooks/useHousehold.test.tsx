import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useHousehold } from './useHousehold';
import { useStore } from '@/store/useStore';
import { useAuth } from './useAuth';
import { addUserToHousehold } from '@/api/auth';

vi.mock('@/api/auth', () => ({
  getUserHouseholds: vi.fn(),
  createHousehold: vi.fn(),
  addUserToHousehold: vi.fn(),
  removeUserFromHousehold: vi.fn(),
  getHouseholdMembers: vi.fn(),
}));

vi.mock('@/store/useStore', () => ({
  useStore: vi.fn(),
}));

vi.mock('@/hooks/useAuth', () => ({
  useAuth: vi.fn(),
}));

describe('useHousehold', () => {
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
    vi.mocked(useStore).mockReturnValue({
      user: { id: 'u1' } as any,
      currentHouseholdId: null,
      setCurrentHouseholdId: vi.fn(),
      households: [],
      addHousehold: vi.fn(),
      updateHousehold: vi.fn(),
    } as any);
    vi.mocked(useAuth).mockReturnValue({ user: { id: 'u1' } as any });
  });

  it('should join a household', async () => {
    vi.mocked(addUserToHousehold).mockResolvedValue(undefined);
    const { result } = renderHook(() => useHousehold(), { wrapper: createWrapper() });

    await result.current.joinHousehold('h1');

    expect(addUserToHousehold).toHaveBeenCalledWith('u1', 'h1', 'member');
  });
});
