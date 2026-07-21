import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts';
import { Card } from './ui';
import { formatCurrency } from '@/utils/formatCurrency';

interface SpendingSummaryProps {
  totalSpent: number;
  currency: string;
  itemsBought: number;
  activeLists: number;
  categorySpending: { category: string; amount: number }[];
  topItems: { name: string; totalSpent: number }[];
}

export const SpendingSummary: React.FC<SpendingSummaryProps> = ({
  totalSpent,
  currency,
  itemsBought,
  activeLists,
  categorySpending,
  topItems,
}) => {
  const top5 = topItems.slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <p className="text-sm text-gray-600">Total Spent</p>
          <p className="text-2xl font-bold text-gray-800">{formatCurrency(totalSpent, currency)}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600">Items Bought</p>
          <p className="text-2xl font-bold text-gray-800">{itemsBought}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600">Active Lists</p>
          <p className="text-2xl font-bold text-gray-800">{activeLists}</p>
        </Card>
      </div>

      {categorySpending.length > 0 && (
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Spending by Category</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categorySpending}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="category" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={(v: number) => `${v.toFixed(0)}`} />
              <Tooltip formatter={(value: number) => [formatCurrency(value), 'Amount']} />
              <Bar dataKey="amount" fill="#22c55e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      )}

      {top5.length > 0 && (
        <Card>
          <div className="p-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800">Top Items by Spending</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {top5.map((item, i) => (
              <div key={i} className="flex items-center justify-between px-4 py-3 hover:bg-gray-50">
                <span className="font-medium text-gray-800">{item.name}</span>
                <span className="font-semibold text-gray-800">{formatCurrency(item.totalSpent, currency)}</span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
