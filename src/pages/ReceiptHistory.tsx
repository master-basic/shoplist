import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getUserReceipts, deleteReceipt } from '@/api/receipts';
import { useAuth } from '@/hooks/useAuth';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import type { ReceiptFile } from '@/types';

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

function formatCurrency(amount?: number, currency = 'AZN'): string {
  if (amount == null) return '—';
  return `${amount.toFixed(2)} ${currency}`;
}

function getReceiptStatusColor(status?: string): string {
  switch (status) {
    case 'completed':
      return 'success';
    case 'processing':
    case 'pending':
      return 'warning';
    case 'failed':
      return 'error';
    default:
      return 'neutral';
  }
}

function getReceiptStatusLabel(status?: string): string {
  switch (status) {
    case 'completed':
      return 'Completed';
    case 'processing':
      return 'Processing';
    case 'pending':
      return 'Pending';
    case 'failed':
      return 'Failed';
    default:
      return 'Unknown';
  }
}

export const ReceiptHistoryPage: React.FC = () => {
  const [receipts, setReceipts] = useState<ReceiptFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [filterStore, setFilterStore] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const auth = useAuth();
  const navigate = useNavigate();

  const loadReceipts = useCallback(async () => {
    if (!auth.user?.id) return;
    setLoading(true);
    try {
      const data = await getUserReceipts(auth.user.id);
      setReceipts(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load receipts';
      setNotification({ type: 'error', message });
    } finally {
      setLoading(false);
    }
  }, [auth.user?.id]);

  useEffect(() => {
    loadReceipts();
  }, [loadReceipts]);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleDelete = async (receiptId: string) => {
    setDeletingId(receiptId);
    try {
      await deleteReceipt(receiptId);
      setReceipts((prev) => prev.filter((r) => r.id !== receiptId));
      setShowDeleteConfirm(null);
      setNotification({ type: 'success', message: 'Receipt deleted successfully' });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete receipt';
      setNotification({ type: 'error', message });
    } finally {
      setDeletingId(null);
    }
  };

  const filteredReceipts = receipts.filter((r) => {
    if (searchQuery && !(r.id || '').toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (dateFrom) {
      const receiptDate = new Date(r.created_at || '');
      const from = new Date(dateFrom);
      if (receiptDate < from) return false;
    }
    if (dateTo) {
      const receiptDate = new Date(r.created_at || '');
      const to = new Date(dateTo);
      if (receiptDate > to) return false;
    }
    if (filterStore) {
      return true;
    }
    return true;
  });

  const totalSpending = filteredReceipts.reduce((sum, r) => sum + (r.total_amount || 0), 0);
  const uniqueStores = new Set(filteredReceipts.map((r) => (r.name || '')).filter(Boolean)).size;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Receipt History</h1>
          <p className="text-gray-600 mt-1">View and manage all your scanned receipts</p>
        </div>
        <Link to="/scan">
          <Button variant="primary">
            <span>📷</span>
            New Scan
          </Button>
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <div className="text-sm text-blue-600 font-medium">Total Receipts</div>
          <div className="text-2xl font-bold text-blue-900 mt-1">{filteredReceipts.length}</div>
        </Card>
        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <div className="text-sm text-green-600 font-medium">Total Spending</div>
          <div className="text-2xl font-bold text-green-900 mt-1">{formatCurrency(totalSpending)}</div>
        </Card>
        <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
          <div className="text-sm text-purple-600 font-medium">Stores</div>
          <div className="text-2xl font-bold text-purple-900 mt-1">{uniqueStores}</div>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input
              type="text"
              placeholder="Search by receipt ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Notification */}
      {notification && (
        <div className={`p-4 rounded-lg ${notification.type === 'success' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'} border`}>
          <p className={`text-sm font-medium ${notification.type === 'success' ? 'text-green-800' : 'text-red-800'}`}>
            {notification.message}
          </p>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="text-center py-12">
          <div className="text-2xl text-gray-400">⏳</div>
          <p className="text-gray-500 mt-2">Loading receipts...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredReceipts.length === 0 && (
        <Card className="text-center py-12">
          <div className="text-4xl text-gray-300">🧾</div>
          <p className="text-gray-500 mt-4">No receipts found</p>
          <p className="text-gray-400 text-sm mt-1">
            {searchQuery || dateFrom || dateTo ? 'Try adjusting your filters' : 'Start by scanning a receipt'}
          </p>
          {!searchQuery && !dateFrom && !dateTo && (
            <Link to="/scan">
              <Button variant="primary" className="mt-4">
                <span>📷</span>
                Scan Receipt
              </Button>
            </Link>
          )}
        </Card>
      )}

      {/* Receipt List */}
      {!loading && filteredReceipts.length > 0 && (
        <div className="space-y-3">
          {filteredReceipts.map((receipt) => (
            <Card key={receipt.id} className="flex items-center justify-between hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4 flex-1 min-w-0">
                {/* Receipt Thumbnail */}
                <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  {receipt.image_url ? (
                    <img
                      src={receipt.image_url}
                      alt="Receipt"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                        (e.target as HTMLImageElement).parentElement!.innerHTML = '<div class="w-full h-full flex items-center justify-center text-2xl">🧾</div>';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl">🧾</div>
                  )}
                </div>

                {/* Receipt Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-gray-900 truncate">
                      Receipt
                    </h3>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {formatDate(receipt.created_at)}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    ID: {receipt.id?.slice(0, 8)}...
                  </div>
                </div>
              </div>

              {/* Right Side */}
              <div className="flex items-center gap-3 ml-4">
                <div className="text-right">
                  <div className="text-sm font-bold text-gray-900">
                    {formatCurrency(receipt.total_amount)}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Link to={`/scan`} onClick={() => navigate(`/receipts/${receipt.id}`)}>
                    <Button variant="outline" size="sm" className="gap-1">
                      <span>👁️</span>
                    </Button>
                  </Link>
                  {showDeleteConfirm === receipt.id ? (
                    <div className="flex items-center gap-1">
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(receipt.id)}
                        disabled={deletingId === receipt.id}
                      >
                        {deletingId === receipt.id ? '⏳' : '✓'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowDeleteConfirm(null)}
                      >
                        ✕
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => setShowDeleteConfirm(receipt.id)}
                    >
                      🗑️
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
