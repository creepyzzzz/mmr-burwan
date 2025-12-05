import React from 'react';
import { QrCode, Calendar, ArrowRight } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';

const Appointment: React.FC = () => {
  const { t } = useTranslation('landing');
  
  return (
    <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 bg-white">
      <div className="max-w-7xl mx-auto bg-gray-900 rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl sm:shadow-2xl flex flex-col md:flex-row">
        
        <div className="p-6 sm:p-10 lg:p-16 md:w-1/2 text-white flex flex-col justify-center">
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl mb-4 sm:mb-6 text-gold-100">{t('appointment.title')}</h2>
          <p className="text-sm sm:text-base lg:text-lg text-gray-300 mb-6 sm:mb-8 leading-relaxed">
            {t('appointment.description')}
          </p>
          
          <div className="flex flex-col gap-3 sm:gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/10 flex items-center justify-center text-gold-400">
                    <Calendar size={16} className="sm:w-5 sm:h-5" />
                </div>
                <span className="font-medium text-sm sm:text-base text-gray-200">{t('appointment.bookSlot')}</span>
            </div>
             <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/10 flex items-center justify-center text-gold-400">
                    <QrCode size={16} className="sm:w-5 sm:h-5" />
                </div>
                <span className="font-medium text-sm sm:text-base text-gray-200">{t('appointment.scanQR')}</span>
            </div>
          </div>
        </div>

        <div className="md:w-1/2 bg-gray-800 relative overflow-hidden min-h-[240px] sm:min-h-[280px] lg:min-h-[300px] flex items-center justify-center p-5 sm:p-8">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 sm:w-56 lg:w-64 h-40 sm:h-56 lg:h-64 bg-gold-500/20 blur-[50px] sm:blur-[80px] rounded-full"></div>

            {/* QR Card Mockup */}
            <div className="relative z-10 bg-white/10 backdrop-blur-xl border border-white/20 p-4 sm:p-6 rounded-xl sm:rounded-2xl w-48 sm:w-56 lg:w-64 shadow-xl sm:shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500 cursor-default group">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                     <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gold-500 flex items-center justify-center text-gray-900 font-serif font-bold text-[10px] sm:text-xs">M</div>
                     <span className="text-[8px] sm:text-[10px] text-gray-400 uppercase tracking-widest">{t('appointment.appointmentLabel')}</span>
                </div>
                <div className="bg-white p-2.5 sm:p-4 rounded-lg sm:rounded-xl mb-3 sm:mb-4 relative overflow-hidden">
                     <QrCode size={72} className="sm:w-24 sm:h-24 lg:w-[100px] lg:h-[100px] text-gray-900 mx-auto" />
                     {/* Shimmer Effect */}
                     <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/80 to-transparent -skew-x-12 animate-shimmer opacity-50"></div>
                </div>
                <div className="text-center">
                    <p className="text-white font-medium text-xs sm:text-sm">{t('appointment.exampleNames')}</p>
                    <p className="text-gold-400 text-[10px] sm:text-xs mt-0.5 sm:mt-1">{t('appointment.exampleDate')}</p>
                </div>
            </div>
        </div>

      </div>
    </section>
  );
};

export default Appointment;