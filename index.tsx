import React, { ReactNode } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './src/index.css';

class ErrorBoundary extends React.Component<{ children: ReactNode }, { hasError: boolean, error: any, errorInfo: any }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("Critical Application Error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      const errorMessage = this.state.error?.message || this.state.error?.toString() || 'Unknown error';
      const errorStack = this.state.error?.stack || this.state.errorInfo?.componentStack || '';
      
      return (
        <div style={{ padding: '40px', fontFamily: 'system-ui', textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ color: '#e11d48', fontSize: '24px', marginBottom: '20px' }}>Something went wrong</h2>
          <div style={{ background: '#fee2e2', padding: '15px', borderRadius: '8px', marginBottom: '20px', textAlign: 'left' }}>
            <strong style={{ color: '#991b1b' }}>Error:</strong>
            <pre style={{ margin: '10px 0', whiteSpace: 'pre-wrap', fontSize: '13px', color: '#dc2626' }}>{errorMessage}</pre>
          </div>
          {errorStack && (
            <div style={{ background: '#f3f4f6', padding: '15px', borderRadius: '8px', textAlign: 'left' }}>
              <strong>Stack trace:</strong>
              <pre style={{ margin: '10px 0', whiteSpace: 'pre-wrap', fontSize: '11px', overflow: 'auto', maxHeight: '300px' }}>{errorStack}</pre>
            </div>
          )}
        </div>
      );
    }
    return this.props.children;
  }
}

try {
  const rootElement = document.getElementById('root');

  if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </React.StrictMode>
    );
  } else {
    throw new Error("Root element not found in index.html");
  }
} catch (e: any) {
  console.error("Fatal startup error:", e);
  document.body.innerHTML = `
    <div style="padding: 20px; font-family: sans-serif; color: red;">
      <h1>Fatal Error</h1>
      <p>The application failed to start.</p>
      <pre style="background: #eee; padding: 10px;">${e.message || e}</pre>
    </div>
  `;
}

// PWA Registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').then(registration => {
      console.log('SW registered: ', registration);
    }).catch(registrationError => {
      console.log('SW registration failed: ', registrationError);
    });
  });
}

// Add manifest link dynamically
const manifestLink = document.createElement('link');
manifestLink.rel = 'manifest';
manifestLink.href = '/manifest.json';
document.head.appendChild(manifestLink);
