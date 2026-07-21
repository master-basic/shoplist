import React, { useState } from 'react';
import { useStore } from '@/store/useStore';
import { formatCurrency } from '@/utils/formatCurrency';
import { Button } from '@/components/ui/Button';

import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/Skeleton';
import { API_BASE } from '@/config';
import { authHeaders } from '@/api/client';
import { createListItem } from '@/api/lists';
import { useLogRender } from '@/hooks/useLogRender';
import { ScanReview } from '@/components/ScanReview';
import type { OCRItem } from '@/components/ScanReview';

const ScanPage: React.FC = () => {
  useLogRender('ScanPage');
  const { lists, user } = useStore();
  const [scanMode, setScanMode] = useState<'upload' | 'camera'>('upload');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [scanning, setScanning] = useState(false);
  const [saving, setSaving] = useState(false);
  const [ocrResult, setOcrResult] = useState<any>(null);
  const [reviewMode, setReviewMode] = useState(false);
  const [selectedListId, setSelectedListId] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleScan = async () => {
    if (!imageFile) return;
    setScanning(true);

    try {
      const formData = new FormData();
      formData.append('image', imageFile);

      const token = localStorage.getItem('auth_token');
      const authHeader = token ? { Authorization: `Bearer ${token}` } : {};
      const ocrRes = await fetch(`${API_BASE}/api/receipts/ocr`, {
        method: 'POST',
        headers: authHeader,
        body: formData
      });

      if (!ocrRes.ok) throw new Error('OCR processing failed');

      const ocrData = await ocrRes.json();
      setOcrResult(ocrData.ocrResult);
    } catch (err) {
      console.error('Scan error:', err);
    } finally {
      setScanning(false);
    }
  };

  const handleSaveReceipt = async (itemsOverride?: OCRItem[]) => {
    const items = itemsOverride ?? ocrResult?.items ?? [];
    if (!ocrResult || !user?.id) return;
    setSaving(true);
    try {
      const receiptRes = await fetch(`${API_BASE}/api/receipts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify({
          userId: user.id,
          householdId: null,
          listId: selectedListId,
          name: `Receipt - ${ocrResult.storeName} - ${new Date().toLocaleDateString()}`,
          totalAmount: ocrResult.total,
          currency: 'AZN',
          imageUrl: ocrResult.imageUrl,
          ocrData: ocrResult,
          status: 'processed',
          items: items.map((item: OCRItem) => ({
            listItemId: null,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.totalPrice,
          })),
        }),
      });
      if (!receiptRes.ok) throw new Error('Failed to save receipt');

      for (const item of items) {
        await fetch(`${API_BASE}/api/price-history`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...authHeaders() },
          body: JSON.stringify({
            itemName: item.name,
            storeName: ocrResult.storeName,
            unitPrice: item.unitPrice,
            currency: 'AZN',
            quantity: item.quantity,
            purchasedAt: new Date().toISOString(),
          }),
        });

        if (selectedListId) {
          try {
            await createListItem(item.name, item.quantity, item.unitPrice, 'Other', selectedListId, user.id);
          } catch (e) {
            console.error('Error adding item to list:', e);
          }
        }
      }

      setOcrResult(null);
      setImageFile(null);
      setReviewMode(false);
      setSelectedListId(null);
    } catch (err) {
      console.error('Error saving receipt:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveReview = (editedItems: OCRItem[]) => {
    handleSaveReceipt(editedItems);
  };

  const handleDiscardReview = () => {
    setOcrResult(null);
    setImageFile(null);
    setReviewMode(false);
    setSelectedListId(null);
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <EmptyState title="Please Log In" description="Log in to scan receipts" icon="📷" actionLabel="Go to Login" onAction={() => window.location.href = '/login'} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Receipt Scanner</h1>

        <div className="flex gap-4 mb-6">
          <Button onClick={() => setScanMode('upload')} variant={scanMode === 'upload' ? 'primary' : 'outline'}>Upload</Button>
          <Button onClick={() => setScanMode('camera')} variant={scanMode === 'camera' ? 'primary' : 'outline'} className="flex items-center gap-2">📷 Camera</Button>
        </div>

        {scanMode === 'upload' && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Upload Receipt Image</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <input type="file" accept="image/*,.pdf" onChange={handleFileUpload}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100" />
              <p className="text-sm text-gray-500 mt-2">Supports JPG, PNG, and PDF</p>
            </div>
          </div>
        )}

        {scanMode === 'camera' && (
          <div className="mt-4">
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileUpload}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
            />
            <p className="text-xs text-gray-400 mt-1">Point camera at receipt</p>
          </div>
        )}

        {!ocrResult && !scanning && (
          <div className="mb-6">
            <Button onClick={handleScan} disabled={!imageFile}>Scan Receipt</Button>
          </div>
        )}

        {scanning && (
          <div className="mb-6">
            <div className="border-4 border-green-200 rounded-lg p-8 text-center">
              <Skeleton className="h-12 w-12" />
              <p className="text-gray-600 mt-4">Scanning receipt...</p>
            </div>
          </div>
        )}

        {saving && (
          <div className="mb-6">
            <div className="border-4 border-blue-200 rounded-lg p-8 text-center">
              <Skeleton className="h-12 w-12" />
              <p className="text-gray-600 mt-4">Saving to database...</p>
            </div>
          </div>
        )}

        {ocrResult && !reviewMode && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Scan Results</h2>
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <p className="text-sm text-gray-600">Store: <span className="font-medium text-gray-800">{ocrResult.storeName}</span></p>
              <p className="text-sm text-gray-600">Date: <span className="font-medium text-gray-800">{new Date(ocrResult.date).toLocaleDateString()}</span></p>
              <p className="text-sm text-gray-600">Confidence: <span className="font-medium text-gray-800">{(ocrResult.confidence * 100).toFixed(0)}%</span></p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="flex justify-between mb-2"><span className="text-gray-600">Subtotal:</span><span className="font-medium">{formatCurrency(ocrResult.subtotal)}</span></div>
              <div className="flex justify-between mb-2"><span className="text-gray-600">Tax:</span><span className="font-medium">{formatCurrency(ocrResult.tax)}</span></div>
              <div className="flex justify-between border-t pt-2"><span className="font-medium">Total:</span><span className="font-bold text-green-600">{formatCurrency(ocrResult.total)}</span></div>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => setReviewMode(true)}>Review Items</Button>
              <Button onClick={() => handleSaveReceipt()} variant="secondary">Save All</Button>
            </div>
          </div>
        )}

        {reviewMode && ocrResult && (
          <div className="mb-6">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Add to List</label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg" value={selectedListId || ''} onChange={(e) => setSelectedListId(e.target.value || null)}>
                <option value="">Choose a list...</option>
                {lists.filter((l) => l.status === 'active').map((list) => (
                  <option key={list.id} value={list.id}>{list.name}</option>
                ))}
              </select>
            </div>
            <ScanReview
              items={ocrResult.items.map((item: any) => ({
                name: item.name,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                totalPrice: item.totalPrice,
              }))}
              storeName={ocrResult.storeName}
              onSave={handleSaveReview}
              onDiscard={handleDiscardReview}
              isLoading={saving}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export { ScanPage };
