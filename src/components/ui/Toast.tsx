// =====================================================
// Toast Component
// =====================================================

import React, { useEffect, useState } from 'react';

export type ToastVariant = 'success' | 'error' | 'warning' | 'info';

export interface ToastProps {
  message: string;
  variant?: ToastVariant;
  onClose?: () => void;
  duration?: number;
  className?: string;
}

const variants: Record<ToastVariant, string> = {
  success: 'bg-green-500',
  error: 'bg-red-500',
  warning: 'bg-yellow-500',
  info: 'bg-blue-500',
};

const icons: Record<ToastVariant, React.ReactNode> = {
  success: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>,
  error: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>,
  warning: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>,
  info: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
};

export const Toast: React.FC<ToastProps> = ({
  message,
  variant = 'info',
  onClose,
  duration = 4000,
  className = '',
}) => {
  const [show, setShow] = useState(true);
  
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setShow(false);
        if (onClose) onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  if (!show) return null;

  return (
    <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg text-white transition-all ${variants[variant]} ${className}`}>
      {icons[variant]}
      <span className="flex-1">{message}</span>
      {onClose && (
        <button
          onClick={() => {
            setShow(false);
            onClose();
          }}
          className="opacity-75 hover:opacity-100"
          aria-label="Close toast"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
};

export const useToast = () => {
  const [toasts, setToasts] = useState<Array<{ id: string; message: string; variant: ToastVariant; onClose: () => void }>>([]);

  const addToast = (message: string, variant: ToastVariant = 'info', duration: number = 4000) => {
    const id = Math.random().toString(36).substring(7);
    setToasts(prev => [...prev, { id, message, variant, onClose: () => removeToast(id) }]);
    if (duration > 0) {
      setTimeout(() => removeToast(id), duration);
    }
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return { toasts, addToast, removeToast };
};