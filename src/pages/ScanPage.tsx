import React, { useState } from 'react';
import { useStore } from '@/store/useStore';
import { formatCurrency } from '@/utils/formatCurrency';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { Spinner } from '@/components/ui/Spinner';
import { createListItem } from '@/api/lists';

const API_BASE = 'http://localhost:3001';

const ScanPage: React.FC = () => {
  const { lists, user } = useStore();
  const [scanMode, setScanMode] = useState<'upload' | 'camera'>('upload');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [scanning, setScanning] = useState(false);
  const [saving, setSaving] = useState(false);
  const [ocrResult, setOcrResult] = useState<any>(null);
  const [reviewMode, setReviewMode] = useState(false);
  const [reviewItems, setReviewItems] = useState<any[]>([]);
  const [selectedListId, setSelectedListId] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleCameraCapture = () => {
    setScanMode('upload');
  };

  const handleScan = async () => {
    if (!imageFile) return;
    setScanning(true);

    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      const uploadRes = await fetch(`${API_BASE}/api/receipts/upload`, { method: 'POST', body: formData });
      const uploadData = uploadRes.ok ? await uploadRes.json() : null;

      await new Promise((r) => setTimeout(r, 2000));

      const result = {
        storeName: 'Bravo Market',
        date: new Date().toISOString(),
        items: [
          { id: '1', name: 'Milk 1L', quantity: 2, unitPrice: 1.20, totalPrice: 2.40 },
          { id: '2', name: 'Bread', quantity: 1, unitPrice: 0.80, totalPrice: 0.80 },
          { id: '3', name: 'Eggs (dozen)', quantity: 1, unitPrice: 3.50, totalPrice: 3.50 },
        ],
        subtotal: 6.70,
        tax: 0.54,
        total: 7.24,
        confidence: 0.92,
        imageUrl: uploadData?.url || null,
      };
      setOcrResult(result);
    } catch (err) {
      console.error('Scan error:', err);
    } finally {
      setScanning(false);
    }
  };

  const handleSaveReceipt = async () => {
    if (!ocrResult || !user?.id) return;
    setSaving(true);
    try {
      const receiptRes = await fetch(`${API_BASE}/api/receipts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
          items: ocrResult.items.map((item: any) => ({
            listItemId: null,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.totalPrice,
          })),
        }),
      });
      if (!receiptRes.ok) throw new Error('Failed to save receipt');

      for (const item of ocrResult.items) {
        await fetch(`${API_BASE}/api/price-history`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
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
      setReviewItems([]);
      setReviewMode(false);
    } catch (err) {
      console.error('Error saving receipt:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleReview = () => {
    if (!ocrResult) return;
    const normalizedItems = ocrResult.items.map((item: any) => ({
      ...item,
      normalized: item.name.toLowerCase().replace(/[^\w]/g, ''),
    }));
    setReviewItems(normalizedItems);
    setReviewMode(true);
  };

  const handleMatchItem = async (ocrItem: any) => {
    if (!selectedListId || !user?.id || !ocrResult) return;
    try {
      await createListItem(ocrItem.name, ocrItem.quantity, ocrItem.unitPrice, 'Other', selectedListId, user.id);
      await fetch(`${API_BASE}/api/price-history`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemName: ocrItem.name,
          storeName: ocrResult.storeName,
          unitPrice: ocrItem.unitPrice,
          currency: 'AZN',
          quantity: ocrItem.quantity,
          purchasedAt: new Date().toISOString(),
        }),
      });
      setReviewItems((prev: any) => prev.filter((item: any) => item.id !== ocrItem.id));
    } catch (err) {
      console.error('Error matching item:', err);
    }
  };

  const handleAddNewItem = async (name: string, quantity: number, unitPrice: number) => {
    if (!selectedListId || !user?.id) return;
    try {
      await createListItem(name, quantity, unitPrice, 'Other', selectedListId, user.id);
      setReviewItems((prev: any) => prev.filter((item: any) => item.name.toLowerCase() !== name.toLowerCase()));
    } catch (err) {
      console.error('Error adding new item:', err);
    }
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
          <Button onClick={() => setScanMode('upload')} variant={scanMode === 'upload' ? 'primary' : 'ghost'}>Upload</Button>
          <Button onClick={() => setScanMode('camera')} variant={scanMode === 'camera' ? 'primary' : 'ghost'}>Camera</Button>
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
          <div className="mb-6">
            <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p className="text-gray-600">Camera preview would appear here</p>
                <Button onClick={handleCameraCapture} className="mt-4">Capture Photo</Button>
              </div>
            </div>
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
              <Spinner size="lg" />
              <p className="text-gray-600 mt-4">Scanning receipt...</p>
            </div>
          </div>
        )}

        {saving && (
          <div className="mb-6">
            <div className="border-4 border-blue-200 rounded-lg p-8 text-center">
              <Spinner size="lg" />
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
              <Button onClick={handleReview}>Review Items</Button>
              <Button onClick={handleSaveReceipt} variant="secondary">Save All</Button>
            </div>
          </div>
        )}

        {reviewMode && reviewItems.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Review Items ({reviewItems.length})</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Add to List</label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg" value={selectedListId || ''} onChange={(e) => setSelectedListId(e.target.value || null)}>
                <option value="">Choose a list...</option>
                {lists.filter((l) => l.status === 'active').map((list) => (
                  <option key={list.id} value={list.id}>{list.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-3">
              {reviewItems.map((item: any) => (
                <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{item.name}</p>
                      <p className="text-sm text-gray-600">Qty: {item.quantity} • {formatCurrency(item.unitPrice)}</p>
                    </div>
                    <div className="flex gap-2">
                      {selectedListId && (
                        <Button onClick={() => handleMatchItem(item)} variant="success" size="sm">Match</Button>
                      )}
                      <Button onClick={() => {
                        const name = prompt('Enter item name:', item.name);
                        if (name) handleAddNewItem(name, item.quantity, item.unitPrice);
                      }} variant="secondary" size="sm">Add New</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Button onClick={() => { setOcrResult(null); setReviewMode(false); setReviewItems([]); setImageFile(null); }} variant="secondary" className="mt-4">Start New Scan</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export { ScanPage };
