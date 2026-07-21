import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import * as authApi from '@/api/auth';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

// Mock the API
vi.mock('@/api/auth', () => ({
  registerUser: vi.fn(),
  loginUser: vi.fn(),
  verifyToken: vi.fn(),
  getUserById: vi.fn(),
  getUserHouseholds: vi.fn(),
  createHousehold: vi.fn(),
}));

// Mock debug log
vi.mock('@/utils/debug', () => ({
  default: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
}));

describe('useAuth', () => {
  let queryClient: QueryClient;

  const wrapper = ({ children }: { children: any }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should return null user and false isAuthenticated when no token is present', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });
  });

  it('should fetch user and households when token is present', async () => {
    const mockUser = { id: 'user-123', name: 'Test User', email: 'test@example.com' };
    const mockHouseholds = [{ id: 'h-1', name: 'Home' }];

    localStorage.setItem('auth_token', 'valid-token');
    localStorage.setItem('user_id', 'user-123');

    (authApi.verifyToken as any).mockResolvedValue(mockUser);
    (authApi.getUserById as any).mockResolvedValue(mockUser);
    (authApi.getUserHouseholds as any).mockResolvedValue(mockHouseholds);

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.user).toEqual(mockUser);
      expect(result.current.households).toEqual(mockHouseholds);
      expect(result.current.isAuthenticated).toBe(true);
    });
  });

  it('should handle login successfully', async () => {
    const mockUser = { id: 'user-123', name: 'Test User', email: 'test@example.com' };
    const mockToken = 'new-token';

    (authApi.loginUser as any).mockResolvedValue({ user: mockUser, token: mockToken });
    (authApi.verifyToken as any).mockResolvedValue(mockUser);
    (authApi.getUserById as any).mockResolvedValue(mockUser);
    (authApi.getUserHouseholds as any).mockResolvedValue([]);

    const { result } = renderHook(() => useAuth(), { wrapper });

    await result.current.login('testuser', 'password123');

    expect(localStorage.getItem('auth_token')).toBe(mockToken);
    expect(localStorage.getItem('user_id')).toBe(mockUser.id);

    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.user?.id).toBe(mockUser.id);
    });
  });

  it('should handle login failure', async () => {
    (authApi.loginUser as any).mockRejectedValue(new Error('Invalid credentials'));

    const { result } = renderHook(() => useAuth(), { wrapper });

    await expect(result.current.login('testuser', 'wrong')).rejects.toThrow('Invalid credentials');
  });

  it('should handle logout', async () => {
    localStorage.setItem('auth_token', 'token');
    localStorage.setItem('user_id', 'user-123');

    (authApi.verifyToken as any).mockResolvedValue({ id: 'user-123' });
    (authApi.getUserById as any).mockResolvedValue({ id: 'user-123', name: 'Test' });

    const { result } = renderHook(() => useAuth(), { wrapper });

    // Wait for initial load to avoid the "undefined" error during logout cleanup
    await waitFor(() => expect(result.current.isAuthenticated).toBe(true));

    result.current.logout();

    expect(localStorage.getItem('auth_token')).toBeNull();
    expect(localStorage.getItem('user_id')).toBeNull();
  });
});
