import React from 'react';
import { UserPlus, Upload, CheckCircle, Download } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';

const HowItWorks: React.FC = () => {
  const { t } = useTranslation('landing');
  
  const steps = [
    { id: 1, title: t('howItWorks.steps.register.title'), desc: t('howItWorks.steps.register.desc'), icon: UserPlus },
    { id: 2, title: t('howItWorks.steps.upload.title'), desc: t('howItWorks.steps.upload.desc'), icon: Upload },
    { id: 3, title: t('howItWorks.steps.verify.title'), desc: t('howItWorks.steps.verify.desc'), icon: CheckCircle },
    { id: 4, title: t('howItWorks.steps.download.title'), desc: t('howItWorks.steps.download.desc'), icon: Download },
  ];
  return (
    <section id="how-it-works" className="py-14 sm:py-20 lg:py-24 px-4 sm:px-6 bg-rose-50/50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10 sm:mb-14 lg:mb-20">
            <span className="text-gold-600 text-[10px] sm:text-xs font-bold tracking-widest uppercase mb-1.5 sm:mb-2 block">{t('howItWorks.badge')}</span>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-gray-900">{t('howItWorks.title')}</h2>
        </div>

        <div className="relative">
          {/* Connector Line (Desktop) */}
          <div className="hidden md:block absolute top-8 left-0 w-full h-0.5 bg-gray-200 z-0"></div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 lg:gap-12">
            {steps.map((step, idx) => (
              <div key={step.id} className="relative z-10 group">
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full bg-white border-2 sm:border-4 border-rose-50 text-gold-500 flex items-center justify-center shadow-md sm:shadow-lg mb-3 sm:mb-4 lg:mb-6 group-hover:scale-110 group-hover:border-gold-200 transition-all duration-300">
                    <step.icon size={20} className="sm:w-6 sm:h-6 lg:w-7 lg:h-7" />
                  </div>
                  <h3 className="font-serif text-sm sm:text-lg lg:text-xl font-bold text-gray-900 mb-1 sm:mb-2">{step.title}</h3>
                  <p className="text-[11px] sm:text-xs lg:text-sm text-gray-500 px-1 sm:px-2 lg:px-4 leading-relaxed">{step.desc}</p>
                  
                  {/* Step Number Badge */}
                  <div className="absolute -top-1 right-1/4 sm:-top-2 sm:right-1/4 bg-gray-900 text-white text-[9px] sm:text-[10px] font-bold w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center">
                    {step.id}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;