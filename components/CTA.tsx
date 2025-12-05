import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';

const CTA: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation('landing');
  
  return (
    <section className="py-16 sm:py-20 lg:py-28 px-4 sm:px-6 bg-gradient-to-b from-white to-rose-50 text-center">
      <div className="max-w-3xl mx-auto">
        <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-gray-900 mb-4 sm:mb-6 px-2">{t('cta.title')}</h2>
        <p className="text-sm sm:text-base lg:text-lg text-gray-600 mb-8 sm:mb-10 px-2">{t('cta.subtitle')}</p>
        
        <button 
          onClick={() => navigate('/auth/register')}
          className="group relative inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-gold-500 text-white rounded-full overflow-hidden shadow-lg sm:shadow-xl shadow-gold-500/30 hover:shadow-2xl hover:shadow-gold-500/40 transition-all duration-300 ease-out hover:-translate-y-1"
        >
          <span className="relative z-10 font-medium flex items-center gap-2 text-base sm:text-lg">
            {t('cta.button')}
            <ArrowRight size={18} className="sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-gold-600 to-gold-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </button>
      </div>
    </section>
  );
};

export default CTA;