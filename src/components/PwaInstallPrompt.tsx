import React from 'react';

interface PwaInstallPromptProps {
  onInstall: () => Promise<void>;
  onDismiss: () => void;
}

export const PwaInstallPrompt: React.FC<PwaInstallPromptProps> = ({ onInstall, onDismiss }) => {
  const handleInstall = async () => {
    await onInstall();
  };

  const handleDismiss = () => {
    onDismiss();
  };

  return (
    <div 
      role="dialog"
      aria-modal="true"
      aria-label="Install Application"
      className="fixed bottom-0 left-0 right-0 z-50 animate-slide-up"
    >
      <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-xl">
        <div className="max-w-lg mx-auto px-4 py-6">
          <div className="flex items-start gap-4">
            {/* Icon */}
            <div className="flex-shrink-0">
              <div className="w-16 h-16 rounded-xl overflow-hidden shadow-md">
                <img 
                  src="/icons/icon-512.png" 
                  alt="GroceryMind app icon"
                  className="w-full h-full object-cover"
                  width="64"
                  height="64"
                />
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                Install GroceryMind
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                Add to your home screen for quick access, offline support, and faster loading.
              </p>

              {/* Features list */}
              <ul className="text-sm text-gray-700 dark:text-gray-400 mb-5 space-y-1">
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Works offline</span>
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Faster loading</span>
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Native app experience</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-5">
            <button
              onClick={handleDismiss}
              className="flex-1 px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            >
              Maybe Later
            </button>
            <button
              onClick={handleInstall}
              className="flex-1 px-4 py-3 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            >
              Install Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
