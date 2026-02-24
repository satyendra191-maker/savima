import React, { useState } from 'react';
import { Check, ChevronRight, ChevronLeft, Upload, FileText, X } from 'lucide-react';

export const RFQForm: React.FC = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        // Step 1: Contact
        name: '',
        email: '',
        company: '',
        phone: '',
        // Step 2: Product
        category: '',
        material: '',
        quantity: '',
        drawing: null as File | null,
        // Step 3: Details
        incoterms: 'EXW',
        urgency: 'normal',
        notes: '',
        reference: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFormData({ ...formData, drawing: e.target.files[0] });
        }
    };

    const removeDrawing = () => {
        setFormData({ ...formData, drawing: null });
    };

    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert("Quote Request Submitted! (Demo)");
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 pt-24">
            <div className="max-w-3xl mx-auto px-4">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Request for Quote</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2">Complete the steps below to receive a detailed manufacturing quote.</p>
                </div>

                {/* Progress Steps */}
                <div className="flex justify-between mb-8 relative">
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-neutral-200 -z-10"></div>
                    {[1, 2, 3].map((s) => (
                        <div key={s} className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${step >= s ? 'bg-primary-500 text-white' : 'bg-neutral-200 text-neutral-500'}`}>
                            {step > s ? <Check size={20} /> : s}
                        </div>
                    ))}
                </div>

                <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg p-8 border border-gray-100 dark:border-slate-800">

                    {/* Step 1: Contact Info */}
                    {step === 1 && (
                        <div className="animate-fade-in">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Contact Information</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Full Name *</label>
                                    <input required name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border-2 border-slate-300 dark:border-slate-600 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Email Address *</label>
                                    <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border-2 border-slate-300 dark:border-slate-600 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Company Name</label>
                                    <input name="company" value={formData.company} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border-2 border-slate-300 dark:border-slate-600 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Phone Number</label>
                                    <input name="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border-2 border-slate-300 dark:border-slate-600 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Product Details */}
                    {step === 2 && (
                        <div className="animate-fade-in">
                            <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-6">Product Requirements</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Product Category</label>
                                    <select name="category" value={formData.category} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border-2 border-slate-300 dark:border-slate-600 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none">
                                        <option value="">Select Category</option>
                                        <option value="brass">Brass Components</option>
                                        <option value="steel">Steel Components</option>
                                        <option value="custom">Custom Fabrication</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Material Grade</label>
                                    <input name="material" placeholder="e.g. SS 304, Brass C360" value={formData.material} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border-2 border-slate-300 dark:border-slate-600 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Estimated Quantity</label>
                                    <input name="quantity" type="number" value={formData.quantity} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border-2 border-slate-300 dark:border-slate-600 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Reference/Drawing</label>
                                    {!formData.drawing ? (
                                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-neutral-300 dark:border-neutral-600 rounded-lg cursor-pointer bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition">
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <Upload className="w-8 h-8 mb-2 text-neutral-400" />
                                                <p className="mb-2 text-sm text-neutral-500 dark:text-neutral-400"><span className="font-semibold">Click to upload</span></p>
                                                <p className="text-xs text-neutral-500 dark:text-neutral-500">PDF, STEP, CAD (Max 10MB)</p>
                                            </div>
                                            <input type="file" className="hidden" accept=".pdf,.step,.stp,.dwg,.dxf,.jpg,.jpeg,.png" onChange={handleFileChange} />
                                        </label>
                                    ) : (
                                        <div className="flex items-center justify-between p-3 bg-primary-50 dark:bg-primary-900/30 border border-primary-200 dark:border-primary-700 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <FileText className="text-primary-600 dark:text-primary-400" size={20} />
                                                <div>
                                                    <span className="text-sm text-neutral-700 dark:text-neutral-300 truncate max-w-[200px] block">{formData.drawing.name}</span>
                                                    <span className="text-xs text-neutral-400">({(formData.drawing.size / 1024 / 1024).toFixed(2)} MB)</span>
                                                </div>
                                            </div>
                                            <button type="button" onClick={removeDrawing} className="text-neutral-400 hover:text-red-500 transition-colors">
                                                <X size={18} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Shipping & Urgency */}
                    {step === 3 && (
                        <div className="animate-fade-in">
                            <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-6">Shipping & Details</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Incoterms</label>
                                    <select name="incoterms" value={formData.incoterms} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border-2 border-slate-300 dark:border-slate-600 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none">
                                        <option value="EXW">EXW - Ex Works</option>
                                        <option value="FOB">FOB - Free on Board</option>
                                        <option value="CIF">CIF - Cost, Insurance & Freight</option>
                                        <option value="DDP">DDP - Delivered Duty Paid</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Urgency</label>
                                    <select name="urgency" value={formData.urgency} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border-2 border-slate-300 dark:border-slate-600 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none">
                                        <option value="normal">Normal (7-10 Days)</option>
                                        <option value="high">High Priority (3-5 Days)</option>
                                        <option value="critical">Critical (Express)</option>
                                    </select>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Additional Notes</label>
                                    <textarea name="notes" rows={4} value={formData.notes} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border-2 border-slate-300 dark:border-slate-600 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"></textarea>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-between mt-8 pt-6 border-t border-neutral-100 dark:border-neutral-700">
                        {step > 1 ? (
                            <button type="button" onClick={prevStep} className="flex items-center gap-2 text-neutral-600 dark:text-neutral-300 font-medium hover:text-primary-600">
                                <ChevronLeft size={20} /> Back
                            </button>
                        ) : <div></div>}

                        {step < 3 ? (
                            <button type="button" onClick={nextStep} className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl flex items-center gap-2">
                                Next Step <ChevronRight size={20} />
                            </button>
                        ) : (
                            <button type="submit" className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl flex items-center gap-2">
                                Submit Request <Check size={20} />
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};
