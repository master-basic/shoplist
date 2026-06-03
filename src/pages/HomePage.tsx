// =====================================================
// HomePage Component
// =====================================================

import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

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
  <Link to="/lists" className="group">
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
  return (
    <div>
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Welcome back! 👋
        </h1>
        <p className="text-gray-600">
          Here's what's happening with your grocery shopping today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Active Lists"
          value={3}
          icon="🛒"
          trend="+1 this week"
          trendUp={true}
          href="/lists"
        />
        <StatCard
          title="Pending Items"
          value={24}
          icon="⏳"
          trend="Need to buy"
          href="/shopping"
        />
        <StatCard
          title="Total Spent"
          value="$156.42"
          icon="💰"
          trend="-12% vs last week"
          trendUp={true}
          href="/reports"
        />
        <StatCard
          title="Receipts"
          value={8}
          icon="📄"
          trend="3 pending review"
          href="/scan"
        />
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link to="/lists/new" className="block">
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

      {/* Recent Lists */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Recent Lists
          </h2>
          <Link to="/lists" className="text-green-600 hover:text-green-700 text-sm font-medium">
            View All →
          </Link>
        </div>
        <div className="space-y-3">
          <Link to="/lists">
            <Card>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-2xl">🛒</span>
                  <div>
                    <h3 className="font-medium text-gray-800">Weekly Groceries</h3>
                    <p className="text-sm text-gray-600">Created today • 12 items</p>
                  </div>
                </div>
                <Badge variant="primary">Active</Badge>
              </div>
            </Card>
          </Link>

          <Link to="/lists">
            <Card>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-2xl">🥬</span>
                  <div>
                    <h3 className="font-medium text-gray-800">Vegetables & Fruits</h3>
                    <p className="text-sm text-gray-600">Created yesterday • 8 items</p>
                  </div>
                </div>
                <Badge variant="secondary">Active</Badge>
              </div>
            </Card>
          </Link>

          <Link to="/lists">
            <Card>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-2xl">🧹</span>
                  <div>
                    <h3 className="font-medium text-gray-800">Cleaning Supplies</h3>
                    <p className="text-sm text-gray-600">Created 3 days ago • 5 items</p>
                  </div>
                </div>
                <Badge variant="success">Completed</Badge>
              </div>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
};