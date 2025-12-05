import React from 'react';
import { Globe, Clock, ShieldCheck, Smartphone } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';

const Features: React.FC = () => {
  const { t } = useTranslation('landing');

const features = [
  {
    icon: <Globe className="w-6 h-6" />,
      title: t('features.remoteAccess.title'),
      desc: t('features.remoteAccess.desc')
  },
  {
    icon: <Clock className="w-6 h-6" />,
      title: t('features.fastProcessing.title'),
      desc: t('features.fastProcessing.desc')
  },
  {
    icon: <ShieldCheck className="w-6 h-6" />,
      title: t('features.secureData.title'),
      desc: t('features.secureData.desc')
  },
  {
    icon: <Smartphone className="w-6 h-6" />,
      title: t('features.paperless.title'),
      desc: t('features.paperless.desc')
  }
];
  return (
    <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 bg-white relative overflow-hidden">
       {/* Soft blobs background */}
       <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-40 sm:w-64 h-40 sm:h-64 bg-rose-50 rounded-full mix-blend-multiply filter blur-2xl sm:blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute top-10 right-10 w-40 sm:w-64 h-40 sm:h-64 bg-gold-50 rounded-full mix-blend-multiply filter blur-2xl sm:blur-3xl opacity-70 animate-blob" style={{ animationDelay: "2s" }}></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-10 sm:mb-12 lg:mb-16">
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-gray-900 mb-3 sm:mb-4">{t('features.title')}</h2>
          <p className="text-sm sm:text-base text-gray-500 max-w-2xl mx-auto px-2">{t('features.subtitle')}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 lg:gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group bg-white/50 backdrop-blur-sm border border-rose-100 p-4 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl hover:bg-white hover:border-gold-200 hover:shadow-xl hover:shadow-gold-100/50 transition-all duration-300 hover:-translate-y-2 cursor-default"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-rose-50 text-gold-600 flex items-center justify-center mb-3 sm:mb-4 lg:mb-6 group-hover:bg-gold-500 group-hover:text-white transition-colors duration-300">
                <div className="w-5 h-5 sm:w-6 sm:h-6">{feature.icon}</div>
              </div>
              <h3 className="font-serif text-sm sm:text-lg lg:text-xl font-semibold text-gray-900 mb-1 sm:mb-2">{feature.title}</h3>
              <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;