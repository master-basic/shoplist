import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts';
import { EmptyState } from './ui';
import { formatCurrency } from '@/utils/formatCurrency';

interface PriceChartProps {
  data: { date: string; price: number }[];
  title?: string;
}

export const PriceChart: React.FC<PriceChartProps> = ({ data, title }) => {
  if (!data || data.length === 0) {
    return <EmptyState title="No price data" description="Price history will appear here" />;
  }

  const chart = (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="date" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} domain={['auto', 'auto']} tickFormatter={(v: number) => `${v.toFixed(2)}`} />
        <Tooltip formatter={(value: number) => [formatCurrency(value), 'Price']} labelFormatter={(label) => `Date: ${label}`} />
        <Line type="monotone" dataKey="price" stroke="#22c55e" strokeWidth={2} dot={{ r: 4 }} />
      </LineChart>
    </ResponsiveContainer>
  );

  if (title) {
    return (
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
        {chart}
      </div>
    );
  }

  return chart;
};
