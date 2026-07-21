import type { StateCreator } from 'zustand';

export interface UISlice {
  loading: boolean;
  error: string | null;
  toast: string | null;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setToast: (toast: string | null) => void;
}

export const createUISlice: StateCreator<UISlice, [], [], UISlice> = (set) => ({
  loading: false,
  error: null,
  toast: null,
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setToast: (toast) => set({ toast }),
});
