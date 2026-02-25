import { useEffect, useState } from 'react';
import { supabase, InquiryService } from '../lib/supabase';
import { LeadsService, AIGeneratedLeadsService } from '../services/leads';

export default function BackendTest() {
  // Only allow in development mode
  if (import.meta.env.PROD) {
    return <div className="p-8">This page is not available in production.</div>;
  }

  const [results, setResults] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    runTests();
  }, []);

  async function runTests() {
    const testResults: any = {};

    try {
      // Test 1: Check connection
      const { data: settings } = await supabase.from('site_settings').select('*').single();
      testResults.connection = settings ? { status: '✅', data: settings.site_name } : { status: '❌', error: 'No settings' };
    } catch (e: any) {
      testResults.connection = { status: '❌', error: e.message };
    }

    // Test 2: Insert inquiry
    try {
      await InquiryService.create({
        name: 'Test User ' + Date.now(),
        email: 'test' + Date.now() + '@example.com',
        message: 'Backend test message'
      });
      testResults.inquiry = { status: '✅', message: 'Saved successfully' };
    } catch (e: any) {
      testResults.inquiry = { status: '❌', error: e.message };
    }

    // Test 3: Insert lead
    try {
      await LeadsService.create({
        person_name: 'Test Lead',
        email: 'lead@example.com',
        source: 'website'
      });
      testResults.lead = { status: '✅', message: 'Saved successfully' };
    } catch (e: any) {
      testResults.lead = { status: '❌', error: e.message };
    }

    // Test 4: Insert AI lead
    try {
      await AIGeneratedLeadsService.create({
        person_name: 'AI Test',
        email: 'ai@example.com',
        status: 'pending'
      });
      testResults.aiLead = { status: '✅', message: 'Saved successfully' };
    } catch (e: any) {
      testResults.aiLead = { status: '❌', error: e.message };
    }

    // Test 5: Get counts
    try {
      const [inquiries, leads, aiLeads, products] = await Promise.all([
        supabase.from('inquiries').select('*', { count: 'exact' }),
        supabase.from('leads').select('*', { count: 'exact' }),
        supabase.from('ai_generated_leads').select('*', { count: 'exact' }),
        supabase.from('products').select('*', { count: 'exact' })
      ]);
      testResults.counts = {
        inquiries: inquiries.count || 0,
        leads: leads.count || 0,
        aiLeads: aiLeads.count || 0,
        products: products.count || 0
      };
    } catch (e: any) {
      testResults.counts = { status: '❌', error: e.message };
    }

    console.log('🧪 Backend Test Results:', testResults);
    setResults(testResults);
    setLoading(false);
  }

  if (loading) return <div className="p-4">Running tests...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-6">🧪 Backend Test Report</h1>

        <div className="space-y-4">
          <div className="border p-4 rounded">
            <h3 className="font-bold">1. Supabase Connection</h3>
            <p className={results.connection?.status === '✅' ? 'text-green-600' : 'text-red-600'}>
              {results.connection?.status} {results.connection?.data || results.connection?.error}
            </p>
          </div>

          <div className="border p-4 rounded">
            <h3 className="font-bold">2. Inquiry Insert</h3>
            <p className={results.inquiry?.status === '✅' ? 'text-green-600' : 'text-red-600'}>
              {results.inquiry?.status} {results.inquiry?.message || results.inquiry?.error}
            </p>
          </div>

          <div className="border p-4 rounded">
            <h3 className="font-bold">3. Lead Insert</h3>
            <p className={results.lead?.status === '✅' ? 'text-green-600' : 'text-red-600'}>
              {results.lead?.status} {results.lead?.message || results.lead?.error}
            </p>
          </div>

          <div className="border p-4 rounded">
            <h3 className="font-bold">4. AI Lead Insert</h3>
            <p className={results.aiLead?.status === '✅' ? 'text-green-600' : 'text-red-600'}>
              {results.aiLead?.status} {results.aiLead?.message || results.aiLead?.error}
            </p>
          </div>

          <div className="border p-4 rounded">
            <h3 className="font-bold">5. Data Counts</h3>
            <pre className="bg-gray-100 p-2 rounded text-sm">
              {JSON.stringify(results.counts, null, 2)}
            </pre>
          </div>
        </div>

        <button
          onClick={() => { setLoading(true); runTests(); }}
          className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Run Again
        </button>
      </div>
    </div>
  );
}
