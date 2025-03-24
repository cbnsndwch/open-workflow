
import React from 'react';
import Hero from '@/components/landing/Hero';
import Features from '@/components/landing/Features';
import ModelContext from '@/components/landing/ModelContext';
import CallToAction from '@/components/landing/CallToAction';
import Footer from '@/components/landing/Footer';

const LandingPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <Features />
      <ModelContext />
      <CallToAction />
      <Footer />
    </div>
  );
};

export default LandingPage;
