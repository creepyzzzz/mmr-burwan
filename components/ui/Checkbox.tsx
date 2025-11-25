import React, { forwardRef } from 'react';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        <label className="flex items-start gap-3 cursor-pointer group">
          <div className="relative flex-shrink-0 mt-0.5">
            <input
              ref={ref}
              type="checkbox"
              className="sr-only peer"
              {...props}
            />
            <div className={`
              w-5 h-5 rounded-md border-2 transition-all duration-200
              ${error 
                ? 'border-rose-300' 
                : 'border-gray-300 peer-checked:border-gold-500 peer-checked:bg-gold-500'
              }
              peer-focus:ring-2 peer-focus:ring-gold-500 peer-focus:ring-offset-0
              peer-checked:after:content-['✓'] peer-checked:after:text-white
              peer-checked:after:absolute peer-checked:after:inset-0
              peer-checked:after:flex peer-checked:after:items-center peer-checked:after:justify-center
              peer-checked:after:text-xs peer-checked:after:font-bold
            `} />
          </div>
          {label && (
            <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
              {label}
              {props.required && <span className="text-rose-600 ml-1">*</span>}
            </span>
          )}
        </label>
        {error && (
          <p className="mt-1.5 text-sm text-rose-600">{error}</p>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;

