
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CallToAction = () => {
  return (
    <section className="py-20 bg-amber-100">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-6">Ready to transform your workflow automation?</h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
          Join our growing community of developers and businesses building the next generation of AI-powered workflows.
        </p>
        <div className="flex justify-center">
          <Button size="lg" variant="default" asChild>
            <Link to="/subscribe">
              Sign Up for Updates <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
