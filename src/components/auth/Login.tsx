// =====================================================
// Login Component
// =====================================================

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { EmptyState } from '../ui/EmptyState';
import { Skeleton } from '../../components/Skeleton';
import { loginUser } from '../../api/auth';
import { useAuth } from '../../hooks/useAuth';
import { useStore } from '../../store/useStore';

export const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const { user: userData, token } = await loginUser(username, password);
      localStorage.setItem('user_id', userData.id);
      localStorage.setItem('user_name', userData.name);
      localStorage.setItem('user_email', userData.email);
      localStorage.setItem('auth_token', token);
      useStore.getState().setUser(userData);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid username or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to your GroceryMind account</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="your-username"
            required
          />

          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />

          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
              Demo: <code className="bg-gray-100 px-1 py-0.5 rounded">admin</code> / <code className="bg-gray-100 px-1 py-0.5 rounded">admin</code>
            </p>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? <Skeleton className="h-4 w-16" /> : 'Sign In'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="text-green-600 hover:text-green-700 font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
};