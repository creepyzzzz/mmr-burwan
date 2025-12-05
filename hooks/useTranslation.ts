import { useTranslation as useI18nTranslation } from 'react-i18next';

export const useTranslation = (namespace?: string) => {
  const { t, i18n } = useI18nTranslation(namespace);
  
  const changeLanguage = (lng: 'en' | 'bn') => {
    i18n.changeLanguage(lng);
    localStorage.setItem('i18nextLng', lng);
  };

  return {
    t,
    currentLanguage: i18n.language as 'en' | 'bn',
    changeLanguage,
    isRTL: false,
  };
};

