import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';

const Footer: React.FC = () => {
  const { t } = useTranslation('common');
  
  return (
    <footer className="bg-gray-50 border-t border-gray-200 pt-10 sm:pt-12 lg:pt-16 pb-6 sm:pb-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 lg:gap-12 mb-8 sm:mb-10 lg:mb-12">
          
          <div className="col-span-2 sm:col-span-2 md:col-span-1">
             <div className="flex items-center gap-2.5 sm:gap-3 mb-4 sm:mb-6">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gold-500 flex items-center justify-center text-white font-serif font-bold text-sm sm:text-base">M</div>
                <span className="font-serif font-bold text-gray-900 text-sm sm:text-base">MMR Burwan</span>
             </div>
             <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
               {t('footer.description')}
             </p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">{t('footer.quickLinks')}</h4>
            <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-600">
              <li><Link to="/" className="hover:text-gold-600 transition-colors">{t('navigation.home')}</Link></li>
              <li><Link to="/auth/register" className="hover:text-gold-600 transition-colors">{t('footer.applyOnline')}</Link></li>
              <li><Link to="/dashboard" className="hover:text-gold-600 transition-colors">{t('footer.checkStatus')}</Link></li>
              <li><Link to="/verify" className="hover:text-gold-600 transition-colors">{t('footer.verifyCertificate')}</Link></li>
            </ul>
          </div>

          <div>
             <h4 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">{t('footer.legalHelp')}</h4>
             <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-600">
              <li><Link to="/privacy" className="hover:text-gold-600 transition-colors">{t('footer.privacyPolicy')}</Link></li>
              <li><a href="/privacy" className="hover:text-gold-600 transition-colors">{t('footer.termsOfService')}</a></li>
              <li><Link to="/help" className="hover:text-gold-600 transition-colors">{t('footer.guidelines')}</Link></li>
              <li><Link to="/help" className="hover:text-gold-600 transition-colors">{t('footer.supportCenter')}</Link></li>
            </ul>
          </div>

           <div className="col-span-2 sm:col-span-1">
             <h4 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">{t('footer.contact')}</h4>
             <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-600">
              <li>{t('footer.helpline')}: <span className="text-gray-900 font-medium">1800-123-4567</span></li>
              <li>Email: <span className="text-gray-900 font-medium">support@mmr.gov.in</span></li>
              <li>{t('footer.workingHours')}</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6 sm:pt-8 flex flex-col items-center text-center gap-2 sm:gap-3 text-[10px] sm:text-xs text-gray-500">
           <p className="px-2">
             {t('footer.disclaimer')}{' '}
             <a 
               href="https://www.epplicon.net" 
               target="_blank" 
               rel="noopener noreferrer"
               className="text-gold-600 hover:text-gold-700 font-medium hover:underline transition-all"
             >
               Epplicon Technologies
             </a>
           </p>
           <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
             <a 
                href="https://www.mmrburwan.com"
                className="hover:text-gray-800 transition-colors font-medium"
             >
               {t('footer.officialSite')}
             </a>
             <span className="hidden sm:inline text-gray-300">|</span>
             <span>{t('footer.copyright')}</span>
           </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;