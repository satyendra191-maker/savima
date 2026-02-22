import { useEffect } from 'react';

interface AnalyticsConfig {
  gaId?: string;
  fbPixelId?: string;
  clarityId?: string;
}

export const initAnalytics = (config: AnalyticsConfig) => {
  const win = window as any;
  
  // Google Analytics 4
  if (config.gaId) {
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${config.gaId}`;
    document.head.appendChild(script);

    win.dataLayer = win.dataLayer || [];
    const gtag = function(...args: any[]) {
      win.dataLayer.push(args);
    };
    win.gtag = gtag;
    gtag('js', new Date());
    gtag('config', config.gaId);
  }

  // Facebook Pixel
  if (config.fbPixelId) {
    // Load Facebook Pixel script
    const fbScript = document.createElement('script');
    fbScript.innerHTML = `
      !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
      n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');
    `;
    document.head.appendChild(fbScript);
    
    if (win.fbq) {
      win.fbq('init', config.fbPixelId);
      win.fbq('track', 'PageView');
    }
  }

  // Microsoft Clarity
  if (config.clarityId) {
    const clarityScript = document.createElement('script');
    clarityScript.src = "https://www.clarity.ms/tag/" + config.clarityId;
    clarityScript.async = true;
    document.head.appendChild(clarityScript);
  }
};

export const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
  const win = window as any;
  if (win.gtag) {
    win.gtag('event', eventName, parameters);
  }
  if (win.fbq) {
    win.fbq('track', eventName, parameters);
  }
};

export const Analytics: React.FC = () => {
  useEffect(() => {
    const env = (import.meta as any).env || {};
    const gaId = env.VITE_GA_ID;
    const fbPixelId = env.VITE_FB_PIXEL_ID;
    const clarityId = env.VITE_CLARITY_ID;

    if (gaId || fbPixelId || clarityId) {
      initAnalytics({ gaId, fbPixelId, clarityId });
    }
  }, []);

  return null;
};

export const trackConversion = (currency: string, value: number) => {
  trackEvent('purchase', { currency, value });
  trackEvent('generate_lead', { currency, value });
};
