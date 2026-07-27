import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ReceiptImage {
  id: string;
  fileUrl: string;
  thumbnailUrl?: string;
  compressedFileUrl?: string;
  uploadedAt: string;
}

interface ReceiptState {
  receipts: ReceiptImage[];
  isUploading: boolean;
  uploadProgress: number;
  error: string | null;

  setReceipts: (receipts: ReceiptImage[]) => void;
  addReceipt: (receipt: ReceiptImage) => void;
  removeReceipt: (id: string) => void;
  setUploading: (loading: boolean) => void;
  setUploadProgress: (progress: number) => void;
  setError: (error: string | null) => void;
  clearReceipts: () => void;
  compressImage: (file: File, maxWidth?: number, maxHeight?: number, quality?: number) => Promise<Blob>;
  generateThumbnail: (fileUrl: string, width?: number, height?: number) => Promise<string>;
}

const DEFAULT_QUALITY = 0.7;
const MAX_WIDTH = 1920;
const MAX_HEIGHT = 2560;

function compressImageToFile(file: File, maxWidth = MAX_WIDTH, maxHeight = MAX_HEIGHT, quality = DEFAULT_QUALITY): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();
    
    reader.onload = (e) => {
      img.src = e.target?.result as string;
    };
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;
      
      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }
      if (height > maxHeight) {
        width = Math.round((width * maxHeight) / height);
        height = maxHeight;
      }
      
      canvas.width = width;
      canvas.height = height;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }
      
      ctx.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Image compression failed'));
          }
        },
        'image/jpeg',
        quality
      );
    };
    
    img.onerror = () => reject(new Error('Failed to load image'));
    reader.readAsDataURL(file);
  });
}

function generateThumbnail(fileUrl: string, width = 120, height = 160): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }
      
      ctx.drawImage(img, 0, 0, width, height);
      
      try {
        const thumbnail = canvas.toDataURL('image/jpeg', 0.6);
        resolve(thumbnail);
      } catch {
        reject(new Error('Thumbnail generation failed'));
      }
    };
    
    img.onerror = () => reject(new Error('Failed to load image for thumbnail'));
    img.src = fileUrl;
  });
}

export const useReceiptSlice = create<ReceiptState>()(
  persist(
    (set, get) => ({
      receipts: [],
      isUploading: false,
      uploadProgress: 0,
      error: null,

      setReceipts: (receipts) => set({ receipts }),
      addReceipt: (receipt) => set((state) => ({ receipts: [...state.receipts, receipt] })),
      removeReceipt: (id) => set((state) => ({ receipts: state.receipts.filter((r) => r.id !== id) })),
      setUploading: (loading) => set({ isUploading: loading }),
      setUploadProgress: (progress) => set({ uploadProgress: progress }),
      setError: (error) => set({ error }),
      clearReceipts: () => set({ receipts: [], error: null }),

      compressImage: async (file: File, maxWidth?: number, maxHeight?: number, quality?: number) => {
        try {
          set({ isUploading: true, uploadProgress: 30 });
          const blob = await compressImageToFile(file, maxWidth ?? MAX_WIDTH, maxHeight ?? MAX_HEIGHT, quality ?? DEFAULT_QUALITY);
          set({ uploadProgress: 80 });
          return blob;
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Compression failed';
          set({ error: message, isUploading: false, uploadProgress: 0 });
          throw err;
        }
      },

      generateThumbnail: async (fileUrl: string, width?: number, height?: number) => {
        try {
          return await generateThumbnail(fileUrl, width ?? 120, height ?? 160);
        } catch {
          return fileUrl;
        }
      },
    }),
    { name: 'receipt-store' }
  )
);
