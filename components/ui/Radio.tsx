import React, { forwardRef } from 'react';

interface RadioOption {
  value: string;
  label: string;
}

interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
  options: RadioOption[];
  name: string;
}

const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ label, error, options, name, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-3">
            {label}
            {props.required && <span className="text-rose-600 ml-1">*</span>}
          </label>
        )}
        <div className="space-y-2">
          {options.map((option) => (
            <label
              key={option.value}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="relative flex-shrink-0">
                <input
                  ref={ref}
                  type="radio"
                  name={name}
                  value={option.value}
                  className="sr-only peer"
                  {...props}
                />
                <div className={`
                  w-5 h-5 rounded-full border-2 transition-all duration-200
                  ${error 
                    ? 'border-rose-300' 
                    : 'border-gray-300 peer-checked:border-gold-500'
                  }
                  peer-focus:ring-2 peer-focus:ring-gold-500 peer-focus:ring-offset-0
                  peer-checked:after:content-[''] peer-checked:after:absolute
                  peer-checked:after:inset-1 peer-checked:after:rounded-full
                  peer-checked:after:bg-gold-500
                `} />
              </div>
              <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
                {option.label}
              </span>
            </label>
          ))}
        </div>
        {error && (
          <p className="mt-1.5 text-sm text-rose-600">{error}</p>
        )}
      </div>
    );
  }
);

Radio.displayName = 'Radio';

export default Radio;

