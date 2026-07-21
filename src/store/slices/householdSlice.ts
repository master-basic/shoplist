import type { StateCreator } from 'zustand';
import type { Household } from '@/types';

export interface HouseholdSlice {
  currentHouseholdId: string | null;
  setCurrentHouseholdId: (id: string | null) => void;
  households: Household[];
  addHousehold: (household: Household) => void;
  updateHousehold: (household: Household) => void;
}

export const createHouseholdSlice: StateCreator<HouseholdSlice, [], [], HouseholdSlice> = (set, get) => ({
  currentHouseholdId: null,
  households: [],
  setCurrentHouseholdId: (id) => set({ currentHouseholdId: id }),
  addHousehold: (household) => set({ households: [...get().households, household] }),
  updateHousehold: (household) => set({ households: get().households.map((h) => (h.id === household.id ? household : h)) }),
});
