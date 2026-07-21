import React, { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { formatCurrency } from '@/utils/formatCurrency';
import { Card, Button, EmptyState, Spinner, Badge } from '@/components/ui';

const API_BASE = 'http://localhost:3001';

interface SessionItem {
  id: string;
  name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

interface PurchaseSession {
  id: string;
  name: string;
  store_name: string;
  total_amount: number;
  created_at: string;
  user_name?: string;
  items: SessionItem[];
}

const PurchaseHistoryPage: React.FC = () => {
  const { user } = useStore();
  const [sessions, setSessions] = useState<PurchaseSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    const fetchSessions = async () => {
      if (!user?.id) { setLoading(false); return; }
      try {
        const res = await fetch(`${API_BASE}/api/purchase-sessions/user/${user.id}`);
        if (res.ok) {
          const data = await res.json();
          setSessions(data.sessions || []);
        }
      } catch (err) {
        console.error('Error fetching purchase sessions:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSessions();
  }, [user?.id]);

  const totalSpent = sessions.reduce((sum, s) => sum + (s.total_amount || 0), 0);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <EmptyState title="Please Log In" description="Log in to view purchase history" icon="🛍️" actionLabel="Go to Login" onAction={() => window.location.href = '/login'} />
      </div>
    );
  }

  if (loading) return <div className="flex justify-center py-12"><Spinner /></div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Purchase History</h1>
            <p className="text-gray-500 mt-1">{sessions.length} purchases · {formatCurrency(totalSpent)} total</p>
          </div>
        </div>

        {sessions.length === 0 ? (
          <Card>
            <EmptyState title="No Purchases Yet" description="Complete a shopping session to see your purchase history" icon="🛍️" />
          </Card>
        ) : (
          <div className="space-y-3">
            {sessions.map((session) => {
              const storeName = (session.name || '').replace('Purchase - ', '');
              const isExpanded = expandedId === session.id;
              return (
                <Card key={session.id} className="overflow-hidden">
                  <button onClick={() => setExpandedId(isExpanded ? null : session.id)} className="w-full text-left p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-lg">🏪</div>
                      <div>
                        <p className="font-semibold text-gray-800">{storeName || 'Unknown Store'}</p>
                        <p className="text-sm text-gray-500">{new Date(session.created_at).toLocaleDateString()} · {session.items?.length || 0} items</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-bold text-green-600">{formatCurrency(session.total_amount || 0)}</span>
                      <span className="text-gray-400">{isExpanded ? '▲' : '▼'}</span>
                    </div>
                  </button>
                  {isExpanded && session.items && (
                    <div className="border-t border-gray-100 px-4 py-3 bg-gray-50">
                      <table className="w-full text-sm">
                        <thead><tr className="text-gray-500 border-b border-gray-200"><th className="text-left pb-2 font-medium">Item</th><th className="text-right pb-2 font-medium">Qty</th><th className="text-right pb-2 font-medium">Price</th><th className="text-right pb-2 font-medium">Total</th></tr></thead>
                        <tbody>
                          {session.items.map((item) => (
                            <tr key={item.id} className="border-b border-gray-100 last:border-0">
                              <td className="py-2 text-gray-800">{item.name}</td>
                              <td className="py-2 text-right text-gray-600">{item.quantity}</td>
                              <td className="py-2 text-right text-gray-600">{formatCurrency(item.unit_price)}</td>
                              <td className="py-2 text-right font-medium">{formatCurrency(item.total_price)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export { PurchaseHistoryPage };
