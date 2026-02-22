import React, { ReactNode } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './src/index.css';

class ErrorBoundary extends React.Component<{ children: ReactNode }, { hasError: boolean, error: any }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("Critical Application Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', fontFamily: 'system-ui', textAlign: 'center' }}>
          <h2 style={{ color: '#e11d48' }}>Something went wrong.</h2>
          <pre style={{ 
            background: '#f3f4f6', 
            padding: '10px', 
            borderRadius: '4px', 
            textAlign: 'left', 
            overflow: 'auto', 
            fontSize: '12px',
            marginTop: '20px',
            color: '#000'
          }}>
            {this.state.error?.message || JSON.stringify(this.state.error)}
          </pre>
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
