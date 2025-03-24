
import React from 'react';
import { Link } from 'react-router-dom';
import { Workflow } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-100 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Workflow className="h-8 w-8 text-purple-600 dark:text-purple-400 mr-2" />
            <span className="text-xl font-bold">OpenWorkflow</span>
          </div>
          <div className="space-x-6">
            <Link to="/subscribe" className="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400">
              Updates
            </Link>
            <a href="https://github.com" className="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400">
              GitHub
            </a>
            <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400">
              Documentation
            </a>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 text-center text-gray-500 dark:text-gray-400">
          <p>© 2025 OpenWorkflow. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
