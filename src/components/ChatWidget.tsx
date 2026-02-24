'use client';

import { useEffect, useState } from 'react';

declare global {
  interface Window {
    chatwootSettings: any;
    chatwootSDK: any;
    $chatwoot: any;
  }
}

export default function ChatWidget() {
  const [userLang, setUserLang] = useState('en');
  const [userCountry, setUserCountry] = useState('US');

  useEffect(() => {
    // Geo detection (free IP API)
    fetch('https://ipapi.co/json/')
      .then(res => res.json())
      .then(data => {
        setUserCountry(data.country_code || 'US');
        const browserLang = navigator.language || navigator.languages?.[0] || 'en';
        const langCode = data.languages?.split(',')?.[0] || browserLang.split('-')[0] || 'en';
        setUserLang(langCode);
        
        // Initialize Chatwoot with detected language
        initChatwoot(langCode, data.country_code || 'US');
      })
      .catch(() => {
        const browserLang = navigator.language || navigator.languages?.[0] || 'en';
        setUserLang(browserLang.split('-')[0] || 'en');
        setUserCountry('US');
        initChatwoot(browserLang.split('-')[0] || 'en', 'US');
      });
  }, []);

  const initChatwoot = (lang: string, country: string) => {
    // Chatwoot configuration
    window.chatwootSettings = {
      hideMessageBubble: false,
      position: 'right',
      type: 'standard',
      locale: lang,
    };

    // Your Chatwoot instance URL and token
    // Replace these with your actual Chatwoot details
    const CHATWOOT_URL = 'https://app.chatwoot.com'; // Or your self-hosted URL
    const CHATWOOT_TOKEN = 'YOUR_WEBSITE_TOKEN'; // Get from Chatwoot dashboard

    (function(d: Document, t: string) {
      var BASE_URL = CHATWOOT_URL;
      var g = d.createElement(t) as HTMLScriptElement,
        s = d.getElementsByTagName(t)[0];
      g.src = BASE_URL + '/packs/js/sdk.js';
      g.defer = true;
      g.async = true;
      s.parentNode?.insertBefore(g, s);

      g.onload = function () {
        if (window.chatwootSDK) {
          window.chatwootSDK.run({
            websiteToken: CHATWOOT_TOKEN,
            baseUrl: BASE_URL,
          });

          // Set custom attributes after SDK loads
          setTimeout(() => {
            if (window.$chatwoot) {
              window.$chatwoot.setCustomAttributes({
                preferred_language: lang,
                country: country,
                source: 'saviman_website',
              });
            }
          }, 1000);
        }
      };
    })(document, 'script');
  };

  return null;
}
