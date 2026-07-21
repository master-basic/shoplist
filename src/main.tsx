import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { StoreProvider } from './store/useStore';
import ErrorBoundary from './components/ErrorBoundary';
import './styles/globals.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <StoreProvider>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </StoreProvider>
    </BrowserRouter>
  </React.StrictMode>
);
