import React from 'react';
import { QrCode, Calendar, ArrowRight } from 'lucide-react';

const Appointment: React.FC = () => {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto bg-gray-900 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row">
        
        <div className="p-10 md:p-16 md:w-1/2 text-white flex flex-col justify-center">
          <h2 className="font-serif text-3xl md:text-4xl mb-6 text-gold-100">One Visit Only</h2>
          <p className="text-gray-300 text-lg mb-8 leading-relaxed">
            Schedule your appointment online. You only need to visit the office once for final verification. Use your digital QR Pass for express check-in.
          </p>
          
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-gold-400">
                    <Calendar size={20} />
                </div>
                <span className="font-medium text-gray-200">Book your slot online</span>
            </div>
             <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-gold-400">
                    <QrCode size={20} />
                </div>
                <span className="font-medium text-gray-200">Scan QR at reception</span>
            </div>
          </div>
        </div>

        <div className="md:w-1/2 bg-gray-800 relative overflow-hidden min-h-[300px] flex items-center justify-center p-8">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gold-500/20 blur-[80px] rounded-full"></div>

            {/* QR Card Mockup */}
            <div className="relative z-10 bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-2xl w-64 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500 cursor-default group">
                <div className="flex items-center justify-between mb-6">
                     <div className="w-8 h-8 rounded-full bg-gold-500 flex items-center justify-center text-gray-900 font-serif font-bold text-xs">M</div>
                     <span className="text-[10px] text-gray-400 uppercase tracking-widest">Appointment</span>
                </div>
                <div className="bg-white p-4 rounded-xl mb-4 relative overflow-hidden">
                     <QrCode size={100} className="text-gray-900 mx-auto" />
                     {/* Shimmer Effect */}
                     <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/80 to-transparent -skew-x-12 animate-shimmer opacity-50"></div>
                </div>
                <div className="text-center">
                    <p className="text-white font-medium text-sm">Ahmed & Fatima</p>
                    <p className="text-gold-400 text-xs mt-1">Oct 24, 2023 • 10:00 AM</p>
                </div>
            </div>
        </div>

      </div>
    </section>
  );
};

export default Appointment;