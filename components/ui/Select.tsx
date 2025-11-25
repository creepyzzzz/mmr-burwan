import React, { forwardRef } from 'react';
import { AlertCircle, ChevronDown } from 'lucide-react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: Array<{ value: string; label: string }>;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, helperText, options, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}
            {props.required && <span className="text-rose-600 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            className={`
              w-full px-4 py-3 pr-10 rounded-xl border transition-all duration-200
              appearance-none bg-white
              ${error 
                ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500' 
                : 'border-gray-200 focus:border-gold-500 focus:ring-gold-500'
              }
              focus:outline-none focus:ring-2 focus:ring-offset-0
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
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
            <ChevronDown size={20} />
          </div>
        </div>
        {error && (
          <p className="mt-1.5 text-sm text-rose-600 flex items-center gap-1">
            <AlertCircle size={14} />
            {error}
          </p>
        )}
        {helperText && !error && (
          <p className="mt-1.5 text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;

