import React from 'react';
import { FileText, CheckCircle, AlertCircle, Mail } from 'lucide-react';

export const TermsOfService: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 pt-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-brass-100 dark:bg-brass-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="text-brass-600" size={32} />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Terms of Service</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Last updated: February 2026
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 md:p-12 space-y-8">
          
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Acceptance of Terms</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              By accessing and using the SAVIMAN website, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by these terms, please do not use this website.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Use License</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
              Permission is granted to temporarily use the SAVIMAN website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.
            </p>
            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
              <p className="text-red-800 dark:text-red-200 text-sm">
                You may NOT: modify or copy the materials, use the materials for any commercial purpose, attempt to reverse engineer any software contained on the website.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Product Information</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
              We strive to provide accurate product descriptions and pricing. However, we do not warrant that product descriptions, pricing, or other content on this site is accurate, complete, reliable, current, or error-free.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Orders and Quotes</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
              All quotes provided through this website are valid for 30 days unless otherwise specified. Orders are subject to our acceptance and availability. We reserve the right to refuse or cancel any order for any reason.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Intellectual Property</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              The content on this website, including but not limited to text, graphics, logos, images, and software, is the property of SAVIMAN Industries and is protected by copyright and intellectual property laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Limitation of Liability</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              SAVIMAN Industries shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the website.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Governing Law</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              These terms and conditions are governed by and construed in accordance with the laws of India and you irrevocably submit to the exclusive jurisdiction of the courts in Jamnagar, Gujarat.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Contact Information</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
              Questions about the Terms of Service should be sent to us at:
            </p>
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Mail size={18} />
                <span>legal@saviman.com</span>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};
