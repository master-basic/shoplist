import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/Skeleton';
import { registerUser, createHousehold } from '@/api/auth';
import { useStore } from '@/store/useStore';
import { STORES } from '@/types';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    preferredStore: '',
    currency: 'AZN',
    demoMode: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const updateField = (field: string, value: string) => setFormData(prev => ({ ...prev, [field]: value }));

  const handleNext = () => {
    if (step === 1) {
      if (!formData.name || !formData.email || !formData.password) { setError('Please fill in all fields'); return; }
      if (formData.password !== formData.confirmPassword) { setError('Passwords do not match'); return; }
      if (formData.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    }
    setError('');
    setStep(step + 1);
  };

  const handlePrevious = () => { setError(''); setStep(step - 1); };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError('');
    try {
      const { user: userData, token } = await registerUser(formData.name, formData.email, formData.password);
      await createHousehold(`${formData.name}'s Household`, '', userData.id);
      localStorage.setItem('user_id', userData.id);
      localStorage.setItem('user_name', userData.name);
      localStorage.setItem('user_email', userData.email);
      localStorage.setItem('auth_token', token);
      if (formData.preferredStore) localStorage.setItem('preferred_store', formData.preferredStore);
      localStorage.setItem('currency', formData.currency);
      if (formData.demoMode) localStorage.setItem('demo_mode', 'true');
      useStore.getState().setUser(userData);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <Card className="w-full max-w-lg p-8">
        {step <= 4 && (
          <div className="flex justify-center gap-2 mb-6">
            {[1, 2, 3, 4].map((num) => (
              <div key={num} className={`h-2 rounded-full transition-all duration-300 ${step >= num ? 'bg-blue-600' : 'bg-gray-200'}`} style={{ width: step > num ? '40px' : '32px' }} />
            ))}
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>
        )}

        {step === 1 && (
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleNext(); }}>
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Create Account</h1>
              <p className="text-gray-600">Join GroceryMind today</p>
            </div>
            <Input label="Full Name" value={formData.name} onChange={(e) => updateField('name', e.target.value)} placeholder="John Doe" required />
            <Input label="Email Address" type="email" value={formData.email} onChange={(e) => updateField('email', e.target.value)} placeholder="you@example.com" required />
            <Input label="Password" type="password" value={formData.password} onChange={(e) => updateField('password', e.target.value)} placeholder="••••••••" required minLength={6} />
            <Input label="Confirm Password" type="password" value={formData.confirmPassword} onChange={(e) => updateField('confirmPassword', e.target.value)} placeholder="••••••••" required />
            <Button type="submit" className="w-full">Next: Choose Store</Button>
          </form>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">Choose Your Preferred Store</h2>
            <p className="text-sm text-gray-600 mb-4">Select your primary store. You can always add more later.</p>
            <div className="grid grid-cols-2 gap-2">
              {STORES.map((store) => (
                <label key={store} className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition-colors ${formData.preferredStore === store ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'}`}>
                  <input type="radio" name="preferredStore" value={store} checked={formData.preferredStore === store} onChange={(e) => updateField('preferredStore', e.target.value)} className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-gray-700">{store}</span>
                </label>
              ))}
            </div>
            <div className="flex gap-4">
              <Button onClick={handlePrevious} variant="secondary" className="flex-1">Back</Button>
              <Button onClick={handleNext} className="flex-1">Next: Currency</Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">Choose Your Currency</h2>
            <p className="text-sm text-gray-600 mb-4">Select your preferred currency for price tracking.</p>
            {[{ code: 'AZN', label: 'Azerbaijani Manat (AZN)', symbol: '₼' }, { code: 'USD', label: 'US Dollar (USD)', symbol: '$' }, { code: 'EUR', label: 'Euro (EUR)', symbol: '€' }].map((cur) => (
              <label key={cur.code} className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors ${formData.currency === cur.code ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'}`}>
                <div>
                  <p className="font-medium text-gray-800">{cur.label}</p>
                  <p className="text-sm text-gray-600">{cur.symbol}</p>
                </div>
                <input type="radio" name="currency" value={cur.code} checked={formData.currency === cur.code} onChange={(e) => updateField('currency', e.target.value)} className="w-4 h-4 text-blue-600" />
              </label>
            ))}
            <div className="flex gap-4">
              <Button onClick={handlePrevious} variant="secondary" className="flex-1">Back</Button>
              <Button onClick={handleNext} className="flex-1">Next: Finalize</Button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Almost There!</h2>
              <p className="text-sm text-gray-600 mt-2">Finalize your account setup.</p>
            </div>
            <label className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
              <div>
                <p className="font-medium text-gray-800">Use Demo Data</p>
                <p className="text-sm text-gray-600">Create sample lists and items for demonstration</p>
              </div>
              <input type="checkbox" checked={formData.demoMode} onChange={(e) => setFormData(prev => ({ ...prev, demoMode: e.target.checked }))} className="w-5 h-5 text-blue-600 rounded" />
            </label>
            <div className="flex gap-4">
              <Button onClick={handlePrevious} variant="secondary" className="flex-1">Back</Button>
              <Button onClick={handleSubmit} className="flex-1" disabled={isLoading}>
                {isLoading ? <Skeleton className="h-4 w-20" /> : 'Create Account'}
              </Button>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">Already have an account?{' '}<Link to="/login" className="text-green-600 hover:text-green-700 font-medium">Sign in</Link></p>
          </div>
        )}
      </Card>
    </div>
  );
};

export { Register };
