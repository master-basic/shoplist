import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { EmptyState } from '@/components/ui/EmptyState';
import { Spinner } from '@/components/ui/Spinner';
import { registerUser } from '@/api/auth';
import { createHousehold } from '@/api/auth';
import { STORES, CATEGORIES } from '@/types';

const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    preferredStore: '',
    currency: 'TRY',
    demoMode: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [registerError, setRegisterError] = useState('');

  // Check if user is already logged in
  useEffect(() => {
    const userId = localStorage.getItem('user_id');
    if (userId) {
      navigate('/');
    }
  }, [navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleComplete = async () => {
    setSubmitting(true);
    setRegisterError('');
    try {
      const user = await registerUser(formData.name, formData.email, formData.password);
      await createHousehold(`${formData.name}'s Household`, '', user.id);
      localStorage.setItem('user_id', user.id);
      localStorage.setItem('user_name', user.name);
      localStorage.setItem('user_email', user.email);

      if (formData.demoMode) {
        localStorage.setItem('demo_mode', 'true');
      }

      navigate('/lists');
    } catch (err) {
      setRegisterError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">Create Your Account</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="john@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <Input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Create a password"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">Choose Your Preferred Store</h2>
            <p className="text-sm text-gray-600 mb-4">
              Select your primary store. You can always add more stores later.
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {STORES.map((store) => (
                <label key={store} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="preferredStore"
                    value={store}
                    checked={formData.preferredStore === store}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-sm text-gray-700">{store}</span>
                </label>
              ))}
            </div>

            {formData.preferredStore && (
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800">
                  <strong>Selected:</strong> {formData.preferredStore}
                </p>
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">Choose Your Currency</h2>
            <p className="text-sm text-gray-600 mb-4">
              Select your preferred currency for price tracking.
            </p>

            <div className="space-y-3">
              <label className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                <div>
                  <p className="font-medium text-gray-800">Turkish Lira (TRY)</p>
                  <p className="text-sm text-gray-600">₺</p>
                </div>
                <input
                  type="radio"
                  name="currency"
                  value="TRY"
                  checked={formData.currency === 'TRY'}
                  onChange={(e) => setFormData(prev => ({ ...prev, currency: e.target.value }))}
                  className="w-4 h-4 text-blue-600"
                />
              </label>

              <label className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                <div>
                  <p className="font-medium text-gray-800">US Dollar (USD)</p>
                  <p className="text-sm text-gray-600">$</p>
                </div>
                <input
                  type="radio"
                  name="currency"
                  value="USD"
                  checked={formData.currency === 'USD'}
                  onChange={(e) => setFormData(prev => ({ ...prev, currency: e.target.value }))}
                  className="w-4 h-4 text-blue-600"
                />
              </label>

              <label className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                <div>
                  <p className="font-medium text-gray-800">Euro (EUR)</p>
                  <p className="text-sm text-gray-600">€</p>
                </div>
                <input
                  type="radio"
                  name="currency"
                  value="EUR"
                  checked={formData.currency === 'EUR'}
                  onChange={(e) => setFormData(prev => ({ ...prev, currency: e.target.value }))}
                  className="w-4 h-4 text-blue-600"
                />
              </label>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Almost There!</h2>
              <p className="text-sm text-gray-600 mt-2">
                Let's set up your household settings.
              </p>
            </div>

            <div className="space-y-3">
              <label className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium text-gray-800">Use Demo Data</p>
                  <p className="text-sm text-gray-600">
                    Create sample lists and items for demonstration
                  </p>
                </div>
                <input
                  type="checkbox"
                  name="demoMode"
                  checked={formData.demoMode}
                  onChange={handleInputChange}
                  className="w-5 h-5 text-blue-600 rounded"
                />
              </label>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Welcome to GroceryMind</h1>
          <p className="text-sm text-gray-600 mt-2">
            Let's get started with your shopping journey
          </p>
          <div className="flex justify-center gap-2 mt-6">
            {[1, 2, 3, 4].map((num) => (
              <div
                key={num}
                className={`h-2 rounded-full transition-colors ${
                  step >= num ? 'bg-blue-600' : 'bg-gray-200'
                }`}
                style={{ width: step > num ? '50px' : '12px' }}
              />
            ))}
          </div>
        </div>

        {renderStep()}

        {registerError && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700">{registerError}</p>
          </div>
        )}

        <div className="flex gap-4 mt-8">
          {step > 1 && (
            <Button onClick={handlePrevious} variant="secondary" className="flex-1">
              Previous
            </Button>
          )}
          <Button
            onClick={step === 4 ? handleComplete : handleNext}
            variant="primary"
            className="flex-1"
            disabled={(step === 1 && !formData.name) || submitting}
          >
            {submitting ? <Spinner size="sm" /> : step === 4 ? 'Create Account' : 'Next'}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export { OnboardingPage };