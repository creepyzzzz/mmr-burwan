import React from 'react';
import { useNavigate } from 'react-router-dom';
import ActionCard from './ActionCard';
import { FileText, UserMinus, Search } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';

const Services: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation('landing');
  
  return (
    <section id="services" className="py-14 sm:py-20 lg:py-24 px-4 sm:px-6 bg-rose-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-gray-900">{t('services.title')}</h2>
          <p className="text-sm sm:text-base text-gray-500 mt-2 sm:mt-4">{t('services.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            <div className="h-44 sm:h-56 lg:h-64">
                 <ActionCard 
                   icon={<FileText size={24} className="sm:w-7 sm:h-7" />}
                   title={t('services.marriageRegistration.title')}
                   subtitle={t('services.marriageRegistration.subtitle')}
                   color="gold"
                   active={true}
                   onClick={() => navigate('/auth/register')}
                />
            </div>
            <div className="h-44 sm:h-56 lg:h-64">
                 <ActionCard 
                   icon={<UserMinus size={24} className="sm:w-7 sm:h-7" />}
                   title={t('services.divorceRegistration.title')}
                   subtitle={t('services.divorceRegistration.subtitle')}
                   color="rose"
                   onClick={() => navigate('/help')}
                />
            </div>
            <div className="h-44 sm:h-56 lg:h-64">
                 <ActionCard 
                   icon={<Search size={24} className="sm:w-7 sm:h-7" />}
                   title={t('services.certificateVerification.title')}
                   subtitle={t('services.certificateVerification.subtitle')}
                   color="indigo"
                   onClick={() => navigate('/verify')}
                />
            </div>
        </div>
      </div>
    </section>
  );
};

export default Services;