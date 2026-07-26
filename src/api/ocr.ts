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
    const line = line.trim();
    if (!line) continue;

    const priceMatch = line.match(/(\$[\d,]+\.?\d*)/);
    const price = priceMatch ? parseFloat(priceMatch[1].replace(/,/g, '')) : null;

    if (price && line.length > 10) {
      prices.push(price);
      itemLines.push(line);
    }
  }

  for (let i = 0; i < itemLines.length; i++) {
    items.push({
      id: crypto.randomUUID(),
      name: itemLines[i],
      price: prices[i] || 0,
      quantity: 1,
      unit: '',
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
      { logger: (progress) => console.log(progress) }
    );

    worker.on('recognize', (progress) => {
      console.log(`OCR progress: ${progress.percent}%`);
    });

    worker.on('end', () => {
      const { data: { text } } = worker;
      const imageUrl = URL.createObjectURL(imageFile);
      const result = parseOCRResult(text, imageUrl);
      resolve(result);
    });

    worker.on('error', (error) => {
      reject(error);
    });
  });
};
