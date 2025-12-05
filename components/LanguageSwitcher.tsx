import React from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { Globe } from 'lucide-react';
import Button from './ui/Button';

const LanguageSwitcher: React.FC = () => {
  const { currentLanguage, changeLanguage } = useTranslation();

  const toggleLanguage = () => {
    changeLanguage(currentLanguage === 'en' ? 'bn' : 'en');
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="flex items-center gap-2 !text-xs sm:!text-sm"
      aria-label="Change language"
    >
      <Globe size={16} className="sm:w-4 sm:h-4" />
      <span className="font-medium">
        {currentLanguage === 'en' ? 'বাংলা' : 'English'}
      </span>
    </Button>
  );
};

export default LanguageSwitcher;

