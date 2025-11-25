import React from 'react';
import { Outlet, Link } from 'react-router-dom';

const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-white to-gold-50 px-6 py-12">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 -z-10 w-[600px] h-[600px] bg-gold-100/30 rounded-full blur-[120px] translate-x-1/3 -translate-y-1/4 animate-pulse-slow"></div>
      <div className="absolute bottom-0 left-0 -z-10 w-[500px] h-[500px] bg-rose-100/30 rounded-full blur-[100px] -translate-x-1/4 translate-y-1/4"></div>
      
      <div className="w-full max-w-md z-10">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 mb-8 justify-center">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shadow-md text-white font-serif font-bold text-xl">
            M
          </div>
          <div className="flex flex-col">
            <span className="font-serif font-bold text-gray-900 leading-none text-xl tracking-tight">MMR Burwan</span>
            <span className="text-[10px] uppercase tracking-widest text-gold-600 font-medium">Official Portal</span>
          </div>
        </Link>
        
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;

