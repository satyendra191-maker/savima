import React, { useState } from 'react';
import { InquiryService } from '../src/lib/supabase';
import { MapPin, Phone, Mail, Clock, Upload, Loader2, FileText, X, Building } from 'lucide-react';

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: ''
  });
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      const maxSize = 5 * 1024 * 1024; // 5MB
      const allowedExtensions = ['jpg', 'jpeg', 'png', 'pdf', 'step', 'stp', 'dwg', 'dxf'];
      const fileExt = selectedFile.name.split('.').pop()?.toLowerCase();

      if (selectedFile.size > maxSize) {
        setError("File exceeds 5MB limit.");
        return;
      }
      if (!fileExt || !allowedExtensions.includes(fileExt)) {
        setError("Invalid file type. Only JPG, PNG, PDF, STEP, CAD allowed.");
        return;
      }

      setError('');
      setFile(selectedFile);
    }
  };

  const removeFile = () => {
    setFile(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    setError('');

    try {
      let attachmentUrl = '';
      let finalMessage = formData.message;

      if (file) {
        try {
          const url = await InquiryService.uploadAttachment(file);
          if (url) {
            attachmentUrl = url;
            finalMessage += `\n\n[Attached Drawing/File]: ${attachmentUrl}`;
          }
        } catch (upErr) {
          console.error("Upload failed", upErr);
          // Continue but warn
          finalMessage += `\n\n[Attachment Upload Failed. Please email file separately.]`;
        }
      }

      await InquiryService.create({
        ...formData,
        message: finalMessage
      });
      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', company: '', message: '' });
      setFile(null);
    } catch (err: any) {
      console.error("Submission Error:", err);
      // Display the actual error message from Supabase
      setError(err.message || 'Failed to submit inquiry. Please try again or email us directly.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">Contact Us</h1>
          <p className="mt-4 text-xl text-gray-600">Get in touch for quotes, customization, or factory visits.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Info */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 border border-gray-100 dark:border-slate-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Reach Out</h2>

            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="bg-saviman-100 p-3 rounded-lg text-saviman-600">
                  <Building size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Corporate Address</h3>
                  <p className="text-gray-600 dark:text-gray-300 mt-1">
                    302, Parth A, 3/11, Patel Colony,<br />
                    Jamnagar-361008 Gujarat, INDIA
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-saviman-100 p-3 rounded-lg text-saviman-600">
                  <MapPin size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Manufacturing Unit</h3>
                  <p className="text-gray-600 dark:text-gray-300 mt-1">
                    GIDC Industrial Estate, Phase III,<br />
                    Dared, Jamnagar - 361004,<br />
                    Gujarat, India.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-saviman-100 p-3 rounded-lg text-saviman-600">
                  <Mail size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Email</h3>
                  <p className="text-gray-600 dark:text-gray-300 mt-1">export@saviman.com</p>
                  <p className="text-gray-600 dark:text-gray-300">info@saviman.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-saviman-100 p-3 rounded-lg text-saviman-600">
                  <Phone size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Phone</h3>
                  <p className="text-gray-600 dark:text-gray-300 mt-1">+91 95069 43134</p>
                  <p className="text-gray-600 dark:text-gray-300">+91 82997 70889</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-saviman-100 p-3 rounded-lg text-saviman-600">
                  <Clock size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Business Hours</h3>
                  <p className="text-gray-600 dark:text-gray-300 mt-1">Mon - Sat: 9:00 AM - 6:00 PM IST</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 border border-gray-100 dark:border-slate-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Send Inquiry</h2>

            {submitted ? (
              <div className="bg-green-50 border border-green-200 text-green-800 rounded-lg p-6 text-center">
                <h3 className="text-lg font-bold mb-2">Thank You!</h3>
                <p>Your inquiry has been received. Our export team will contact you within 24 hours.</p>
                <button onClick={() => setSubmitted(false)} className="mt-4 text-sm underline text-green-700">Send another</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                  <input
                    type="text"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-saviman-500 focus:ring-saviman-500 border p-3"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Company Name</label>
                  <input
                    type="text"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-saviman-500 focus:ring-saviman-500 border p-3"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
                    <input
                      type="email"
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-saviman-500 focus:ring-saviman-500 border p-3"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone (with Country Code)</label>
                    <input
                      type="tel"
                      required
                      placeholder="+1 555-123-4567"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-saviman-500 focus:ring-saviman-500 border p-3"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Message / Requirement</label>
                  <textarea
                    rows={4}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-saviman-500 focus:ring-saviman-500 border p-3"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Please specify material, quantity, and size requirements..."
                  />
                </div>

                {/* File Upload Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Attach Drawing/Spec (Optional)</label>
                  {!file ? (
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-2 text-gray-400 dark:text-gray-500" />
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span></p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">JPG, PNG, PDF, STEP, CAD (Max 5MB)</p>
                      </div>
                      <input type="file" className="hidden" accept=".jpg,.jpeg,.png,.pdf,.step,.stp,.dwg,.dxf" onChange={handleFileChange} />
                    </label>
                  ) : (
                    <div className="flex items-center justify-between p-3 bg-saviman-50 border border-saviman-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="text-saviman-600" size={20} />
                        <span className="text-sm text-gray-700 truncate max-w-[200px]">{file.name}</span>
                        <span className="text-xs text-gray-400">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                      </div>
                      <button type="button" onClick={removeFile} className="text-gray-400 hover:text-red-500"><X size={18} /></button>
                    </div>
                  )}
                </div>

                {error && <p className="text-red-500 text-sm font-medium bg-red-50 p-2 rounded border border-red-200">{error}</p>}

                <button
                  type="submit"
                  disabled={uploading}
                  className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${uploading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {uploading ? <span className="flex items-center"><Loader2 className="animate-spin mr-2" size={18} /> Sending...</span> : 'Submit Inquiry'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}