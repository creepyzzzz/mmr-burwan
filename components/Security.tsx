import React from 'react';
import { Lock, Database, FileCheck } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';

const Security: React.FC = () => {
  const { t } = useTranslation('landing');
  
  return (
    <section className="py-14 sm:py-16 lg:py-20 px-4 sm:px-6 bg-white border-y border-gray-100">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-8 sm:gap-12 lg:gap-16">
        
        <div className="lg:w-1/2 w-full">
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-gray-900 mb-4 sm:mb-6 text-center lg:text-left">{t('security.title')}</h2>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 mb-6 sm:mb-8 leading-relaxed text-center lg:text-left">
            {t('security.description')}
          </p>
          
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-gray-50 border border-gray-100 hover:border-gold-200 transition-colors">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 text-green-700 rounded-lg flex items-center justify-center flex-shrink-0">
                <Lock size={16} className="sm:w-5 sm:h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 text-sm sm:text-base">{t('security.encryption.title')}</h4>
                <p className="text-[11px] sm:text-xs text-gray-500">{t('security.encryption.desc')}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-gray-50 border border-gray-100 hover:border-gold-200 transition-colors">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 text-blue-700 rounded-lg flex items-center justify-center flex-shrink-0">
                <Database size={16} className="sm:w-5 sm:h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 text-sm sm:text-base">{t('security.auditLogs.title')}</h4>
                <p className="text-[11px] sm:text-xs text-gray-500">{t('security.auditLogs.desc')}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-gray-50 border border-gray-100 hover:border-gold-200 transition-colors">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 text-purple-700 rounded-lg flex items-center justify-center flex-shrink-0">
                <FileCheck size={16} className="sm:w-5 sm:h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 text-sm sm:text-base">{t('security.verification.title')}</h4>
                <p className="text-[11px] sm:text-xs text-gray-500">{t('security.verification.desc')}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:w-1/2 w-full flex justify-center mt-4 sm:mt-0">
          <div className="relative w-full max-w-xs sm:max-w-sm lg:max-w-md aspect-square bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl sm:rounded-2xl shadow-xl sm:shadow-2xl p-6 sm:p-8 flex flex-col items-center justify-center text-center text-white overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
            <div className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-full border-2 border-gold-500 flex items-center justify-center mb-4 sm:mb-6 shadow-[0_0_30px_rgba(212,175,55,0.3)]">
               <Lock size={24} className="sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-gold-400" />
            </div>
            <h3 className="font-serif text-lg sm:text-xl lg:text-2xl mb-1.5 sm:mb-2">{t('security.portal.title')}</h3>
            <p className="text-gray-400 text-xs sm:text-sm mb-6 sm:mb-8">{t('security.portal.subtitle')}</p>
            <div className="w-full h-1 bg-gray-700 rounded-full overflow-hidden">
               <div className="h-full w-1/2 bg-gold-500 animate-shimmer relative"></div>
            </div>
            <p className="mt-3 sm:mt-4 text-[9px] sm:text-[10px] uppercase tracking-widest text-gold-500">{t('security.portal.status')}</p>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Security;