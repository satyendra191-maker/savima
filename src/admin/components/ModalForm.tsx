import React, { useState, useEffect } from 'react';
import { X, Save, Loader2 } from 'lucide-react';

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'textarea' | 'select' | 'checkbox' | 'switch' | 'file' | 'date' | 'datetime';
  placeholder?: string;
  required?: boolean;
  options?: { label: string; value: string }[];
  rows?: number;
  accept?: string;
  multiple?: boolean;
  min?: number;
  max?: number;
  disabled?: boolean;
  className?: string;
  validation?: (value: any) => string | null;
}

interface ModalFormProps {
  isOpen: boolean;
  title: string;
  fields: FormField[];
  initialValues?: Record<string, any>;
  onSubmit: (values: Record<string, any>) => Promise<void>;
  onClose: () => void;
  submitText?: string;
  loading?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const ModalForm: React.FC<ModalFormProps> = ({
  isOpen,
  title,
  fields,
  initialValues = {},
  onSubmit,
  onClose,
  submitText = 'Save',
  loading = false,
  size = 'md'
}) => {
  const [values, setValues] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (isOpen) {
      setValues(initialValues);
      setErrors({});
      setTouched({});
    }
  }, [isOpen, initialValues]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };

  const handleChange = (name: string, value: any) => {
    setValues(prev => ({ ...prev, [name]: value }));
    if (touched[name]) {
      validateField(name, value);
    }
  };

  const handleBlur = (name: string) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    validateField(name, values[name]);
  };

  const validateField = (name: string, value: any): boolean => {
    const field = fields.find(f => f.name === name);
    if (!field) return true;

    let error: string | null = null;

    if (field.required && !value && value !== false) {
      error = `${field.label} is required`;
    }

    if (field.type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        error = 'Please enter a valid email address';
      }
    }

    if (field.validation) {
      error = field.validation(value);
    }

    setErrors(prev => ({ ...prev, [name]: error || '' }));
    return !error;
  };

  const validateAll = (): boolean => {
    let isValid = true;
    fields.forEach(field => {
      const fieldValid = validateField(field.name, values[field.name]);
      if (!fieldValid) isValid = false;
      setTouched(prev => ({ ...prev, [field.name]: true }));
    });
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateAll()) return;
    
    try {
      await onSubmit(values);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const renderField = (field: FormField) => {
    const value = values[field.name];
    const error = errors[field.name];
    const isTouched = touched[field.name];

    const inputClasses = `w-full px-4 py-2.5 border rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors ${
      error && isTouched
        ? 'border-red-500 focus:ring-red-500'
        : 'border-gray-200 dark:border-gray-600 focus:ring-brass-500'
    } ${field.disabled ? 'opacity-50 cursor-not-allowed' : ''}`;

    switch (field.type) {
      case 'textarea':
        return (
          <textarea
            value={value || ''}
            onChange={(e) => handleChange(field.name, e.target.value)}
            onBlur={() => handleBlur(field.name)}
            placeholder={field.placeholder}
            rows={field.rows || 4}
            disabled={field.disabled}
            className={inputClasses}
          />
        );

      case 'select':
        return (
          <select
            value={value || ''}
            onChange={(e) => handleChange(field.name, e.target.value)}
            onBlur={() => handleBlur(field.name)}
            disabled={field.disabled}
            className={inputClasses}
          >
            <option value="">{field.placeholder || 'Select an option'}</option>
            {field.options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'checkbox':
        return (
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={value || false}
              onChange={(e) => handleChange(field.name, e.target.checked)}
              className="w-5 h-5 rounded border-gray-300 text-brass-500 focus:ring-brass-500"
            />
            <span className="text-sm text-gray-600 dark:text-gray-300">{field.label}</span>
          </label>
        );

      case 'switch':
        return (
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-sm text-gray-600 dark:text-gray-300">{field.label}</span>
            <button
              type="button"
              role="switch"
              aria-checked={value}
              onClick={() => handleChange(field.name, !value)}
              disabled={field.disabled}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                value ? 'bg-brass-500' : 'bg-gray-200 dark:bg-gray-600'
              } ${field.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  value ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </label>
        );

      case 'file':
        return (
          <div>
            {value && typeof value === 'string' && (
              <div className="mb-2 p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <a href={value} target="_blank" rel="noopener noreferrer" className="text-brass-500 hover:underline text-sm">
                  View current file
                </a>
              </div>
            )}
            <input
              type="file"
              accept={field.accept}
              multiple={field.multiple}
              onChange={(e) => handleChange(field.name, e.target.files?.[0])}
              disabled={field.disabled}
              className={inputClasses}
            />
          </div>
        );

      case 'date':
      case 'datetime':
        return (
          <input
            type={field.type === 'datetime' ? 'datetime-local' : 'date'}
            value={value || ''}
            onChange={(e) => handleChange(field.name, e.target.value)}
            onBlur={() => handleBlur(field.name)}
            disabled={field.disabled}
            className={inputClasses}
          />
        );

      case 'number':
        return (
          <input
            type="number"
            value={value || ''}
            onChange={(e) => handleChange(field.name, e.target.value)}
            onBlur={() => handleBlur(field.name)}
            placeholder={field.placeholder}
            min={field.min}
            max={field.max}
            disabled={field.disabled}
            className={inputClasses}
          />
        );

      default:
        return (
          <input
            type={field.type}
            value={value || ''}
            onChange={(e) => handleChange(field.name, e.target.value)}
            onBlur={() => handleBlur(field.name)}
            placeholder={field.placeholder}
            disabled={field.disabled}
            className={inputClasses}
          />
        );
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full ${sizeClasses[size]} max-h-[90vh] overflow-hidden flex flex-col`}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4">
            {fields.map(field => (
              <div key={field.name} className={field.className}>
                {field.type !== 'checkbox' && field.type !== 'switch' && (
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                )}
                {renderField(field)}
                {errors[field.name] && touched[field.name] && (
                  <p className="mt-1 text-sm text-red-500">{errors[field.name]}</p>
                )}
              </div>
            ))}
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-brass-500 text-white rounded-xl hover:bg-brass-600 transition-colors disabled:opacity-50"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {submitText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalForm;
