import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, leftIcon, rightIcon, className = '', id, ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-small font-medium text-navy mb-1.5">
            {label}
            {props.required && <span className="text-danger ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={`
              w-full px-4 py-2
              text-body text-gray-900
              bg-white rounded-md
              border ${error ? 'border-danger' : 'border-surface-300'}
              focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent
              placeholder:text-gray-400
              disabled:bg-surface-100 disabled:cursor-not-allowed
              ${leftIcon ? 'pl-10' : ''}
              ${rightIcon ? 'pr-10' : ''}
              ${className}
            `}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              {rightIcon}
            </div>
          )}
        </div>
        {error && <p className="mt-1 text-small text-danger">{error}</p>}
        {helperText && !error && <p className="mt-1 text-small text-gray-500">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, className = '', id, ...props }, ref) => {
    const inputId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
    
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-small font-medium text-navy mb-1.5">
            {label}
            {props.required && <span className="text-danger ml-1">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          className={`
            w-full px-4 py-2
            text-body text-gray-900
            bg-white rounded-md
            border ${error ? 'border-danger' : 'border-surface-300'}
            focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent
            placeholder:text-gray-400
            disabled:bg-surface-100 disabled:cursor-not-allowed
            resize-y min-h-[80px]
            ${className}
          `}
          {...props}
        />
        {error && <p className="mt-1 text-small text-danger">{error}</p>}
        {helperText && !error && <p className="mt-1 text-small text-gray-500">{helperText}</p>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, className = '', id, ...props }, ref) => {
    const inputId = id || `select-${Math.random().toString(36).substr(2, 9)}`;
    
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-small font-medium text-navy mb-1.5">
            {label}
            {props.required && <span className="text-danger ml-1">*</span>}
          </label>
        )}
        <select
          ref={ref}
          id={inputId}
          className={`
            w-full px-4 py-2
            text-body text-gray-900
            bg-white rounded-md
            border ${error ? 'border-danger' : 'border-surface-300'}
            focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent
            disabled:bg-surface-100 disabled:cursor-not-allowed
            ${className}
          `}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <p className="mt-1 text-small text-danger">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Input;
