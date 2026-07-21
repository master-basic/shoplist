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

const wrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultQueryFn: () => Promise.resolve(null),
    // Disable cache for testing to avoid interference between tests
    queryClientConfig: {
      defaultQueryFn: () => Promise.resolve(null),
    }
  });
  // Actually, it's easier to just create a new client per test
  // But for simplicity in wrapper, I'll use a stable one or create it here.
  // To ensure isolation, the client should ideally be per-test.
  // But renderHook wrapper is called once per render.
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

// A better way to handle QueryClient in tests:
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultQueryFn: () => Promise.resolve(null),
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

// However, renderHook wrapper receives the same function.
// I'll use a simplified version.
const TestProvider = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = vi.mocked(new QueryClient({ defaultQueryFn: () => Promise.resolve(null) })); // Not working this way
  // I will just use a standard approach.
  return <div />; 
};

// Let's just use a standard wrapper that creates a new client.
// The issue is that renderHook calls the wrapper once per test.

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

  const wrapper = ({ children }: { children: React.ReactNode }) => {
    const qc = new QueryClient({
      defaultQueryFn: () => Promise.resolve(null),
    });
    return (
      <QueryClientProvider client={qc}>
        {children}
      </QueryClientProvider>
    );
  };

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
    const mockUser = { id: '123', name: 'Test User', email: 'test@test.com' };
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

    const mockUser = { id: '123', name: 'Test User' };
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
