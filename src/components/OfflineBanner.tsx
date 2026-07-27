import React from 'react';

interface OfflineBannerProps {
  isOnline: boolean;
}

export const OfflineBanner: React.FC<OfflineBannerProps> = ({ isOnline }) => {
  if (isOnline) return null;

  return (
    <div role="status" aria-live="polite" className="fixed top-0 left-0 right-0 z-50 bg-red-500 text-white px-4 py-2 flex items-center justify-center gap-2">
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.734 0l-4.268 4.5c-.77.833-.808 2.5.062 2.5z" />
      </svg>
      <span className="text-sm font-medium">You are offline — changes will sync when connection is restored</span>
    </div>
  );
};
