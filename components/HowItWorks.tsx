import React from 'react';
import { UserPlus, Upload, CheckCircle, Download } from 'lucide-react';

const steps = [
  { id: 1, title: "Register", desc: "Create your account using your mobile number.", icon: UserPlus },
  { id: 2, title: "Upload", desc: "Submit necessary Nikah documents digitally.", icon: Upload },
  { id: 3, title: "Verify", desc: "Authorities verify your details securely.", icon: CheckCircle },
  { id: 4, title: "Download", desc: "Get your digital marriage certificate instantly.", icon: Download },
];

const HowItWorks: React.FC = () => {
  return (
    <section id="how-it-works" className="py-24 px-6 bg-rose-50/50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20">
            <span className="text-gold-600 text-xs font-bold tracking-widest uppercase mb-2 block">The Process</span>
            <h2 className="font-serif text-4xl text-gray-900">How it Works</h2>
        </div>

        <div className="relative">
          {/* Connector Line (Desktop) */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -translate-y-1/2 z-0"></div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {steps.map((step, idx) => (
              <div key={step.id} className="relative z-10 group">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-white border-4 border-rose-50 text-gold-500 flex items-center justify-center shadow-lg mb-6 group-hover:scale-110 group-hover:border-gold-200 transition-all duration-300">
                    <step.icon size={28} />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-500 px-4">{step.desc}</p>
                  
                  {/* Step Number Badge */}
                  <div className="absolute -top-2 -right-2 md:top-0 md:right-1/4 bg-gray-900 text-white text-[10px] font-bold w-6 h-6 rounded-full flex items-center justify-center">
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