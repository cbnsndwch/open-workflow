
import React from 'react';
import Hero from '@/components/landing/Hero';
import Features from '@/components/landing/Features';
import UseCasesCarousel from '@/components/landing/UseCasesCarousel';
import CallToAction from '@/components/landing/CallToAction';
import FAQ from '@/components/landing/FAQ';
import Footer from '@/components/landing/Footer';

const LandingPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <Features />
      <UseCasesCarousel />
      <CallToAction />
      <FAQ />
      <Footer />
    </div>
  );
};

export default LandingPage;
