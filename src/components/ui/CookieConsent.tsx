import React, { useState, useEffect } from 'react';
import { Cookie, X, ChevronUp } from 'lucide-react';

export const CookieConsent: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true,
    analytics: false,
    marketing: false
  });

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) {
      setTimeout(() => setIsVisible(true), 2000);
    }
  }, []);

  const acceptAll = () => {
    localStorage.setItem('cookie_consent', 'all');
    setIsVisible(false);
  };

  const savePreferences = () => {
    localStorage.setItem('cookie_consent', JSON.stringify(preferences));
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full z-50 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-2xl p-4 animate-fade-in-up">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-start gap-3 flex-1">
          <Cookie className="text-brass-500 flex-shrink-0 mt-1" />
          <div>
            <h4 className="font-bold text-gray-900 dark:text-white">We use cookies</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. By clicking "Accept All", you consent to our use of cookies.
            </p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <button 
            onClick={savePreferences}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            Customize
          </button>
          <button 
            onClick={acceptAll}
            className="px-4 py-2 text-sm font-medium text-white bg-brass-500 rounded-lg hover:bg-brass-600"
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
};

export const BackToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 500) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-6 left-6 z-40 bg-saviman-700 text-white p-3 rounded-full shadow-lg hover:bg-saviman-800 transition-all transform hover:scale-110"
      aria-label="Back to top"
    >
      <ChevronUp size={24} />
    </button>
  );
};
