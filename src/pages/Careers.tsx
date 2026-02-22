import React, { useState } from 'react';
import { Briefcase, MapPin, Clock, ChevronRight, Send, Upload, Check, Heart, GraduationCap, Users, Loader2 } from 'lucide-react';
import { CMSCareersService, CMSDonationsService } from '../lib/supabase';

interface Job {
  id: number;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
  requirements: string[];
}

const JOBS: Job[] = [
  {
    id: 1,
    title: "Senior CNC Engineer",
    department: "Engineering",
    location: "Jamnagar, Gujarat",
    type: "Full-time",
    description: "We are looking for an experienced CNC Engineer to lead our machining operations and optimize production processes.",
    requirements: ["5+ years in CNC machining", "Experience with Fanuc/Mitsubishi controls", "B.E. in Mechanical Engineering"]
  },
  {
    id: 2,
    title: "Export Manager",
    department: "Sales",
    location: "Remote / On-site",
    type: "Full-time",
    description: "Manage international client relationships and coordinate shipments to 50+ countries.",
    requirements: ["7+ years in export/import", "Fluency in English & Hindi", "Knowledge of Incoterms"]
  },
  {
    id: 3,
    title: "Quality Assurance Manager",
    department: "Quality",
    location: "Jamnagar, Gujarat",
    type: "Full-time",
    description: "Oversee ISO 9001:2015 compliance and implement advanced quality control measures.",
    requirements: ["ISO Lead Auditor certified", "Experience in manufacturing QC", "Strong analytical skills"]
  },
  {
    id: 4,
    title: "Junior Design Engineer",
    department: "Engineering",
    location: "Jamnagar, Gujarat",
    type: "Full-time",
    description: "Create CAD drawings and technical specifications for custom components.",
    requirements: ["Proficiency in AutoCAD/SolidWorks", "B.E. in Mechanical/Production", "Freshers welcome"]
  }
];

