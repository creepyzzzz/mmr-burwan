import React from 'react';
import { Lock, Database, FileCheck } from 'lucide-react';

const Security: React.FC = () => {
  return (
    <section className="py-20 px-6 bg-white border-y border-gray-100">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
        
        <div className="lg:w-1/2">
          <h2 className="font-serif text-4xl text-gray-900 mb-6">Government-Grade Security & Trust</h2>
          <p className="text-gray-600 text-lg mb-8 leading-relaxed">
            MMR Burwan operates under strict government protocols. Your personal data is encrypted, stored securely, and accessible only to authorized personnel for verification purposes.
          </p>
          
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100 hover:border-gold-200 transition-colors">
              <div className="w-10 h-10 bg-green-100 text-green-700 rounded-lg flex items-center justify-center flex-shrink-0">
                <Lock size={20} />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">256-bit Encryption</h4>
                <p className="text-xs text-gray-500">Bank-level security for all your documents.</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100 hover:border-gold-200 transition-colors">
              <div className="w-10 h-10 bg-blue-100 text-blue-700 rounded-lg flex items-center justify-center flex-shrink-0">
                <Database size={20} />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Secure Audit Logs</h4>
                <p className="text-xs text-gray-500">Every access request is logged and monitored.</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100 hover:border-gold-200 transition-colors">
              <div className="w-10 h-10 bg-purple-100 text-purple-700 rounded-lg flex items-center justify-center flex-shrink-0">
                <FileCheck size={20} />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Official Verification</h4>
                <p className="text-xs text-gray-500">Certificates are digitally signed and verifiable.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:w-1/2 flex justify-center">
          <div className="relative w-full max-w-md aspect-square bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl p-8 flex flex-col items-center justify-center text-center text-white overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
            <div className="w-20 h-20 rounded-full border-2 border-gold-500 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(212,175,55,0.3)]">
               <Lock size={32} className="text-gold-400" />
            </div>
            <h3 className="font-serif text-2xl mb-2">Official Portal</h3>
            <p className="text-gray-400 text-sm mb-8">Verified & Secure Environment</p>
            <div className="w-full h-1 bg-gray-700 rounded-full overflow-hidden">
               <div className="h-full w-1/2 bg-gold-500 animate-shimmer relative"></div>
            </div>
            <p className="mt-4 text-[10px] uppercase tracking-widest text-gold-500">System Operational</p>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Security;