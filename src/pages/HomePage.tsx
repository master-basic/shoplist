import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Spinner } from '../components/ui/Spinner';
import { useStore } from '../store/useStore';
import { getUserLists } from '../api/lists';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
  trend?: string;
  trendUp?: boolean;
  href?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  trend,
  trendUp,
  href,
}) => (
  <Link to={href || '/lists'} className="group">
    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-800 mt-2">{value}</p>
          {trend && (
            <p className={`text-sm mt-1 ${trendUp ? 'text-green-600' : 'text-red-600'}`}>
              {trend}
            </p>
          )}
        </div>
        <div className="text-4xl">{icon}</div>
      </div>
    </Card>
  </Link>
);

export const HomePage: React.FC = () => {
  const { user, lists, addList } = useStore();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    activeLists: 0,
    pendingItems: 0,
    totalSpent: 0,
    completedItems: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user?.id) {
          const fetchedLists = await getUserLists(user.id);
          for (const list of fetchedLists) {
            const existing = lists.find((l) => l.id === list.id);
            if (!existing) {
              addList(list);
            }
          }
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user?.id]);

  useEffect(() => {
    const activeLists = lists.filter((l) => l.status === 'active');
    const pendingItems = lists.reduce(
      (sum, list) => sum + (list.items?.filter((i) => !i.is_checked).length || 0),
      0
    );
    const completedItems = lists.reduce(
      (sum, list) => sum + (list.items?.filter((i) => i.is_checked).length || 0),
      0
    );
    const totalSpent = lists.reduce(
      (sum, list) =>
        sum +
        (list.items?.reduce(
          (itemSum, item) =>           itemSum + (item.estimated_price || 0) * (item.quantity || 1),
          0
        ) || 0),
      0
    );
    setStats({
      activeLists: activeLists.length,
      pendingItems,
      totalSpent,
      completedItems,
    });
  }, [lists]);

  const recentLists = lists.slice(0, 5);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Welcome back{user?.name ? `, ${user.name}` : ''}!
        </h1>
        <p className="text-gray-600">
          Here's what's happening with your grocery shopping today.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Active Lists"
          value={stats.activeLists}
          icon="🛒"
          href="/lists"
        />
        <StatCard
          title="Pending Items"
          value={stats.pendingItems}
          icon="⏳"
          href="/shopping"
        />
        <StatCard
          title="Total Estimated"
          value={`${stats.totalSpent.toFixed(2)}`}
          icon="💰"
          href="/reports"
        />
        <StatCard
          title="Items Completed"
          value={stats.completedItems}
          icon="✅"
          href="/shopping"
        />
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Quick Actions
        </h2>
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
          <h2 className="text-xl font-semibold text-gray-800">Recent Lists</h2>
          <Link to="/lists" className="text-green-600 hover:text-green-700 text-sm font-medium">
            View All →
          </Link>
        </div>
        {recentLists.length === 0 ? (
          <Card>
            <div className="text-center py-8">
              <p className="text-gray-500 mb-2">No lists yet</p>
              <Link to="/lists" className="text-green-600 hover:text-green-700 font-medium">
                Create your first list →
              </Link>
            </div>
          </Card>
        ) : (
          <div className="space-y-3">
            {recentLists.map((list) => {
              const itemCount = list.items?.length || 0;
              const completedCount = list.items?.filter((i) => i.is_checked).length || 0;
              return (
                <Link key={list.id} to="/lists">
                  <Card>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <span className="text-2xl">🛒</span>
                        <div>
                          <h3 className="font-medium text-gray-800">{list.name}</h3>
                          <p className="text-sm text-gray-600">
                            {completedCount}/{itemCount} items • {list.status}
                          </p>
                        </div>
                      </div>
                      <Badge variant={list.status === 'active' ? 'primary' : list.status === 'completed' ? 'success' : 'secondary'}>
                        {list.status}
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
