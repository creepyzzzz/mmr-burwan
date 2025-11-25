import React, { forwardRef, useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';

interface PhoneInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'value' | 'onChange'> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  value?: string;
  onChange?: (value: string) => void;
}

const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ label, error, helperText, leftIcon, value = '', onChange, className = '', ...props }, ref) => {
    const [phoneValue, setPhoneValue] = useState(value);

    useEffect(() => {
      setPhoneValue(value);
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      // Only allow digits, max 10 digits
      const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
      setPhoneValue(digits);
      if (onChange) {
        onChange(digits);
      }
    };

    const displayValue = phoneValue ? `+91 ${phoneValue}` : '+91 ';

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}
            {props.required && <span className="text-rose-600 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10 flex items-center">
              {leftIcon}
            </div>
          )}
          {/* Non-editable prefix - positioned after icon with proper spacing */}
          <div 
            className={`absolute top-1/2 -translate-y-1/2 text-gray-700 font-medium pointer-events-none z-10 ${
              leftIcon ? 'left-12' : 'left-3'
            }`}
          >
            +91
          </div>
          <input
            ref={ref}
            type="text"
            inputMode="numeric"
            value={phoneValue}
            onChange={handleChange}
            className={`
              w-full px-4 py-3 rounded-xl border transition-all duration-200
              ${leftIcon ? 'pl-24' : 'pl-14'}
              ${error ? 'pr-10' : ''}
              ${error 
                ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500' 
                : 'border-gray-200 focus:border-gold-500 focus:ring-gold-500'
              }
              ${props.disabled ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : ''}
              focus:outline-none focus:ring-2 focus:ring-offset-0
              placeholder:text-gray-400
              ${className}
            `}
            placeholder="Enter 10-digit mobile number"
            maxLength={10}
            {...props}
          />
          {error && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-rose-500">
              <AlertCircle size={20} />
            </div>
          )}
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

PhoneInput.displayName = 'PhoneInput';

export default PhoneInput;

