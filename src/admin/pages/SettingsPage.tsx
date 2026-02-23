import React, { useState, useEffect } from 'react';
import { ModalForm, useToast, FormField } from '../components';
import { SettingsService, SiteSettings } from '../services/crud';
import { Save, Upload, Globe } from 'lucide-react';

export const AdminSettingsPage: React.FC = () => {
  const toast = useToast();
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showLogoModal, setShowLogoModal] = useState(false);
  const [logoType, setLogoType] = useState<'logo' | 'favicon'>('logo');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const data = await SettingsService.get();
      setSettings(data);
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (values: Record<string, any>) => {
    setSaving(true);
    try {
      await SettingsService.update(values);
      toast.success('Settings saved successfully');
      fetchSettings();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save settings');
      throw error;
    } finally {
      setSaving(false);
    }
  };

  const handleLogoUpload = async (values: Record<string, any>) => {
    const file = values.logoFile || values.faviconFile;
    if (!file) {
      toast.error('Please select a file');
      return;
    }

    try {
      const url = await SettingsService.uploadLogo(file);
      if (url) {
        const updateData = logoType === 'logo' 
          ? { logo_url: url }
          : { favicon_url: url };
        
        await SettingsService.update(updateData);
        toast.success(`${logoType === 'logo' ? 'Logo' : 'Favicon'} uploaded successfully`);
        setShowLogoModal(false);
        fetchSettings();
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to upload file');
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brass-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage your website settings</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4">General Settings</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              handleSave(Object.fromEntries(formData));
            }} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Site Name
                  </label>
                  <input
                    type="text"
                    name="site_name"
                    defaultValue={settings?.site_name}
                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Tagline
                  </label>
                  <input
                    type="text"
                    name="tagline"
                    defaultValue={settings?.tagline}
                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    name="contact_email"
                    defaultValue={settings?.contact_email}
                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Contact Phone
                  </label>
                  <input
                    type="text"
                    name="contact_phone"
                    defaultValue={settings?.contact_phone}
                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  WhatsApp
                </label>
                <input
                  type="text"
                  name="whatsapp"
                  defaultValue={settings?.whatsapp}
                  className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Address
                </label>
                <textarea
                  name="address"
                  rows={3}
                  defaultValue={settings?.address}
                  className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Footer Text
                </label>
                <input
                  type="text"
                  name="footer_text"
                  defaultValue={settings?.footer_text}
                  className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-brass-500 text-white rounded-xl hover:bg-brass-600 transition-colors disabled:opacity-50"
              >
                {saving ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Save size={18} />
                )}
                Save Settings
              </button>
            </form>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4">Site Assets</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Logo
                </label>
                {settings?.logo_url ? (
                  <div className="relative group">
                    <img 
                      src={settings.logo_url} 
                      alt="Logo" 
                      className="h-16 object-contain bg-white rounded-lg border border-gray-200 p-2"
                    />
                    <button
                      onClick={() => { setLogoType('logo'); setShowLogoModal(true); }}
                      className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"
                    >
                      <Upload className="text-white" size={24} />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => { setLogoType('logo'); setShowLogoModal(true); }}
                    className="w-full h-16 border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-xl flex items-center justify-center text-gray-400 hover:border-brass-500 hover:text-brass-500 transition-colors"
                  >
                    <Upload size={20} />
                    <span className="ml-2">Upload Logo</span>
                  </button>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Favicon
                </label>
                {settings?.favicon_url ? (
                  <div className="relative group">
                    <img 
                      src={settings.favicon_url} 
                      alt="Favicon" 
                      className="w-12 h-12 object-contain bg-white rounded-lg border border-gray-200 p-1"
                    />
                    <button
                      onClick={() => { setLogoType('favicon'); setShowLogoModal(true); }}
                      className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"
                    >
                      <Upload className="text-white" size={20} />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => { setLogoType('favicon'); setShowLogoModal(true); }}
                    className="w-full h-12 border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-xl flex items-center justify-center text-gray-400 hover:border-brass-500 hover:text-brass-500 transition-colors"
                  >
                    <Upload size={16} />
                    <span className="ml-2">Upload Favicon</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4">Quick Links</h3>
            <div className="space-y-2">
              <a href="/" target="_blank" className="flex items-center gap-2 p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <Globe size={16} />
                View Website
              </a>
              <a href="/admin/dashboard" className="flex items-center gap-2 p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <Globe size={16} />
                Dashboard
              </a>
            </div>
          </div>
        </div>
      </div>

      <ModalForm
        isOpen={showLogoModal}
        title={`Upload ${logoType === 'logo' ? 'Logo' : 'Favicon'}`}
        fields={[
          { 
            name: logoType === 'logo' ? 'logoFile' : 'faviconFile', 
            label: 'Select File', 
            type: 'file', 
            accept: logoType === 'logo' ? 'image/*' : 'image/x-icon,image/png,image/svg+xml' 
          }
        ]}
        onSubmit={handleLogoUpload}
        onClose={() => setShowLogoModal(false)}
        submitText="Upload"
        size="sm"
      />
    </div>
  );
};

export default AdminSettingsPage;
