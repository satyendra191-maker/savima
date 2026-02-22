import React, { useState } from 'react';
import { Heart, CreditCard, Globe, IndianRupee, CheckCircle, Loader2, Shield, BookOpen, Users, GraduationCap, Star, School } from 'lucide-react';
import { supabase } from '../lib/supabase';

const CURRENCIES = {
  INR: { symbol: '₹', name: 'Indian Rupee', gateway: 'razorpay' },
  USD: { symbol: '$', name: 'US Dollar', gateway: 'stripe' }
};

const AMOUNT_PRESETS = [
  { inr: 250, usd: 3 },
  { inr: 500, usd: 6 },
  { inr: 1000, usd: 12 },
  { inr: 2500, usd: 30 },
  { inr: 5000, usd: 60 },
  { inr: 10000, usd: 120 },
];

export const Donate: React.FC = () => {
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');
  const [amount, setAmount] = useState(500);
  const [customAmount, setCustomAmount] = useState('');
  const [donorData, setDonorData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [loading, setLoading] = useState(false);
  const [donationStatus, setDonationStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [transactionId, setTransactionId] = useState('');

  const currentAmount = customAmount ? parseInt(customAmount) : amount;
  const displayAmount = currency === 'INR' ? currentAmount : Math.round(currentAmount / 83);

  const handleDonate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!donorData.name || !donorData.email) {
      alert('Please fill in required fields');
      return;
    }

    setLoading(true);
    setDonationStatus('processing');

    const txnId = `DON-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    setTransactionId(txnId);

    try {
      const { error } = await supabase
        .from('donations')
        .insert([{
          donor_name: donorData.name,
          donor_email: donorData.email,
          donor_phone: donorData.phone || null,
          donor_company: donorData.company || null,
          amount: currency === 'INR' ? currentAmount : currentAmount * 83,
          currency: currency,
          message: donorData.message || null,
          payment_method: paymentMethod,
          payment_status: 'completed',
          transaction_id: txnId
        }]);

      if (error) throw error;

      // Simulate payment gateway redirect
      await new Promise(resolve => setTimeout(resolve, 2000));

      setDonationStatus('success');
    } catch (error) {
      console.error('Donation error:', error);
      setDonationStatus('error');
    } finally {
      setLoading(false);
    }
  };

  const handlePresetClick = (preset: typeof AMOUNT_PRESETS[0]) => {
    setCustomAmount('');
    setAmount(currency === 'INR' ? preset.inr : preset.usd);
  };

  if (donationStatus === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden text-center p-8">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Thank You!</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">Your donation has been received.</p>
          <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-4 mb-4">
            <p className="text-sm text-gray-500">Transaction ID</p>
            <p className="font-mono font-bold text-primary-500">{transactionId}</p>
          </div>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-6">
            <Shield size={16} className="text-green-500" />
            <span>Tax receipt will be sent to {donorData.email}</span>
          </div>
          <button
            onClick={() => {
              setDonationStatus('idle');
              setDonorData({ name: '', email: '', phone: '', company: '', message: '' });
              setTransactionId('');
            }}
            className="w-full py-3 bg-primary-500 text-white rounded-xl font-semibold hover:bg-primary-600 transition-colors"
          >
            Make Another Donation
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full mb-4 shadow-lg">
            <GraduationCap size={40} className="text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Education for Every Child
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Your donation provides <span className="text-primary-600 font-semibold">quality education</span> to vulnerable children in India.
            Together, we can give them the gift of learning and a brighter future.
          </p>
          
          {/* Impact Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 max-w-3xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-md">
              <Users size={28} className="text-primary-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900 dark:text-white">500+</p>
              <p className="text-sm text-gray-500">Children Supported</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-md">
              <BookOpen size={28} className="text-green-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900 dark:text-white">50+</p>
              <p className="text-sm text-gray-500">Schools Partnered</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-md">
              <GraduationCap size={28} className="text-purple-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900 dark:text-white">200+</p>
              <p className="text-sm text-gray-500">Scholarships</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-md">
              <Heart size={28} className="text-amber-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900 dark:text-white">95%</p>
              <p className="text-sm text-gray-500">Success Rate</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Donation Form */}
          <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
                <button
                  onClick={() => setCurrency('INR')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${currency === 'INR' ? 'bg-primary-500 text-white shadow-lg' : 'text-gray-600 dark:text-gray-400'}`}
                >
                  <IndianRupee size={18} />
                  <span className="font-medium">INR</span>
                </button>
                <button
                  onClick={() => setCurrency('USD')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${currency === 'USD' ? 'bg-primary-500 text-white shadow-lg' : 'text-gray-600 dark:text-gray-400'}`}
                >
                  <Globe size={18} />
                  <span className="font-medium">USD</span>
                </button>
              </div>
              <span className="text-sm text-gray-500">
                {currency === 'INR' ? 'Indian Payment Gateway' : 'International Card Payment'}
              </span>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Select Amount
              </label>
              <div className="grid grid-cols-3 gap-3 mb-4">
                {AMOUNT_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => handlePresetClick(preset)}
                    className={`py-3 rounded-xl font-bold transition-all ${
                      (customAmount ? parseInt(customAmount) : amount) === (currency === 'INR' ? preset.inr : preset.usd)
                        ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    {currency === 'INR' ? `₹${preset.inr}` : `$${preset.usd}`}
                  </button>
                ))}
              </div>
              <input
                type="number"
                placeholder={`Custom amount in ${currency}`}
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Payment Method
              </label>
              <div className="grid grid-cols-2 gap-3">
                {currency === 'INR' ? (
                  <>
                    <button
                      onClick={() => setPaymentMethod('upi')}
                      className={`py-3 px-4 rounded-xl border-2 transition-all flex items-center justify-center gap-2 ${
                        paymentMethod === 'upi' ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 text-primary-600' : 'border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      <span className="text-2xl">📱</span>
                      <span className="font-medium">UPI</span>
                    </button>
                    <button
                      onClick={() => setPaymentMethod('card')}
                      className={`py-3 px-4 rounded-xl border-2 transition-all flex items-center justify-center gap-2 ${
                        paymentMethod === 'card' ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 text-primary-600' : 'border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      <CreditCard size={20} />
                      <span className="font-medium">Card</span>
                    </button>
                    <button
                      onClick={() => setPaymentMethod('netbanking')}
                      className={`py-3 px-4 rounded-xl border-2 transition-all flex items-center justify-center gap-2 ${
                        paymentMethod === 'netbanking' ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 text-primary-600' : 'border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      <span className="text-2xl">🏦</span>
                      <span className="font-medium">Net Banking</span>
                    </button>
                    <button
                      onClick={() => setPaymentMethod('wallet')}
                      className={`py-3 px-4 rounded-xl border-2 transition-all flex items-center justify-center gap-2 ${
                        paymentMethod === 'wallet' ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 text-primary-600' : 'border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      <span className="text-2xl">💳</span>
                      <span className="font-medium">Wallet</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setPaymentMethod('card')}
                      className={`py-3 px-4 rounded-xl border-2 transition-all flex items-center justify-center gap-2 col-span-2 ${
                        paymentMethod === 'card' ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 text-primary-600' : 'border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      <CreditCard size={20} />
                      <span className="font-medium">Credit / Debit Card</span>
                    </button>
                    <button
                      onClick={() => setPaymentMethod('paypal')}
                      className={`py-3 px-4 rounded-xl border-2 transition-all flex items-center justify-center gap-2 col-span-2 ${
                        paymentMethod === 'paypal' ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 text-primary-600' : 'border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      <span className="text-2xl">🅿️</span>
                      <span className="font-medium">PayPal</span>
                    </button>
                  </>
                )}
              </div>
            </div>

            <form onSubmit={handleDonate} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Full Name *"
                  required
                  value={donorData.name}
                  onChange={(e) => setDonorData({...donorData, name: e.target.value})}
                  className="px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-primary-500"
                />
                <input
                  type="email"
                  placeholder="Email Address *"
                  required
                  value={donorData.email}
                  onChange={(e) => setDonorData({...donorData, email: e.target.value})}
                  className="px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={donorData.phone}
                  onChange={(e) => setDonorData({...donorData, phone: e.target.value})}
                  className="px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-primary-500"
                />
                <input
                  type="text"
                  placeholder="Company (Optional)"
                  value={donorData.company}
                  onChange={(e) => setDonorData({...donorData, company: e.target.value})}
                  className="px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <textarea
                placeholder="Message (Optional)"
                value={donorData.message}
                onChange={(e) => setDonorData({...donorData, message: e.target.value})}
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-primary-500"
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold rounded-xl shadow-lg shadow-amber-500/30 transition-all hover:scale-[1.02] flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Heart size={20} className="fill-current" />
                    Donate {currency === 'INR' ? `₹${displayAmount}` : `$${displayAmount}`}
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                <Shield size={14} />
                <span>Secure payment powered by {currency === 'INR' ? 'Razorpay' : 'Stripe'}</span>
              </div>
            </form>
          </div>

          {/* Info Side */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 text-white">
              <h3 className="text-xl font-bold mb-4">Why Donate?</h3>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <CheckCircle size={20} className="text-amber-400 flex-shrink-0 mt-0.5" />
                  <span>Support manufacturing excellence and innovation</span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle size={20} className="text-amber-400 flex-shrink-0 mt-0.5" />
                  <span>Help small businesses go global</span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle size={20} className="text-amber-400 flex-shrink-0 mt-0.5" />
                  <span>Contribute to skill development</span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle size={20} className="text-amber-400 flex-shrink-0 mt-0.5" />
                  <span>Tax benefits under Section 80G</span>
                </li>
              </ul>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-xl">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Our Impact</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <p className="text-3xl font-bold text-primary-500">50+</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Countries Served</p>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <p className="text-3xl font-bold text-primary-500">500+</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Clients Worldwide</p>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <p className="text-3xl font-bold text-primary-500">1000+</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Products</p>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <p className="text-3xl font-bold text-primary-500">15+</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Years Experience</p>
                </div>
              </div>
            </div>

            {/* Why Donate Section */}
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-xl">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Why Your Donation Matters</h3>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                    <BookOpen size={16} className="text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Quality Education</p>
                    <p className="text-sm text-gray-500">Provide textbooks, notebooks, and learning materials</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                    <Users size={16} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Skilled Teachers</p>
                    <p className="text-sm text-gray-500">Fund qualified teachers and training programs</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                    <GraduationCap size={16} className="text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Scholarships</p>
                    <p className="text-sm text-gray-500">Support bright students from disadvantaged backgrounds</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                    <School size={16} className="text-amber-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Infrastructure</p>
                    <p className="text-sm text-gray-500">Build and maintain school facilities</p>
                  </div>
                </li>
              </ul>
              
              <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl">
                <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                  <Shield size={18} />
                  <span className="font-medium">100% of your donation goes to the cause</span>
                </div>
              </div>
            </div>

            {/* Testimonial */}
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-xl">
              <div className="flex items-center gap-2 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} size={20} className="text-amber-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 dark:text-gray-400 italic">
                "My daughter is the first in our family to attend school. Thanks to the scholarship, she's now pursuing her dream of becoming a doctor."
              </p>
              <p className="text-sm font-medium text-gray-900 dark:text-white mt-3">- Parent, Rural Gujarat</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Donate;
