import { useState, useEffect, useCallback } from 'react';
import { registerUser, loginUser, getUserById, getUserHouseholds, createHousehold } from '@/api/auth';
import { User, Household } from '@/types';

interface UseAuthReturn {
  user: User | null;
  households: Household[];
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  createHousehold: (name: string, description: string) => Promise<void>;
  refreshUser: () => Promise<void>;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [households, setHouseholds] = useState<Household[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadUser = useCallback(async () => {
    try {
      // Get user from localStorage
      const userId = localStorage.getItem('user_id');
      if (!userId) {
        setUser(null);
        setHouseholds([]);
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

  const login = useCallback(async (email: string, password: string) => {
    try {
      setError(null);
      setIsLoading(true);

      const userData = await loginUser(email, password);
      localStorage.setItem('user_id', userData.id);
      localStorage.setItem('user_email', userData.email);
      localStorage.setItem('user_name', userData.name);
      
      setUser(userData);
      
      // Load households
      const userHouseholds = await getUserHouseholds(userData.id);
      setHouseholds(userHouseholds || []);
    } catch (err: any) {
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    try {
      setError(null);
      setIsLoading(true);

      const userData = await registerUser(name, email, password);
      localStorage.setItem('user_id', userData.id);
      localStorage.setItem('user_email', userData.email);
      localStorage.setItem('user_name', userData.name);
      
      setUser(userData);
      
      // Load households
      const userHouseholds = await getUserHouseholds(userData.id);
      setHouseholds(userHouseholds || []);
    } catch (err: any) {
      setError(err.message || 'Registration failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_name');
    setUser(null);
    setHouseholds([]);
  }, []);

  const createHousehold = useCallback(async (name: string, description: string) => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      setIsLoading(true);
      const household = await createHousehold(name, description, user.id);
      setHouseholds(prev => [...prev, household] as Household[]);
    } catch (err: any) {
      setError(err.message || 'Failed to create household');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const refreshUser = useCallback(async () => {
    await loadUser();
  }, [loadUser]);

  // Load user on mount
  useEffect(() => {
    loadUser();
  }, [loadUser]);

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
