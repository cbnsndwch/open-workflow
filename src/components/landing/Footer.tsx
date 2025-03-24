
import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center mb-4">
              <span className="text-xl font-bold">OpenWorkflow</span>
            </div>
          </div>
          
          <div className="flex flex-col items-center md:items-start space-y-4">
            <h3 className="text-lg font-semibold mb-2">Resources</h3>
            <Link to="/subscribe" className="flex items-center text-gray-600 hover:text-amber-500">
              <Mail className="h-4 w-4 mr-2" /> Updates
            </Link>
            <Link to="/docs" className="flex items-center text-gray-600 hover:text-amber-500">
              <BookOpen className="h-4 w-4 mr-2" /> Documentation
            </Link>
          </div>
        </div>
        
        <div className="pt-8 border-t border-gray-200 text-center">
          <p className="text-gray-500">
            © 2025 cbnsndwch LLC. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
