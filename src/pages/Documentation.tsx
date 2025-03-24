
import React from 'react';
import { Book, GitBranch, ArrowRight, Clock } from 'lucide-react';
import Footer from '@/components/landing/Footer';

const Documentation = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GitBranch className="h-6 w-6 text-amber-500 dark:text-amber-400" />
            <span className="font-semibold text-xl">OpenWorkflow</span>
          </div>
          <a 
            href="/" 
            className="text-amber-500 dark:text-amber-400 hover:underline flex items-center gap-1"
          >
            Back to Home <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </header>

      {/* Documentation Content */}
      <main className="flex-grow py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <Book className="h-8 w-8 text-amber-500 dark:text-amber-400" />
              <h1 className="text-3xl font-bold">Documentation</h1>
            </div>
            
            <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg mb-8 flex gap-3 items-start">
              <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5" />
              <p className="text-amber-800 dark:text-amber-200">
                This documentation is currently in progress. More detailed guides and API reference will be available soon.
              </p>
            </div>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Overview</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                OpenWorkflow is an open-source workflow automation platform that enables creating, managing, and executing 
                automated processes with powerful AI capabilities. Our platform allows developers to integrate workflow 
                automation with minimal effort, making it a drop-in addition to any application.
              </p>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Whether you're building complex business processes, data pipelines, or AI-powered applications, 
                OpenWorkflow provides the tools and flexibility you need to automate efficiently.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Key Features</h2>
              <ul className="list-disc pl-6 space-y-3 text-gray-700 dark:text-gray-300">
                <li><strong>Visual Workflow Editor</strong> - Build workflows visually with our intuitive drag-and-drop editor.</li>
                <li><strong>Open Source</strong> - Full access to the source code, enabling customization for your specific needs.</li>
                <li><strong>AI Integration</strong> - Seamlessly incorporate AI capabilities into your workflows.</li>
                <li><strong>Extensible Architecture</strong> - Easily extend the platform with custom nodes and integrations.</li>
                <li><strong>Developer-Friendly</strong> - Designed with developers in mind, with a focus on ease of integration.</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Getting Started</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                OpenWorkflow is currently in early development. To stay updated on our progress and be notified when 
                the platform becomes available for use, please sign up for updates on our homepage.
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                Once available, detailed installation guides, API references, and example workflows will be provided 
                in this documentation.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Documentation;
