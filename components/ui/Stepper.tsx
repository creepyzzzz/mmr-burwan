import React from 'react';
import { Check, ChevronRight } from 'lucide-react';

interface Step {
  id: string;
  label: string;
  description?: string;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
  completedSteps?: number[];
  className?: string;
}

const Stepper: React.FC<StepperProps> = ({
  steps,
  currentStep,
  completedSteps = [],
  className = '',
}) => {
  const isCompleted = (index: number) => completedSteps.includes(index) || index < currentStep;
  const isCurrent = (index: number) => index === currentStep;

  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const completed = isCompleted(index);
          const current = isCurrent(index);
          
          return (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center flex-1 relative">
                {/* Step Circle */}
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center relative z-10
                    transition-all duration-300
                    ${completed
                      ? 'bg-gold-500 text-white shadow-md'
                      : current
                      ? 'bg-gold-100 border-2 border-gold-500 text-gold-700 font-semibold'
                      : 'bg-gray-100 border-2 border-gray-300 text-gray-400'
                    }
                  `}
                >
                  {completed ? (
                    <Check size={20} />
                  ) : (
                    <span className="text-sm font-medium">{index + 1}</span>
                  )}
                </div>
                
                {/* Connector Arrow - positioned absolutely to align with circle center */}
                {index < steps.length - 1 && (
                  <div 
                    className="absolute top-0 left-full z-0 flex items-center justify-center"
                    style={{ 
                      width: '24px',
                      height: '40px',
                      transform: 'translateX(-50%)'
                    }}
                  >
                    <ChevronRight
                      size={20}
                      className={`
                        transition-all duration-300
                        ${completed ? 'text-gold-500' : 'text-gray-300'}
                      `}
                    />
                  </div>
                )}
                
                {/* Step Label */}
                <div className="mt-3 text-center max-w-[120px]">
                  <p
                    className={`
                      text-xs font-medium
                      ${current ? 'text-gold-700' : completed ? 'text-gray-700' : 'text-gray-400'}
                    `}
                  >
                    {step.label}
                  </p>
                  {step.description && (
                    <p className="text-xs text-gray-500 mt-1 hidden sm:block">
                      {step.description}
                    </p>
                  )}
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default Stepper;

