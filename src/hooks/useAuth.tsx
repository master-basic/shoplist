import { useState, useEffect, useCallback } from 'react';
import { registerUser, loginUser, getUserById, getUserHouseholds, createHousehold } from '@/api/auth';
import { User, Household } from '@/types';

/**
 * Error interface for API errors
 */
export interface ApiError {
  message: string;
  code?: string;
  details?: Record<string, unknown>;
}

/**
 * Generic error type for catch blocks
 */
type CatchError = Error | unknown;

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
  const [user, setUser] = useState<User | null>(null);
  const [households, setHouseholds] = useState<Household[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadUser = useCallback(async () => {
    try {
      const userId = localStorage.getItem('user_id');
      if (!userId) {
        setUser(null);
        setHouseholds([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      const userData = await getUserById(userId);
      if (userData) {
        setUser(userData);

        // Load households
        const userHouseholds = await getUserHouseholds(userId);
        setHouseholds(userHouseholds || []);
      } else {
        // User not found - clear localStorage and set to null
        localStorage.removeItem('user_id');
        localStorage.removeItem('user_name');
        localStorage.removeItem('user_email');
        setUser(null);
        setHouseholds([]);
      }
    } catch (err) {
      console.error('Error loading user:', err);
      setError('Failed to load user data');
      setUser(null);
      setHouseholds([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    try {
      setError(null);
      setIsLoading(true);

      // Clear any stale user data before login
      localStorage.removeItem('user_id');
      localStorage.removeItem('user_name');
      localStorage.removeItem('user_email');

      const { user: userData, token } = await loginUser(username, password);
      localStorage.setItem('user_id', userData.id);
      localStorage.setItem('user_name', userData.name);
      localStorage.setItem('auth_token', token);

      setUser(userData);

      // Load households
      const userHouseholds = await getUserHouseholds(userData.id);
      setHouseholds(userHouseholds || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage || 'Login failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    try {
      setError(null);
      setIsLoading(true);

      const { user: userData, token } = await registerUser(name, email, password);
      localStorage.setItem('user_id', userData.id);
      localStorage.setItem('user_email', userData.email);
      localStorage.setItem('user_name', userData.name);
      localStorage.setItem('auth_token', token);

      setUser(userData);

      // Load households
      const userHouseholds = await getUserHouseholds(userData.id);
      setHouseholds(userHouseholds || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage || 'Registration failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_name');
    localStorage.removeItem('auth_token');
    setUser(null);
    setHouseholds([]);
  }, []);

  const createHousehold = useCallback(async (name: string, description: string, userId: string) => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      setIsLoading(true);
      const household = await createHousehold(name, description, userId);
      setHouseholds(prev => [...(prev as Household[]), household] as Household[]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage || 'Failed to create household');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const refreshUser = useCallback(async () => {
    await loadUser();
  }, [loadUser]);

  // Load user on mount - removed loadUser dependency to prevent infinite loop
  useEffect(() => {
    loadUser();
  }, []);

  return {
    user,
    households,
    isLoading,
    error,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    createHousehold,
    refreshUser
  };
}