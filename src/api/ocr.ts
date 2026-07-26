import type { OCRItem } from '@/components/ScanReview';

export interface ReceiptOCRResult {
  items: OCRItem[];
  storeName: string;
  date: string;
  subtotal: number;
  tax: number;
  total: number;
  confidence: number;
  imageUrl: string | null;
}

export interface ReceiptOCRData {
  ocrResult: ReceiptOCRResult;
}

export const callOCR = async (imageFile: File): Promise<ReceiptOCRResult> => {
  const formData = new FormData();
  formData.append('image', imageFile);

  const token = localStorage.getItem('auth_token');
  const authHeader: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};

  const res = await fetch(`${import.meta.env.VITE_API_BASE || 'http://localhost:3001'}/api/receipts/ocr`, {
    method: 'POST',
    headers: authHeader,
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.text();
    throw new Error(errorData || 'OCR processing failed');
  }

  const data = await res.json();
  return data.ocrResult;
};
