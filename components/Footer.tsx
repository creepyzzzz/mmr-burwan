import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 pt-16 pb-8 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          <div className="col-span-1 md:col-span-1">
             <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-full bg-gold-500 flex items-center justify-center text-white font-serif font-bold">M</div>
                <span className="font-serif font-bold text-gray-900">MMR Burwan</span>
             </div>
             <p className="text-sm text-gray-500 leading-relaxed">
               The official digital portal for Muslim Marriage Registration in Burwan. Secure, efficient, and transparent.
             </p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link to="/" className="hover:text-gold-600 transition-colors">Home</Link></li>
              <li><Link to="/auth/register" className="hover:text-gold-600 transition-colors">Apply Online</Link></li>
              <li><Link to="/dashboard" className="hover:text-gold-600 transition-colors">Check Status</Link></li>
              <li><Link to="/verify" className="hover:text-gold-600 transition-colors">Verify Certificate</Link></li>
            </ul>
          </div>

          <div>
             <h4 className="font-semibold text-gray-900 mb-4">Legal & Help</h4>
             <ul className="space-y-2 text-sm text-gray-600">
              <li><Link to="/privacy" className="hover:text-gold-600 transition-colors">Privacy Policy</Link></li>
              <li><a href="/privacy" className="hover:text-gold-600 transition-colors">Terms of Service</a></li>
              <li><Link to="/help" className="hover:text-gold-600 transition-colors">Guidelines</Link></li>
              <li><Link to="/help" className="hover:text-gold-600 transition-colors">Support Center</Link></li>
            </ul>
          </div>

           <div>
             <h4 className="font-semibold text-gray-900 mb-4">Contact</h4>
             <ul className="space-y-2 text-sm text-gray-600">
              <li>Helpline: <span className="text-gray-900 font-medium">1800-123-4567</span></li>
              <li>Email: <span className="text-gray-900 font-medium">support@mmr.gov.in</span></li>
              <li>Mon - Fri, 9:00 AM - 5:00 PM</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-8 flex flex-col items-center text-center gap-3 text-xs text-gray-500">
           <p>
             Disclaimer: Site Contents designed, developed, maintained and updated by{' '}
             <a 
               href="https://www.epplicon.net" 
               target="_blank" 
               rel="noopener noreferrer"
               className="text-gold-600 hover:text-gold-700 font-medium hover:underline transition-all"
             >
               Epplicon Technologies
             </a>
           </p>
           <div className="flex flex-col md:flex-row gap-1 md:gap-2">
             <a 
                href="https://www.mmrburwan.com"
                className="hover:text-gray-800 transition-colors font-medium"
             >
               Official Site of MMR Burwan
             </a>
             <span className="hidden md:inline text-gray-300">|</span>
             <span>Copyright 2025, All Rights Reserved.</span>
           </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;