
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LandingPageFlow from './LandingPageFlow';

const Hero = () => {
  return (
    <header className="bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-950/30 dark:to-blue-950/30 py-20">
      <div className="container mx-auto px-6 md:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="flex-1 space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Open Source Workflow Automation<br />
              <span className="text-amber-500 dark:text-amber-400">Powered by AI</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-lg">
              Self-hosted workflow execution with direct integration to AI and language models through the model context protocol.
            </p>
            <div className="flex gap-4 pt-4">
              <Button size="lg" asChild>
                <Link to="/login">
                  Get Started <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/subscribe">
                  Sign Up for Updates
                </Link>
              </Button>
            </div>
          </div>
          <div className="flex-1 h-[300px] w-full md:h-[400px] bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
            <LandingPageFlow />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Hero;
