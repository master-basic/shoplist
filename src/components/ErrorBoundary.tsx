import React, { ErrorInfo, ReactNode } from 'react';
import { reportError } from '@/api/logging';
import log from '@/utils/debug';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    log.warn('ErrorBoundary caught error', { message: error.message, name: error.name });
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    log.warn('ErrorBoundary.componentDidCatch', { message: error.message, stack: errorInfo.componentStack?.substring(0, 500) });
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    reportError(error, { componentStack: errorInfo.componentStack || '' });
  }

  handleReload = (): void => {
    log.info('ErrorBoundary: user clicking reload');
    window.location.reload();
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
            <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
              Something went wrong
            </h2>
            <p className="text-gray-600 text-center mb-6">
              An unexpected error occurred. Please try reloading the page.
            </p>
            <p className="text-xs text-gray-400 text-center mb-4 font-mono break-all">
              {this.state.error?.message}
            </p>
            <button
              onClick={this.handleReload}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
