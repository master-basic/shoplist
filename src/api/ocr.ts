import type { OCRItem } from '@/components/ScanReview';
import Tesseract from 'tesseract.js';

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

export const callOCR = async (file: File): Promise<ReceiptOCRResult> => {
  const formData = new FormData();
  formData.append('image', file);

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

export const parseOCRResult = (rawText: string, imageUrl: string | null): ReceiptOCRResult => {
  const storeNameMatch = rawText.match(/(?:store name|merchant|shop name|vendor|store):?\s*([a-zA-Z\s]+)/i);
  const storeName = storeNameMatch ? storeNameMatch[1].trim() : 'Unknown Store';

  const dateMatch = rawText.match(/(?:date|dated):?\s*(\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4}|\d{2}[-\/]\d{2}[-\/]\d{2})/i);
  const date = dateMatch ? dateMatch[1] : new Date().toISOString().split('T')[0];

  const items: OCRItem[] = [];
  const lines = rawText.split('\n');
  const prices: number[] = [];
  const itemLines: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    const priceMatch = trimmed.match(/(\$[\d,]+\.?\d*)/);
    const price = priceMatch ? parseFloat(priceMatch[1].replace(/,/g, '')) : null;

    if (price && trimmed.length > 10) {
      prices.push(price);
      itemLines.push(trimmed);
    }
  }

  for (let i = 0; i < itemLines.length; i++) {
    items.push({
      name: itemLines[i],
      unitPrice: prices[i] || 0,
      totalPrice: prices[i] || 0,
      quantity: 1,
      category: '',
      categoryConfidence: 0,
    });
  }

  const totalMatch = rawText.match(/\$[\d,]+\.\d+/);
  const total = totalMatch ? parseFloat(totalMatch[0].replace(/,/g, '')) : (prices.length > 0 ? prices.reduce((a, b) => a + b, 0) : 0);

  const taxMatch = rawText.match(/(?:tax|taxes):?\s*\$[\d,]+\.\d+/i);
  const tax = taxMatch ? parseFloat(taxMatch[0].split('$')[1].replace(/,/g, '')) : 0;
  const subtotal = total - tax;

  const confidence = prices.length > 0 ? Math.min(1, prices.length * 0.15) : 0.5;

  return {
    items,
    storeName,
    date,
    subtotal,
    tax,
    total,
    confidence,
    imageUrl,
  };
};

export const clientOCR = async (imageFile: File): Promise<ReceiptOCRResult> => {
  return new Promise((resolve, reject) => {
    const worker = Tesseract.recognize(
      imageFile,
      'eng',
      { logger: (p: unknown) => console.log(p) }
    );

    worker.on('recognize', (progress: unknown) => {
      const p = progress as { percent?: number };
      console.log(`OCR progress: ${p.percent ?? 0}%`);
    });

    worker.on('end', () => {
      const { data: { text } } = worker as unknown as { data: { text: string } };
      const imageUrl = URL.createObjectURL(imageFile);
      const result = parseOCRResult(text, imageUrl);
      resolve(result);
    });

    worker.on('error', (error: unknown) => {
      reject(error);
    });
  });
};
