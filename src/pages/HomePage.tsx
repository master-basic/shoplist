import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { SkeletonCard } from '../components/Skeleton';
import { useStore } from '../store/useStore';
import { getUserLists } from '../api/lists';
import { API_BASE } from '@/config';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
  href?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, href }) => (
  <Link to={href || '/lists'} className="group">
    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-800 mt-2">{value}</p>
        </div>
        <div className="text-4xl">{icon}</div>
      </div>
    </Card>
  </Link>
);

export const HomePage: React.FC = () => {
  const { user, lists, addList, currentHouseholdId, setCurrentHouseholdId } = useStore();
  const [loading, setLoading] = useState(true);
  const [householdName, setHouseholdName] = useState('');
  const [totalSpent, setTotalSpent] = useState(0);
  const [favoriteStore, setFavoriteStore] = useState('');
  const [purchaseCount, setPurchaseCount] = useState(0);
  const [activeHouseholds, setActiveHouseholds] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user?.id) { setLoading(false); return; }
        const fetchedLists = await getUserLists(user.id);
        for (const list of fetchedLists) {
          const existing = lists.find((l) => l.id === list.id);
          if (!existing) addList(list);
        }
        const hhRes = await fetch(`${API_BASE}/api/auth/user/${user.id}/households`);
        if (hhRes.ok) {
          const hhData = await hhRes.json();
          setActiveHouseholds(hhData.households || []);
          if (hhData.households?.length > 0 && !currentHouseholdId) {
            setCurrentHouseholdId(hhData.households[0].id);
            setHouseholdName(hhData.households[0].name);
          } else if (currentHouseholdId) {
            const cur = hhData.households?.find((h: any) => h.id === currentHouseholdId);
            if (cur) setHouseholdName(cur.name);
          }
        }
        const psRes = await fetch(`${API_BASE}/api/purchase-sessions/user/${user.id}`);
        if (psRes.ok) {
          const psData = await psRes.json();
          const sessions = psData.sessions || [];
          setPurchaseCount(sessions.length);
          const total = sessions.reduce((s: number, session: any) => s + parseFloat(session.total_amount || '0'), 0);
          setTotalSpent(total);
          const storeCounts: Record<string, number> = {};
          sessions.forEach((s: any) => {
            const name = s.name?.replace(/^Purchase - /, '') || 'Unknown';
            storeCounts[name] = (storeCounts[name] || 0) + 1;
          });
          const topStore = Object.entries(storeCounts).sort((a: any, b: any) => b[1] - a[1])[0];
          if (topStore) setFavoriteStore(topStore[0] as string);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user?.id]);

  const activeLists = lists.filter((l) => l.status === 'active' && l.household_id === currentHouseholdId);
  const pendingItems = activeLists.reduce((sum, list) => sum + (list.items?.filter((i) => !i.is_checked).length || 0), 0);
  const completedItems = activeLists.reduce((sum, list) => sum + (list.items?.filter((i) => i.is_checked).length || 0), 0);
  const recentLists = activeLists.slice(0, 5);

  if (loading) {
    return <div className="grid grid-cols-1 md:grid-cols-3 gap-6"><SkeletonCard /><SkeletonCard /><SkeletonCard /></div>;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Welcome back{user?.name ? `, ${user.name}` : ''}!
        </h1>
        <div className="flex items-center gap-2 text-gray-600">
          <span>🏠</span>
          <span>{householdName || (activeHouseholds.length > 0 ? 'Click to select household' : 'No household yet')}</span>
          {activeHouseholds.length > 1 && (
            <Link to="/household" className="text-sm text-green-600 hover:underline ml-2">Switch</Link>
          )}
          {!householdName && activeHouseholds.length === 0 && (
            <Link to="/household" className="text-sm text-green-600 hover:underline ml-2">Create one</Link>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Active Lists" value={activeLists.length} icon="🛒" href="/lists" />
        <StatCard title="Pending Items" value={pendingItems} icon="⏳" href="/shopping" />
        <StatCard title="Total Spent" value={`${totalSpent.toFixed(2)} AZN`} icon="💰" href="/purchases" />
        <StatCard title="Items Completed" value={completedItems} icon="✅" href="/shopping" />
      </div>

      {favoriteStore && (
        <Card className="p-4 mb-6 bg-green-50 border-green-200">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🏪</span>
            <div>
              <p className="text-sm text-gray-600">Favorite Store</p>
              <p className="font-semibold text-gray-800">{favoriteStore}</p>
            </div>
            <span className="ml-auto text-sm text-gray-500">{purchaseCount} purchase(s)</span>
          </div>
        </Card>
      )}

      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link to="/lists" className="block">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <div className="flex items-center gap-4">
                <span className="text-3xl">➕</span>
                <div>
                  <h3 className="font-medium text-gray-800">Create New List</h3>
                  <p className="text-sm text-gray-600">Start a new shopping list</p>
                </div>
              </div>
            </Card>
          </Link>
          <Link to="/scan" className="block">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <div className="flex items-center gap-4">
                <span className="text-3xl">📷</span>
                <div>
                  <h3 className="font-medium text-gray-800">Scan Receipt</h3>
                  <p className="text-sm text-gray-600">Track purchases automatically</p>
                </div>
              </div>
            </Card>
          </Link>
          <Link to="/reports" className="block">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <div className="flex items-center gap-4">
                <span className="text-3xl">📊</span>
                <div>
                  <h3 className="font-medium text-gray-800">View Reports</h3>
                  <p className="text-sm text-gray-600">See spending insights</p>
                </div>
              </div>
            </Card>
          </Link>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Active Shopping Lists</h2>
          <Link to="/lists" className="text-green-600 hover:text-green-700 text-sm font-medium">View All →</Link>
        </div>
        {recentLists.length === 0 ? (
          <Card>
            <div className="text-center py-8">
              <p className="text-gray-500 mb-2">No active lists yet</p>
              <Link to="/lists" className="text-green-600 hover:text-green-700 font-medium">Create your first list →</Link>
            </div>
          </Card>
        ) : (
          <div className="space-y-3">
            {recentLists.map((list) => {
              const itemCount = list.items?.length || 0;
              const completedCount = list.items?.filter((i) => i.is_checked).length || 0;
              return (
                <Link key={list.id} to={`/list/${list.id}`}>
                  <Card>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <span className="text-2xl">🛒</span>
                        <div>
                          <h3 className="font-medium text-gray-800">{list.name}</h3>
                          <p className="text-sm text-gray-600">{completedCount}/{itemCount} items</p>
                        </div>
                      </div>
                      <Badge variant={completedCount === itemCount && itemCount > 0 ? 'success' : 'primary'}>
                        {completedCount === itemCount && itemCount > 0 ? 'Done' : `${Math.round((completedCount / Math.max(itemCount, 1)) * 100)}%`}
                      </Badge>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
