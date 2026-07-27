import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import * as authApi from '@/api/auth';

vi.mock('@/api/auth', () => ({
  registerUser: vi.fn(),
  loginUser: vi.fn(),
  verifyToken: vi.fn(),
  getUserById: vi.fn(),
  getUserHouseholds: vi.fn(),
  createHousehold: vi.fn(),
}));

const createClient = () => new QueryClient({
  defaultOptions: { queries: { retry: false, staleTime: 0 } },
});

const wrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = createClient();
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('useAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: vi.fn(),
        setItem: vi.fn(),
        removeItem: vi.fn(),
        clear: vi.fn(),
      },
      writable: true,
    });
    localStorage.clear();
  });

  it('should return null user if no token is in localStorage', async () => {
    vi.mocked(localStorage.getItem).mockReturnValue(null);
    // verifyToken won't be called because token is null and enabled: !!token

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });
  });

  it('should login and store credentials', async () => {
    const mockUser = { id: '123', name: 'Test User', email: 'test@test.com', isAdmin: false, created_at: '', preferred_currency: 'USD', notification_preferences: { push_notifications: true, price_change_alerts: true, weekly_summary: true, list_updates: true, reminders: true }, households: [] };
    const mockToken = 'mock-token';

    // Setup localStorage mocks
    vi.mocked(localStorage.getItem).mockImplementation((key) => {
      if (key === 'auth_token') return null;
      return null;
    });
    
    // Mock API
    vi.mocked(authApi.loginUser).mockResolvedValue({ user: mockUser, token: mockToken });
    // We also need to mock verifyToken so it doesn't break the auth check
    vi.mocked(authApi.verifyToken).mockResolvedValue(null);

    const { result } = renderHook(() => useAuth(), { wrapper });

    await result.current.login('user', 'pass');

    expect(localStorage.setItem).toHaveBeenCalledWith('auth_token', mockToken);
    expect(localStorage.setItem).toHaveBeenCalledWith('user_id', mockUser.id);
    expect(localStorage.setItem).toHaveBeenCalledWith('user_name', mockUser.name);
  });

  it('should logout and clear localStorage', async () => {
    // Mock token existence
    vi.mocked(localStorage.getItem).mockImplementation((key) => {
        if (key === 'auth_token') return 'some-token';
        if (key === 'user_id') return '123';
        return null;
    });

    const mockUser = { id: '123', name: 'Test User', email: 'test@test.com', isAdmin: false, created_at: '', preferred_currency: 'USD', notification_preferences: { push_notifications: true, price_change_alerts: true, weekly_summary: true, list_updates: true, reminders: true }, households: [] };
    vi.mocked(authApi.verifyToken).mockResolvedValue(mockUser);

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(true);
    });

    result.current.logout();

    expect(localStorage.removeItem).toHaveBeenCalledWith('auth_token');
    expect(localStorage.removeItem).toHaveBeenCalledWith('user_id');
    expect(localStorage.removeItem).toHaveBeenCalledWith('user_email');
    expect(localStorage.removeItem).toHaveBeenCalledWith('user_name');
  });
});
