import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { apiFetch } from '@/api/client';
import { Card, EmptyState, Skeleton } from '@/components/ui';
import { SpendingSummary } from '@/components/SpendingSummary';
import { useLogRender } from '@/hooks/useLogRender';

interface SummaryData {
  totalSpent: number;
  currency: string;
  itemsBought: number;
  activeLists: number;
  categorySpending: { category: string; amount: number }[];
  topItems: { name: string; totalSpent: number }[];
}

const DashboardPage: React.FC = () => {
  useLogRender('DashboardPage');
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<SummaryData | null>(null);

  useEffect(() => {
    const fetchSummary = async () => {
      if (!user?.id) { setLoading(false); return; }
      try {
        const res = await apiFetch(`/api/analytics/summary?userId=${user.id}`);
        if (res.ok) {
          const data = await res.json();
          setSummary(data);
        }
      } catch (err) {
        console.error('Error fetching dashboard summary:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, [user?.id]);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
        <Skeleton className="h-64" />
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <EmptyState
          title="No data yet"
          description="Start shopping and tracking prices to see your dashboard"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
      <SpendingSummary
        totalSpent={summary.totalSpent}
        currency={summary.currency || 'AZN'}
        itemsBought={summary.itemsBought}
        activeLists={summary.activeLists}
        categorySpending={summary.categorySpending || []}
        topItems={summary.topItems || []}
      />
    </div>
  );
};

export { DashboardPage };
