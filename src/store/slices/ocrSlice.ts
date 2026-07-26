import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ReceiptOCRState {
  ocrResult: any | null;
  isLoading: boolean;
  error: string | null;
  imageFile: File | null;
  imagePreview: string | null;
  scanMode: 'upload' | 'camera';
  isCameraAllowed: boolean | null;
}

export type OCRSlice = ReceiptOCRState & {
  setScanMode: (mode: 'upload' | 'camera') => void;
  setImageFile: (file: File | null) => void;
  setImagePreview: (preview: string | null) => void;
  setIsLoading: (loading: boolean) => void;
  setOcrResult: (result: any | null) => void;
  setError: (error: string | null) => void;
  setIsCameraAllowed: (allowed: boolean | null) => void;
  clearReceipt: () => void;
};

export const useOCRSlice = create<OCRSlice>()(
  persist(
    (set) => ({
      ocrResult: null,
      isLoading: false,
      error: null,
      imageFile: null,
      imagePreview: null,
      scanMode: 'upload',
      isCameraAllowed: null,
      setScanMode: (mode) => set({ scanMode: mode }),
      setImageFile: (file) => set({ imageFile: file }),
      setImagePreview: (preview) => set({ imagePreview: preview }),
      setIsLoading: (loading) => set({ isLoading: loading }),
      setOcrResult: (result) => set({ ocrResult: result }),
      setError: (error) => set({ error }),
      setIsCameraAllowed: (allowed) => set({ isCameraAllowed: allowed }),
      clearReceipt: () => set({
        ocrResult: null,
        imageFile: null,
        imagePreview: null,
        error: null,
      }),
    }),
    { name: 'ocr-store' }
  )
);
