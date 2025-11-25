import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import Navbar from '../Navbar';
import Footer from '../Footer';

const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white selection:bg-gold-200 selection:text-gold-900">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default AppLayout;

