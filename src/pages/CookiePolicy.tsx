import React from 'react';
import { Cookie, Shield, Eye, Settings, Mail } from 'lucide-react';

export const CookiePolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 pt-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-brass-100 dark:bg-brass-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <Cookie className="text-brass-600" size={32} />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Cookie Policy</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Last updated: February 2026
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 md:p-12 space-y-8">
          
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Shield className="text-brass-500" size={24} /> What are Cookies?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Cookies are small text files that are stored on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and provide information to the website owners.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Eye className="text-brass-500" size={24} /> How We Use Cookies
            </h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
              SAVIMAN uses cookies to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400 ml-4">
              <li>Keep you logged in during your visit</li>
              <li>Remember your preferences and settings</li>
              <li>Analyze traffic and improve our website performance</li>
              <li>Personalize content and advertisements</li>
              <li>Provide social media features</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Types of Cookies We Use</h2>
            
            <div className="space-y-4">
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">Essential Cookies</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  These are necessary for the website to function. They cannot be switched off. The website will not work without them.
                </p>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">Analytics Cookies</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  These help us understand how visitors interact with our website by collecting anonymous information.
                </p>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">Marketing Cookies</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  These are used to track visitors across websites to display relevant advertisements.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Settings className="text-brass-500" size={24} /> Managing Cookies
            </h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
              You can manage your cookie preferences at any time by clicking the "Customize" button in our cookie consent banner. You can also modify your browser settings to block or delete cookies.
            </p>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>Note:</strong> Blocking some cookies may impact your experience on our website and limit the services we can provide.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Contact Us</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
              If you have any questions about our Cookie Policy, please contact us:
            </p>
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Mail size={18} />
                <span>export@saviman.com</span>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};
