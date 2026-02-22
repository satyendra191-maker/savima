import React, { useState } from 'react';
import { Mail, Check, User, Loader2 } from 'lucide-react';

export const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    // Simulate API call
    setTimeout(() => {
      setStatus('success');
      setEmail('');
    }, 1500);
  };

  if (status === 'success') {
    return (
      <div className="bg-brass-50 dark:bg-gray-800 rounded-2xl p-8 text-center">
        <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check size={32} className="text-green-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">You're Subscribed!</h3>
        <p className="text-gray-600 dark:text-gray-400">Join 2,500+ engineers receiving our technical insights.</p>
      </div>
    );
  }

  return (
    <div className="bg-saviman-900 dark:bg-black rounded-2xl p-8 text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-brass-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-brass-500 rounded-xl">
            <Mail size={24} className="text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold">Newsletter</h3>
            <p className="text-gray-400 text-sm">Technical insights for engineers</p>
          </div>
        </div>

        <p className="text-gray-300 mb-6">
          Get the latest updates on manufacturing technologies, material trends, and case studies. Join 2,500+ industry professionals.
        </p>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="email"
              required
              placeholder="Enter your work email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brass-500"
            />
            <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
          <button 
            type="submit" 
            disabled={status === 'loading'}
            className="px-6 py-3 bg-brass-500 hover:bg-brass-600 rounded-lg font-bold transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {status === 'loading' ? <Loader2 className="animate-spin" size={20} /> : 'Subscribe'}
          </button>
        </form>

        <p className="text-xs text-gray-500 mt-4 flex items-center gap-1">
          <User size={12} /> No spam. Unsubscribe anytime.
        </p>
      </div>
    </div>
  );
};
