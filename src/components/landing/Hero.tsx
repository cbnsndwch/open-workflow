
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Hero = () => {
  return (
    <header className="bg-gradient-to-r from-purple-100 to-blue-100 py-20">
      <div className="container mx-auto px-6 md:px-8">
        <div className="flex flex-col items-center justify-center text-center max-w-3xl mx-auto gap-8">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Open Source Workflow Automation<br />
              <span className="text-amber-500">Powered by AI</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Self-hosted workflow execution with direct integration to AI and language models through the model context protocol.
            </p>
            <div className="flex gap-4 pt-4 justify-center">
              <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-white font-medium shadow-lg hover:shadow-xl transform transition-all duration-200 hover:-translate-y-1" asChild>
                <Link to="/subscribe">
                  Sign Up for Updates <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Hero;
