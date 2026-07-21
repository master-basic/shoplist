import type { StateCreator } from 'zustand';
import type { Household } from '@/types';
import log from '@/utils/debug';

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
  setCurrentHouseholdId: (id) => {
    log.info('Store setCurrentHouseholdId', { id });
    set({ currentHouseholdId: id });
  },
  addHousehold: (household) => {
    log.info('Store addHousehold', { householdId: household.id, name: household.name });
    set({ households: [...get().households, household] });
  },
  updateHousehold: (household) => {
    log.info('Store updateHousehold', { householdId: household.id });
    set({ households: get().households.map((h) => (h.id === household.id ? household : h)) });
  },
});
