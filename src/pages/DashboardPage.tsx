import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { apiFetch } from '@/api/client';
import { Card, EmptyState, Skeleton } from '@/components/ui';
import { SpendingSummary } from '@/components/SpendingSummary';
import { useLogRender } from '@/hooks/useLogRender';
import { useStore } from '@/store/useStore';

interface SummaryData {
  totalSpent: number;
  currency: string;
  itemsBought: number;
  activeLists: number;
  categorySpending: { category: string; amount: number }[];
  topItems: { name: string; totalSpent: number }[];
}

interface BudgetWarning {
  budgeted: number;
  spent: number;
  remaining: number;
  usagePercent: number;
  periodEnd: string;
}

const DashboardPage: React.FC = () => {
  useLogRender('DashboardPage');
  const { user } = useAuth();
  const { currentHouseholdId } = useStore();
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [budgetWarning, setBudgetWarning] = useState<BudgetWarning | null>(null);

  useEffect(() => {
    const fetchSummary = async () => {
      if (!user?.id) { setLoading(false); return; }
      try {
        const params = currentHouseholdId ? `?householdId=${currentHouseholdId}` : '';
        const res = await apiFetch(`/api/analytics/summary${params}`);
        if (res.ok) {
          const data = await res.json();
          setSummary({
            totalSpent: data.totalSpentThisMonth || 0,
            currency: 'AZN',
            itemsBought: data.totalItemsBought || 0,
            activeLists: data.activeListsCount || 0,
            categorySpending: [],
            topItems: [],
          });
        }
      } catch (err) {
        console.error('Error fetching dashboard summary:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, [user?.id, currentHouseholdId]);

  useEffect(() => {
    const fetchBudget = async () => {
      if (!currentHouseholdId) return;
      try {
        const res = await apiFetch(`/api/budget?householdId=${currentHouseholdId}`);
        if (res.ok) {
          const data = await res.json();
          if (data.budget) {
            setBudgetWarning({
              budgeted: data.budget.amount,
              spent: data.budget.totalSpent,
              remaining: data.budget.remaining,
              usagePercent: data.budget.usagePercent,
              periodEnd: data.budget.period_end,
            });
          }
        }
      } catch (err) {
        console.error('Error fetching budget:', err);
      }
    };
    fetchBudget();
  }, [currentHouseholdId]);

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

      {budgetWarning && (
        <div className={`rounded-xl border p-4 ${
          budgetWarning.usagePercent >= 100 ? 'border-red-300 bg-red-50' :
          budgetWarning.usagePercent >= 80 ? 'border-yellow-300 bg-yellow-50' :
          'border-gray-200 bg-gray-50'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              {budgetWarning.usagePercent >= 100 ? (
                <span className="text-xl">🚨</span>
              ) : budgetWarning.usagePercent >= 80 ? (
                <span className="text-xl">⚠️</span>
              ) : (
                <span className="text-xl">📊</span>
              )}
              <span className="font-semibold text-gray-800">Monthly Budget</span>
            </div>
            <span className={`text-sm font-medium ${
              budgetWarning.usagePercent >= 100 ? 'text-red-600' :
              budgetWarning.usagePercent >= 80 ? 'text-yellow-600' :
              'text-gray-500'
            }`}>
              {budgetWarning.usagePercent.toFixed(0)}% used
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
            <div
              className={`h-2.5 rounded-full transition-all ${
                budgetWarning.usagePercent >= 100 ? 'bg-red-500' :
                budgetWarning.usagePercent >= 80 ? 'bg-yellow-500' : 'bg-green-500'
              }`}
              style={{ width: `${Math.min(budgetWarning.usagePercent, 100)}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">
              Spent: {budgetWarning.spent.toFixed(2)} / {budgetWarning.budgeted.toFixed(2)} AZN
            </span>
            <span className={`font-medium ${
              budgetWarning.remaining >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {budgetWarning.remaining >= 0 ? `${budgetWarning.remaining.toFixed(2)} AZN remaining` : `${Math.abs(budgetWarning.remaining).toFixed(2)} AZN over budget`}
            </span>
          </div>
        </div>
      )}

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