export const Careers: React.FC = () => {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    experience: '',
    message: ''
  });
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [error, setError] = useState('');

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    setApplicationStatus('submitting');
    setError('');

    try {
      let resumeUrl = '';
      
      if (resumeFile) {
        try {
          resumeUrl = await CMSCareersService.uploadResume(resumeFile);
        } catch (uploadError) {
          console.error('Resume upload failed:', uploadError);
          setError('Resume upload failed. Please try again or continue without resume.');
        }
      }

      await CMSCareersService.create({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        position: selectedJob?.title || 'Not specified',
        resume_url: resumeUrl
      });

      setApplicationStatus('success');
      setFormData({ name: '', email: '', phone: '', experience: '', message: '' });
      setResumeFile(null);
    } catch (err: any) {
      console.error('Application submission error:', err);
      setError(err.message || 'Failed to submit application. Please try again.');
      setApplicationStatus('error');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        setError('File size must be less than 5MB');
        return;
      }
      setResumeFile(file);
      setError('');
    }
  };

  const removeResume = () => {
    setResumeFile(null);
  };

  const [showDonationForm, setShowDonationForm] = useState(false);
  const [donationData, setDonationData] = useState({
    name: '',
    email: '',
    amount: 500,
    message: ''
  });
  const [donationStatus, setDonationStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [donationError, setDonationError] = useState('');

  const handleDonate = async (e: React.FormEvent) => {
    e.preventDefault();
    setDonationStatus('submitting');
    setDonationError('');

    try {
      await CMSDonationsService.create({
        donor_name: donationData.name,
        donor_email: donationData.email,
        amount: donationData.amount,
        message: donationData.message,
        payment_method: 'online',
        payment_status: 'completed'
      });

      setDonationStatus('success');
      setDonationData({ name: '', email: '', amount: 500, message: '' });
    } catch (err: any) {
      console.error('Donation error:', err);
      setDonationError(err.message || 'Failed to process donation.');
      setDonationStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Join Our Team</h1>
          <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            Be part of a global manufacturing leader. We offer competitive salaries, growth opportunities, and a culture of excellence.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Job List */}
          <div className="lg:col-span-1 space-y-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Open Positions</h2>
            {JOBS.map((job) => (
              <div 
                key={job.id}
                onClick={() => { setSelectedJob(job); setShowForm(false); setApplicationStatus('idle'); }}
                className={`p-4 rounded-xl cursor-pointer transition-all ${
                  selectedJob?.id === job.id 
                  ? 'bg-brass-500 text-white shadow-lg' 
                  : 'bg-white dark:bg-gray-900 hover:shadow-md border border-gray-100 dark:border-gray-800'
                }`}
              >
                <h3 className={`font-bold ${selectedJob?.id === job.id ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                  {job.title}
                </h3>
                <div className={`flex items-center gap-3 mt-2 text-sm ${selectedJob?.id === job.id ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'}`}>
                  <span className="flex items-center gap-1"><Briefcase size={14} /> {job.department}</span>
                  <span className="flex items-center gap-1"><MapPin size={14} /> {job.location}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Job Details */}
          <div className="lg:col-span-2">
            {selectedJob ? (
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg h-full">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{selectedJob.title}</h2>
                    <div className="flex flex-wrap gap-4 text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1"><Briefcase size={16} /> {selectedJob.department}</span>
                      <span className="flex items-center gap-1"><MapPin size={16} /> {selectedJob.location}</span>
                      <span className="flex items-center gap-1"><Clock size={16} /> {selectedJob.type}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowForm(true)}
                    className="btn-primary"
                  >
                    Apply Now
                  </button>
                </div>

                {!showForm ? (
                  <>
                    <div className="mb-6">
                      <h3 className="font-bold text-gray-900 dark:text-white mb-2">Description</h3>
                      <p className="text-gray-600 dark:text-gray-300">{selectedJob.description}</p>
                    </div>

                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white mb-2">Requirements</h3>
                      <ul className="space-y-2">
                        {selectedJob.requirements.map((req, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                            <ChevronRight size={16} className="text-brass-500" /> {req}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                ) : (
                  <div className="animate-fade-in">
                    {applicationStatus === 'success' ? (
                      <div className="text-center py-12">
                        <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Check size={40} className="text-green-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Application Sent!</h3>
                        <p className="text-gray-500 dark:text-gray-400">We'll review your profile and get back to you within 48 hours.</p>
                        <button 
                          onClick={() => setShowForm(false)}
                          className="mt-6 text-brass-600 font-semibold hover:underline"
                        >
                          View More Jobs
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleApply} className="space-y-4">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Application Form</h3>
                        {error && (
                          <div className="p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-600 dark:text-red-400">
                            {error}
                          </div>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <input 
                            type="text" 
                            placeholder="Full Name *"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800" 
                          />
                          <input 
                            type="email" 
                            placeholder="Email Address *"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800" 
                          />
                          <input 
                            type="tel" 
                            placeholder="Phone Number"
                            value={formData.phone}
                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                            className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800" 
                          />
                          <input 
                            type="text" 
                            placeholder="Years of Experience"
                            value={formData.experience}
                            onChange={(e) => setFormData({...formData, experience: e.target.value})}
                            className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800" 
                          />
                        </div>
                        <textarea 
                          placeholder="Cover Letter / Message" 
                          rows={4}
                          value={formData.message}
                          onChange={(e) => setFormData({...formData, message: e.target.value})}
                          className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800"
                        ></textarea>
                        
                        {!resumeFile ? (
                          <label className="block border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                            <Upload className="mx-auto text-gray-400 mb-2" size={32} />
                            <p className="text-gray-500">Upload Resume (PDF/DOCX, Max 5MB)</p>
                            <input 
                              type="file" 
                              className="hidden" 
                              accept=".pdf,.doc,.docx"
                              onChange={handleFileChange}
                            />
                          </label>
                        ) : (
                          <div className="flex items-center justify-between p-3 bg-primary-50 dark:bg-primary-900/30 border border-primary-200 dark:border-primary-700 rounded-lg">
                            <div className="flex items-center gap-3">
                              <Upload className="text-primary-600 dark:text-primary-400" size={20} />
                              <span className="text-sm text-gray-700 dark:text-gray-300">{resumeFile.name}</span>
                            </div>
                            <button type="button" onClick={removeResume} className="text-gray-400 hover:text-red-500">
                              ✕
                            </button>
                          </div>
                        )}

                        <button 
                          type="submit" 
                          disabled={applicationStatus === 'submitting'}
                          className="w-full bg-primary-500 hover:bg-primary-600 disabled:bg-primary-300 text-white font-bold py-3 px-6 rounded-xl transition-colors flex justify-center items-center gap-2"
                        >
                          {applicationStatus === 'submitting' ? (
                            <>
                              <Loader2 size={18} className="animate-spin" /> Submitting...
                            </>
                          ) : (
                            <>
                              <Send size={18} /> Submit Application
                            </>
                          )}
                        </button>
                      </form>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center bg-white dark:bg-gray-900 rounded-2xl p-12 border border-gray-100 dark:border-gray-800">
                <div className="text-center">
                  <Briefcase size={48} className="mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500">Select a job to view details</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Donate for Education Section */}
        <div className="mt-16 bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-8 md:p-12 text-white">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-white/20 rounded-xl">
                  <Heart className="w-8 h-8" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold">Donate for Education to Vulnerable Children</h2>
              </div>
              <p className="text-white/90 text-lg mb-6">
                At SAVIMAN, we believe in giving back to our community. Your contribution can help provide quality education to underprivileged children in Jamnagar and surrounding areas.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <GraduationCap className="w-5 h-5 text-white/80" />
                  <span className="text-white/90">Provide school supplies and books</span>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-white/80" />
                  <span className="text-white/90">Support teacher training programs</span>
                </div>
                <div className="flex items-center gap-3">
                  <Heart className="w-5 h-5 text-white/80" />
                  <span className="text-white/90">Fund scholarship programs for bright students</span>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              {!showDonationForm ? (
                <>
                  <h3 className="text-xl font-bold mb-4">Make a Difference Today</h3>
                  <p className="text-white/80 mb-6">
                    Every contribution counts. Join us in shaping the future of vulnerable children through education.
                  </p>
                  <button 
                    onClick={() => setShowDonationForm(true)}
                    className="w-full bg-white text-primary-600 font-bold py-3 px-6 rounded-xl hover:bg-white/90 transition-colors flex items-center justify-center gap-2"
                  >
                    <Heart className="w-5 h-5" />
                    Donate Now
                  </button>
                  <p className="text-center text-white/60 text-sm mt-4">
                    All donations are tax-deductible under Section 80G
                  </p>
                </>
              ) : donationStatus === 'success' ? (
                <div className="text-center py-6">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check size={32} className="text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Thank You!</h3>
                  <p className="text-white/80 mb-4">Your donation has been received. We'll send a receipt to your email.</p>
                  <button 
                    onClick={() => { setShowDonationForm(false); setDonationStatus('idle'); }}
                    className="text-white/80 hover:text-white underline"
                  >
                    Make another donation
                  </button>
                </div>
              ) : (
                <form onSubmit={handleDonate} className="space-y-4">
                  <h3 className="text-xl font-bold mb-4">Donate Now</h3>
                  {donationError && (
                    <div className="p-2 bg-red-500/30 rounded-lg text-sm text-white">
                      {donationError}
                    </div>
                  )}
                  <input 
                    type="text" 
                    placeholder="Your Name *"
                    required
                    value={donationData.name}
                    onChange={(e) => setDonationData({...donationData, name: e.target.value})}
                    className="w-full p-3 rounded-lg border-0 text-gray-900" 
                  />
                  <input 
                    type="email" 
                    placeholder="Email Address *"
                    required
                    value={donationData.email}
                    onChange={(e) => setDonationData({...donationData, email: e.target.value})}
                    className="w-full p-3 rounded-lg border-0 text-gray-900" 
                  />
                  <div>
                    <label className="block text-sm text-white/80 mb-2">Select Amount (₹)</label>
                    <div className="grid grid-cols-3 gap-2 mb-2">
                      {[250, 500, 1000, 2500, 5000, 10000].map((amt) => (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => setDonationData({...donationData, amount: amt})}
                          className={`py-2 rounded-lg font-bold transition-colors ${
                            donationData.amount === amt 
                              ? 'bg-white text-primary-600' 
                              : 'bg-white/20 text-white hover:bg-white/30'
                          }`}
                        >
                          ₹{amt}
                        </button>
                      ))}
                    </div>
                    <input 
                      type="number" 
                      placeholder="Custom Amount"
                      value={donationData.amount}
                      onChange={(e) => setDonationData({...donationData, amount: parseInt(e.target.value) || 0})}
                      className="w-full p-3 rounded-lg border-0 text-gray-900" 
                    />
                  </div>
                  <textarea 
                    placeholder="Message (Optional)"
                    value={donationData.message}
                    onChange={(e) => setDonationData({...donationData, message: e.target.value})}
                    className="w-full p-3 rounded-lg border-0 text-gray-900"
                    rows={2}
                  ></textarea>
                  <div className="flex gap-2">
                    <button 
                      type="button"
                      onClick={() => setShowDonationForm(false)}
                      className="flex-1 py-3 px-4 bg-white/20 text-white font-bold rounded-xl hover:bg-white/30 transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      disabled={donationStatus === 'submitting'}
                      className="flex-1 py-3 px-4 bg-white text-primary-600 font-bold rounded-xl hover:bg-white/90 transition-colors flex items-center justify-center gap-2"
                    >
                      {donationStatus === 'submitting' ? (
                        <>
                          <Loader2 size={18} className="animate-spin" /> Processing...
                        </>
                      ) : (
                        <>Donate ₹{donationData.amount}</>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
