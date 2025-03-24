
import React from 'react';
import Hero from '@/components/landing/Hero';
import Features from '@/components/landing/Features';
import UseCasesCarousel from '@/components/landing/UseCasesCarousel';
import ModelContext from '@/components/landing/ModelContext';
import CallToAction from '@/components/landing/CallToAction';
import Footer from '@/components/landing/Footer';

const LandingPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <Features />
      <UseCasesCarousel />
      <ModelContext />
      <CallToAction />
      <Footer />
    </div>
  );
};

export default LandingPage;
