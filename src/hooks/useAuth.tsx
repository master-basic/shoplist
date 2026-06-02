import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { User as UserType } from '@/types';
import React, { ReactNode } from 'react';

/**
 * Auth Store - Single source of truth for authentication state
 * Uses Zustand with localStorage persistence
 * No Context API - Zustand is the only state management
 */

export interface AuthState {
  // State
  user: UserType | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  setUser: (user: UserType | null, error?: string | null) => void;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  signOut: () => void;
  resetPassword: (email: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  validateEmail: (email: string) => boolean;
  validatePassword: (password: string) => boolean;
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Validation helpers
      validateEmail: (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
      },

      validatePassword: (password: string) => {
        return password.length >= 6;
      },

      // Set user and authentication state
      setUser: (user, error = null) => {
        set({ user, isAuthenticated: !!user, isLoading: false, error });
      },

      // Login with email/password
      // TEST CREDENTIALS: admin/admin (admin), user/user (normal user)
      login: async (email: string, password: string) => {
        const validateEmail = useAuth.getState().validateEmail(email);
        const validatePassword = useAuth.getState().validatePassword(password);

        if (!validateEmail) {
          throw new Error('Invalid email address');
        }
        if (!validatePassword) {
          throw new Error('Password must be at least 6 characters');
        }

        // Hardcoded test credentials for demo purposes
        const TEST_USERS: Record<string, string> = {
          'admin': 'admin',
          'user': 'user',
        };

        if (TEST_USERS[email] !== password) {
          throw new Error('Invalid email or password');
        }

        set({ isLoading: true, error: null });

        // Simulate API call with proper Promise wrapping
        return new Promise<void>((resolve, reject) => {
          setTimeout(() => {
            try {
              const isAdmin = email === 'admin';
              const mockUser: UserType = {
                id: uuidv4(),
                email,
                name: isAdmin ? 'Admin User' : 'Regular User',
                isAdmin,
                created_at: new Date().toISOString(),
                preferred_currency: 'AZN',
                notification_preferences: {
                  push_notifications: true,
                  price_change_alerts: true,
                  weekly_summary: true,
                  list_updates: true,
                  reminders: true,
                },
                households: [],
              };

              set({ user: mockUser, isAuthenticated: true, isLoading: false, error: null });
              resolve();
            } catch (err) {
              const errorMessage = err instanceof Error ? err.message : 'Login failed';
              set({ isLoading: false, error: errorMessage });
              reject(new Error(errorMessage));
            }
          }, 500);
        });
      },

      // Register new user
      register: async (name: string, email: string, password: string) => {
        const validateEmail = useAuth.getState().validateEmail(email);
        const validatePassword = useAuth.getState().validatePassword(password);

        if (!validateEmail) {
          throw new Error('Invalid email address');
        }
        if (!validatePassword) {
          throw new Error('Password must be at least 6 characters');
        }

        set({ isLoading: true, error: null });

        return new Promise<void>((resolve, reject) => {
          setTimeout(() => {
            try {
              const mockUser: UserType = {
                id: uuidv4(),
                email,
                name,
                isAdmin: false,
                created_at: new Date().toISOString(),
                preferred_currency: 'AZN',
                notification_preferences: {
                  push_notifications: true,
                  price_change_alerts: true,
                  weekly_summary: true,
                  list_updates: true,
                  reminders: true,
                },
                households: [],
              };

              set({ user: mockUser, isAuthenticated: true, isLoading: false, error: null });
              resolve();
            } catch (err) {
              const errorMessage = err instanceof Error ? err.message : 'Registration failed';
              set({ isLoading: false, error: errorMessage });
              reject(new Error(errorMessage));
            }
          }, 500);
        });
      },

      // Logout
      logout: () => {
        set({ user: null, isAuthenticated: false, isLoading: false, error: null });
      },

      signOut: () => {
        set({ user: null, isAuthenticated: false, isLoading: false, error: null });
      },

      // Reset password
      resetPassword: async (email: string) => {
        set({ isLoading: true, error: null });

        return new Promise<void>((resolve, reject) => {
          setTimeout(() => {
            try {
              set({ isLoading: false, error: null });
              resolve();
            } catch (err) {
              const errorMessage = err instanceof Error ? err.message : 'Password reset failed';
              set({ isLoading: false, error: errorMessage });
              reject(new Error(errorMessage));
            }
          }, 500);
        });
      },

      // Wrapper for login (signIn = login)
      signIn: async (email: string, password: string) => {
        await get().login(email, password);
      },

      // Wrapper for register (signUp = register)
      signUp: async (name: string, email: string, password: string) => {
        await get().register(name, email, password);
      },

      // Google sign-in (placeholder for future implementation)
      signInWithGoogle: async () => {
        set({ isLoading: true, error: null });

        return new Promise<void>((resolve, reject) => {
          setTimeout(() => {
            try {
              const mockUser: UserType = {
                id: uuidv4(),
                email: 'google@example.com',
                name: 'Google User',
                isAdmin: false,
                created_at: new Date().toISOString(),
                preferred_currency: 'AZN',
                notification_preferences: {
                  push_notifications: true,
                  price_change_alerts: true,
                  weekly_summary: true,
                  list_updates: true,
                  reminders: true,
                },
                households: [],
              };

              set({ user: mockUser, isAuthenticated: true, isLoading: false, error: null });
              resolve();
            } catch (err) {
              const errorMessage = err instanceof Error ? err.message : 'Google sign-in failed';
              set({ isLoading: false, error: errorMessage });
              reject(new Error(errorMessage));
            }
          }, 500);
        });
      },
    }),
    {
      name: 'grocerymind-auth',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

/**
 * Auth Provider - Wraps the app and provides auth context
 * The Zustand store is the single source of truth
 */
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  return <React.Fragment>{children}</React.Fragment>;
};

// Export Zustand store as the auth context (no separate Context API needed)
export const AuthContext = useAuth as unknown as typeof useAuth;