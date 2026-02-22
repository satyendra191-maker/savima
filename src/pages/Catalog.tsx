import React, { useState } from 'react';
import { FileText, Lock, Download, Check, Loader2, Mail } from 'lucide-react';

interface Catalog {
  id: string;
  title: string;
  description: string;
  pages: number;
  size: string;
  thumbnail: string;
}

const CATALOGS: Catalog[] = [
  {
    id: 'brass',
    title: 'Brass Components Catalog 2024',
    description: 'Complete guide to brass inserts, turned parts, and fasteners. Includes material specifications and CAD drawings.',
    pages: 48,
    size: '4.5 MB',
    thumbnail: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'steel',
    title: 'Stainless Steel Solutions',
    description: 'Technical specifications for SS 304, 316, and specialized alloys for high-corrosion environments.',
    pages: 32,
    size: '3.2 MB',
    thumbnail: 'https://images.unsplash.com/photo-1535952642077-c77874e28633?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'custom',
    title: 'Custom Manufacturing Capabilities',
    description: 'Overview of our CNC, forging, and casting capabilities for custom projects.',
    pages: 24,
    size: '2.8 MB',
    thumbnail: 'https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?auto=format&fit=crop&w=300&q=80'
  }
];

export const CatalogDownload: React.FC = () => {
  const [selectedCatalog, setSelectedCatalog] = useState<string | null>(null);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', company: '', phone: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    // Simulate API call
    setTimeout(() => {
      setStatus('success');
      setIsUnlocked(true);
    }, 1500);
  };

  const handleDownload = (catalogId: string) => {
    // In production, this would trigger actual file download
    alert(`Downloading Catalog ${catalogId}... (Demo)`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Product Catalogs</h1>
          <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            Download our comprehensive technical catalogs. Complete the form to access free PDF downloads.
          </p>
        </div>

        {!isUnlocked ? (
          <div className="max-w-2xl mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-3 mb-6 text-brass-500">
              <Lock size={24} />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Unlock Free Downloads</h2>
            </div>
            
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Please fill in your details to access our technical catalogs. We respect your privacy and will not share your information.
            </p>

            <form onSubmit={handleUnlock} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name *</label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Company Name</label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({...formData, company: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Work Email *</label>
                <input
                  required
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800"
                />
              </div>

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full btn-primary flex justify-center items-center gap-2"
              >
                {status === 'loading' ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    <Mail size={20} /> Unlock Catalogs
                  </>
                )}
              </button>

              <p className="text-xs text-center text-gray-500 mt-4">
                By unlocking, you agree to receive occasional updates from SAVIMAN. You can unsubscribe at any time.
              </p>
            </form>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {CATALOGS.map((catalog) => (
              <div key={catalog.id} className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 border border-gray-100 dark:border-gray-800">
                <div className="h-48 bg-gray-200 relative">
                  <img src={catalog.thumbnail} alt={catalog.title} className="w-full h-full object-cover" />
                  <div className="absolute top-4 right-4 bg-white/90 dark:bg-gray-900/90 px-3 py-1 rounded-full text-xs font-bold text-brass-600">
                    FREE
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{catalog.title}</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">{catalog.description}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                    <span className="flex items-center gap-1"><FileText size={14} /> {catalog.pages} Pages</span>
                    <span className="flex items-center gap-1">{catalog.size}</span>
                  </div>

                  <button
                    onClick={() => handleDownload(catalog.id)}
                    className="w-full btn-primary flex justify-center items-center gap-2"
                  >
                    <Download size={18} /> Download PDF
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {isUnlocked && (
          <div className="mt-12 text-center">
            <p className="text-gray-500 mb-4">Need a custom catalog for your specific requirements?</p>
            <button className="text-brass-600 font-semibold hover:underline">
              Request Custom Quote
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
