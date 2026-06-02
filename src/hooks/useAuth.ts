import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { User as UserType } from '@/types';

export interface AuthState {
  user: UserType | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  setUser: (user: UserType | null) => void;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  resetPassword: (email: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => void;
  signInWithGoogle: () => Promise<void>;
  AuthProvider: any;
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        setTimeout(() => {
          const mockUser: UserType = {
            id: uuidv4(),
            email,
            name: email.split('@')[0],
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
          set({ user: mockUser, isAuthenticated: true, isLoading: false });
        }, 500);
      },
      register: async (name: string, email: string, password: string) => {
        set({ isLoading: true, error: null });
        setTimeout(() => {
          const mockUser: UserType = {
            id: uuidv4(),
            email,
            name,
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
          set({ user: mockUser, isAuthenticated: true, isLoading: false });
        }, 500);
      },
      logout: () => set({ user: null, isAuthenticated: false }),
      resetPassword: async (email: string) => {
        set({ isLoading: true, error: null });
        setTimeout(() => {
          set({ isLoading: false, error: null });
        }, 500);
      },
      signIn: async (email: string, password: string) => {
        await get().login(email, password);
      },
      signUp: async (name: string, email: string, password: string) => {
        await get().register(name, email, password);
      },
      signOut: () => get().logout(),
      signInWithGoogle: async () => {
        set({ isLoading: true, error: null });
        setTimeout(() => {
          const mockUser: UserType = {
            id: uuidv4(),
            email: 'google@example.com',
            name: 'Google User',
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
          set({ user: mockUser, isAuthenticated: true, isLoading: false });
        }, 500);
      },
      AuthProvider: () => null,
    }),
    {
      name: 'grocerymind-auth',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return children;
};
