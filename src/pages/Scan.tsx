import React, { useState, useEffect } from 'react';
import { useStore } from '@store/useStore';
import { formatCurrency } from '@utils/formatCurrency';

const Scan: React.FC = () => {
  const { 
    addPriceHistory, 
    addPurchaseSession, 
    addPurchasedItem, 
    addItemToList,
    lists,
    user
  } = useStore();
  
  const [scanMode, setScanMode] = useState<'upload' | 'camera'>('upload');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [scanning, setScanning] = useState(false);
  const [ocrResult, setOcrResult] = useState<any>(null);
  const [reviewItems, setReviewItems] = useState<any[]>([]);
  const [selectedListId, setSelectedListId] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleCameraCapture = () => {
    // In a real app, this would use the device camera
    // For demo, we'll simulate with a file input
    setScanMode('upload');
  };

  const handleScan = () => {
    if (!imageFile) return;
    setScanning(true);
    
    // Simulate OCR processing
    setTimeout(() => {
      setOcrResult({
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
      });
      setScanning(false);
    }, 2000);
  };

  const handleReview = () => {
    if (!ocrResult) return;
    
    // Normalize items for fuzzy matching
    const normalizedItems = ocrResult.items.map((item: any) => ({
      ...item,
      normalized: item.name.toLowerCase().replace(/[^\w]/g, ''),
    }));
    
    setReviewItems(normalizedItems);
  };

  const handleMatchItem = (ocrItem: any, listItemId: string) => {
    // Find matching list item
    const list = lists.find((l) => l.id === selectedListId);
    if (!list) return;
    
    const listItem = list.items.find((i) => i.id === listItemId);
    if (!listItem) return;
    
    // Create session first (we need its id)
    const newSession: any = {
      id: 'temp-' + Date.now(),
      list_id: list.id,
      bought_by: user?.id || '',
      store_name: ocrResult.storeName,
      purchase_date: new Date().toISOString(),
      total_paid: ocrResult.total,
      items: [],
      created_at: new Date().toISOString(),
    };
    
    // Add to price history
    addPriceHistory({
      id: `temp-${Date.now()}`,
      item_name: listItem.name,
      store_name: ocrResult.storeName,
      unit_price: ocrItem.unitPrice,
      purchased_at: new Date().toISOString(),
      session_id: newSession.id,
      bought_by: user?.id || '',
      quantity: ocrItem.quantity,
    });
    
    // Add to purchase session
    addPurchaseSession(newSession);
    
    // Add purchased item
    addPurchasedItem(newSession.id, {
      list_item_id: listItemId,
      name: listItem.name,
      quantity: ocrItem.quantity,
      unit: 'pcs',
      unit_price: ocrItem.unitPrice,
      total_price: ocrItem.totalPrice,
      is_on_list: true,
      session_id: newSession.id,
      created_at: new Date().toISOString(),
    });
    
    // Remove from review
    setReviewItems((prev) => prev.filter((item) => item.id !== ocrItem.id));
  };

  const handleAddNewItem = (name: string, quantity: number, unitPrice: number) => {
    // Add as new item to a list
    const list = lists.find((l) => l.id === selectedListId);
    if (!list) return;
    
    addItemToList(selectedListId!, {
      name,
      quantity,
      unit: 'pcs',
      category: 'Other',
      estimatedPrice: unitPrice,
      preferredStore: ocrResult?.storeName,
      notes: 'Added from receipt',
      isChecked: false,
    } as Omit<any, 'id'>);
    
    setReviewItems((prev) => prev.filter((item) => item.name.toLowerCase() !== name.toLowerCase()));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Receipt Scanner</h1>
          
          {/* Mode Selection */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setScanMode('upload')}
              className={`flex-1 px-4 py-3 rounded-lg border-2 transition-colors ${
                scanMode === 'upload'
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              Upload
            </button>
            <button
              onClick={() => setScanMode('camera')}
              className={`flex-1 px-4 py-3 rounded-lg border-2 transition-colors ${
                scanMode === 'camera'
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              Camera
            </button>
          </div>

          {/* Upload Mode */}
          {scanMode === 'upload' && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Upload Receipt Image</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileUpload}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-green-50 file:text-green-700
                    hover:file:bg-green-100"
                />
                <p className="text-sm text-gray-500 mt-2">
                  Supports JPG, PNG, and PDF
                </p>
              </div>
            </div>
          )}

          {/* Camera Mode */}
          {scanMode === 'camera' && (
            <div className="mb-6">
              <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <p className="text-gray-600">Camera preview would appear here</p>
                  <button
                    onClick={handleCameraCapture}
                    className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Capture Photo
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Process Button */}
          {!ocrResult && !scanning && (
            <div className="mb-6">
              <button
                onClick={handleScan}
                disabled={!imageFile}
                className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Scan Receipt
              </button>
            </div>
          )}

          {/* Scanning State */}
          {scanning && (
            <div className="mb-6">
              <div className="border-4 border-green-200 rounded-lg p-8 text-center">
                <div className="animate-spin w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-gray-600">Scanning receipt...</p>
              </div>
            </div>
          )}

          {/* OCR Result */}
          {ocrResult && !reviewItems.length && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Scan Results</h2>
              
              {/* Store Info */}
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <p className="text-sm text-gray-600">Store: <span className="font-medium text-gray-800">{ocrResult.storeName}</span></p>
                <p className="text-sm text-gray-600">Date: <span className="font-medium text-gray-800">{new Date(ocrResult.date).toLocaleDateString()}</span></p>
              </div>

              {/* Items Summary */}
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">{formatCurrency(ocrResult.subtotal)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Tax:</span>
                  <span className="font-medium">{formatCurrency(ocrResult.tax)}</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="font-medium">Total:</span>
                  <span className="font-bold text-green-600">{formatCurrency(ocrResult.total)}</span>
                </div>
              </div>

              <button
                onClick={handleReview}
                className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Review Items
              </button>
            </div>
          )}

          {/* Review Items */}
          {reviewItems.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Review Items ({reviewItems.length})</h2>
              
              {/* List Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Add to List</label>
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  value={selectedListId || ''}
                  onChange={(e) => setSelectedListId(e.target.value || null)}
                >
                  <option value="">Choose a list...</option>
                  {lists
                    .filter((l) => l.status === 'active')
                    .map((list) => (
                      <option key={list.id} value={list.id}>{list.name}</option>
                    ))}
                </select>
              </div>

              {/* Items List */}
              <div className="space-y-3">
                {reviewItems.map((item) => (
                  <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">{item.name}</p>
                        <p className="text-sm text-gray-600">
                          Qty: {item.quantity} • {formatCurrency(item.unitPrice)}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        {selectedListId && (
                          <button
                            onClick={() => handleMatchItem(item, selectedListId)}
                            className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                          >
                            Match
                          </button>
                        )}
                        <button
                          onClick={() => {
                            const name = prompt('Enter item name:');
                            if (name) {
                              handleAddNewItem(name, item.quantity, item.unitPrice);
                            }
                          }}
                          className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700"
                        >
                          Add New
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setReviewItems([])}
                className="w-full mt-4 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Start New Scan
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Scan;