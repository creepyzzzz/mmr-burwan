import React from 'react';
import Hero from '../components/Hero';
import Features from '../components/Features';
import HowItWorks from '../components/HowItWorks';
import Security from '../components/Security';
import Services from '../components/Services';
import Appointment from '../components/Appointment';
import CTA from '../components/CTA';

const LandingPage: React.FC = () => {
  return (
    <>
      <Hero />
      <Features />
      <HowItWorks />
      <Services />
      <Security />
      <Appointment />
      <CTA />
    </>
  );
};

export default LandingPage;

