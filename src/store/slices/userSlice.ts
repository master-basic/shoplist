import type { StateCreator } from 'zustand';
import type { User } from '@/types';
import log from '@/utils/debug';

export interface UserSlice {
  user: User | null;
  setUser: (user: User | null) => void;
}

export const createUserSlice: StateCreator<UserSlice, [], [], UserSlice> = (set) => ({
  user: null,
  setUser: (user) => {
    log.info('Store setUser', { userId: user?.id, name: user?.name, isNull: !user });
    set({ user });
  },
});
