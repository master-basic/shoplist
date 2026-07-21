import { useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { registerUser, loginUser, verifyToken, getUserById, getUserHouseholds, createHousehold } from '@/api/auth';
import { User, Household } from '@/types';
import log from '@/utils/debug';

interface UseAuthReturn {
  user: User | null;
  households: Household[];
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  createHousehold: (name: string, description: string, userId: string) => Promise<void>;
  refreshUser: () => Promise<void>;
}

export function useAuth(): UseAuthReturn {
  const queryClient = useQueryClient();
  const token = localStorage.getItem('auth_token');
  const userId = localStorage.getItem('user_id');
  log.info('useAuth mounted', { hasToken: !!token, userId });

  // 1. Verify token on mount (checks if token is still valid)
  const { data: verifiedUser } = useQuery<User | null>({
    queryKey: ['auth', 'verify', token],
    queryFn: async () => {
      log.info('verifyToken called');
      try {
        const result = await verifyToken();
        log.info('verifyToken result', { success: !!result, id: result?.id });
        return result;
      } catch (e) {
        log.error('verifyToken threw', { error: e instanceof Error ? e.message : String(e) });
        return null;
      }
    },
    enabled: !!token,
  });

  // 2. User Query — fetch full profile
  const effectiveUserId = verifiedUser?.id || userId;
  log.info('effectiveUserId', { id: effectiveUserId, from: verifiedUser ? 'verify' : 'localStorage' });
  const {
    data: user,
    isLoading: isLoadingUser,
    error: userError,
  } = useQuery<User | null>({
    queryKey: ['user', effectiveUserId],
    queryFn: async () => {
      if (!effectiveUserId) { log.warn('getUserById skipped - no userId'); return null; }
      const result = await getUserById(effectiveUserId);
      log.info('getUserById result', { found: !!result, name: result?.name });
      return result;
    },
    enabled: !!effectiveUserId && !!token,
  });

  // 3. Households Query
  const {
    data: households = [],
    isLoading: isLoadingHouseholds,
  } = useQuery<Household[]>({
    queryKey: ['households', effectiveUserId],
    queryFn: async () => {
      if (!effectiveUserId) { log.warn('getUserHouseholds skipped - no userId'); return []; }
      const result = await getUserHouseholds(effectiveUserId);
      log.info('getUserHouseholds result', { count: result.length });
      return result;
    },
    enabled: !!effectiveUserId && !!user,
  });

  log.info('useAuth state', { userLoaded: !!user, householdCount: households.length, isLoading: isLoadingUser || isLoadingHouseholds, error: userError?.toString() });

  // 4. Login Mutation
  const loginMutation = useMutation({
    mutationFn: async ({ username, password }: { username: string; password: string }) => {
      log.info('loginMutation started', { username });
      const result = await loginUser(username, password);
      log.info('loginMutation succeeded', { userId: result.user.id, hasToken: !!result.token });
      return result;
    },
    onSuccess: (data) => {
      const { user: userData, token: newToken } = data;
      localStorage.setItem('auth_token', newToken);
      localStorage.setItem('user_id', userData.id);
      localStorage.setItem('user_name', userData.name);
      log.info('login: localStorage set', { userId: userData.id, name: userData.name });
      queryClient.setQueryData(['user', userData.id], userData);
      queryClient.invalidateQueries({ queryKey: ['households', userData.id] });
    },
    onError: (err: Error) => {
      log.error('loginMutation failed', { message: err.message });
    },
  });

  // 5. Register Mutation
  const registerMutation = useMutation({
    mutationFn: async ({ name, email, password }: { name: string; email: string; password: string }) => {
      log.info('registerMutation started', { name, email });
      const result = await registerUser(name, email, password);
      log.info('registerMutation succeeded', { userId: result.user.id });
      return result;
    },
    onSuccess: (data) => {
      const { user: userData, token: newToken } = data;
      localStorage.setItem('auth_token', newToken);
      localStorage.setItem('user_id', userData.id);
      localStorage.setItem('user_email', userData.email);
      localStorage.setItem('user_name', userData.name);
      log.info('register: localStorage set', { userId: userData.id, name: userData.name });
      queryClient.setQueryData(['user', userData.id], userData);
      queryClient.invalidateQueries({ queryKey: ['households', userData.id] });
    },
    onError: (err: Error) => {
      log.error('registerMutation failed', { message: err.message });
    },
  });

  // 6. Create Household Mutation
  const createHouseholdMutation = useMutation({
    mutationFn: ({ name, description, userId }: { name: string; description: string; userId: string }) => createHousehold(name, description, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['households', effectiveUserId] });
    },
  });

  const login = useCallback(async (username: string, password: string) => {
    log.info('login() called', { username });
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_name');
    localStorage.removeItem('user_email');
    try {
      await loginMutation.mutateAsync({ username, password });
      log.info('login() completed');
    } catch (e) {
      log.error('login() failed', { error: e instanceof Error ? e.message : String(e) });
      throw e;
    }
  }, [loginMutation]);

  const register = useCallback(async (name: string, email: string, password: string) => {
    log.info('register() called', { name, email });
    try {
      await registerMutation.mutateAsync({ name, email, password });
      log.info('register() completed');
    } catch (e) {
      log.error('register() failed', { error: e instanceof Error ? e.message : String(e) });
      throw e;
    }
  }, [registerMutation]);

  const logout = useCallback(() => {
    log.info('logout() called');
    ['auth_token', 'user_id', 'user_email', 'user_name'].forEach(k => localStorage.removeItem(k));
    queryClient.removeQueries({ queryKey: ['user'] });
    queryClient.removeQueries({ queryKey: ['households'] });
    queryClient.removeQueries({ queryKey: ['auth'] });
    log.info('logout() completed');
  }, [queryClient]);

  const createHouseholdFn = useCallback(async (name: string, description: string, userIdParam: string) => {
    if (!user) throw new Error('User not authenticated');
    await createHouseholdMutation.mutateAsync({ name, description, userId: userIdParam });
  }, [user, createHouseholdMutation]);

  const refreshUser = useCallback(async () => {
    const id = effectiveUserId;
    if (id) {
      await queryClient.invalidateQueries({ queryKey: ['user', id] });
      await queryClient.invalidateQueries({ queryKey: ['households', id] });
    }
  }, [queryClient, effectiveUserId]);

  const resolvedUser = verifiedUser || user;

  return {
    user: resolvedUser ?? null,
    households: households as Household[],
    isLoading: isLoadingUser || isLoadingHouseholds || loginMutation.isPending || registerMutation.isPending,
    error: userError ? userError.toString() : null,
    isAuthenticated: !!resolvedUser,
    login,
    register,
    logout,
    createHousehold: createHouseholdFn,
    refreshUser,
  };
}
