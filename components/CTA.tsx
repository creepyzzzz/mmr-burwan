import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const CTA: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <section className="py-28 px-6 bg-gradient-to-b from-white to-rose-50 text-center">
      <div className="max-w-3xl mx-auto">
        <h2 className="font-serif text-4xl md:text-5xl text-gray-900 mb-6">Ready to register your marriage?</h2>
        <p className="text-lg text-gray-600 mb-10">Join thousands of couples who have simplified their official paperwork with MMR Burwan.</p>
        
        <button 
          onClick={() => navigate('/auth/register')}
          className="group relative inline-flex items-center justify-center px-8 py-4 bg-gold-500 text-white rounded-full overflow-hidden shadow-xl shadow-gold-500/30 hover:shadow-2xl hover:shadow-gold-500/40 transition-all duration-300 ease-out hover:-translate-y-1"
        >
          <span className="relative z-10 font-medium flex items-center gap-2 text-lg">
            Start Registration
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-gold-600 to-gold-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </button>
      </div>
    </section>
  );
};

export default CTA;