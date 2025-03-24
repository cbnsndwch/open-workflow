
import React from 'react';
import { Link } from 'react-router-dom';
import { Workflow, Github, BookOpen, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-100 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center mb-4">
              <Workflow className="h-8 w-8 text-purple-600 dark:text-purple-400 mr-2" />
              <span className="text-xl font-bold">OpenWorkflow</span>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-center md:text-left">
              Building the future of workflow automation with AI integration.
            </p>
          </div>
          
          <div className="flex flex-col items-center md:items-start space-y-4">
            <h3 className="text-lg font-semibold mb-2">Resources</h3>
            <Link to="/subscribe" className="flex items-center text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400">
              <Mail className="h-4 w-4 mr-2" /> Updates
            </Link>
            <a href="https://github.com" className="flex items-center text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400">
              <Github className="h-4 w-4 mr-2" /> GitHub
            </a>
            <a href="#" className="flex items-center text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400">
              <BookOpen className="h-4 w-4 mr-2" /> Documentation
            </a>
          </div>
          
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
            <p className="text-gray-600 dark:text-gray-300 text-center md:text-left">
              Join our community of developers and automation enthusiasts to shape the future of workflow automation.
            </p>
          </div>
        </div>
        
        <div className="pt-8 border-t border-gray-200 dark:border-gray-700 text-center md:flex md:justify-between md:items-center">
          <p className="text-gray-500 dark:text-gray-400 mb-4 md:mb-0">
            © 2025 cbnsndwch LLC. All rights reserved.
          </p>
          <div className="flex justify-center md:justify-end space-x-6">
            <a href="#" className="text-gray-500 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-500 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
