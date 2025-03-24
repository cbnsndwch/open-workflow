
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Zap, 
  Lock, 
  Workflow, 
  Sparkles,
  Bot,
  Code,
  Database
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import LandingPageFlow from '@/components/landing/LandingPageFlow';

const LandingPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-950/30 dark:to-blue-950/30 py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="flex-1 space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                Open Source Workflow Automation<br />
                <span className="text-purple-600 dark:text-purple-400">Powered by AI</span>
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

      {/* Features Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Key Benefits</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center mb-4">
                  <Lock className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle>Self-Hosted & Secure</CardTitle>
                <CardDescription>Maintain full control of your data and workflows</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  Deploy in your own environment to meet compliance and privacy requirements. Your sensitive data never leaves your infrastructure.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center mb-4">
                  <Bot className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle>AI Integration</CardTitle>
                <CardDescription>Connect with any AI or language model</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  Seamless integration with language models through our model context protocol, enabling powerful AI-driven automation.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center mb-4">
                  <Workflow className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle>Visual Workflow Editor</CardTitle>
                <CardDescription>Design complex workflows without code</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  Intuitive drag-and-drop interface makes it easy to create, test, and deploy sophisticated process automation.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle>High Performance</CardTitle>
                <CardDescription>Execute workflows at scale</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  Efficiently process thousands of workflow executions with minimal resources, optimized for speed and reliability.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center mb-4">
                  <Code className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle>Open Source</CardTitle>
                <CardDescription>Community-driven development</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  Benefit from a transparent codebase, community contributions, and the freedom to customize to your specific needs.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center mb-4">
                  <Database className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle>Extensible</CardTitle>
                <CardDescription>Connect to any data source or API</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  Integrates with databases, APIs, and third-party services through a flexible plugin architecture.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Model Context Protocol Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1">
              <div className="bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-950/30 dark:to-blue-950/30 p-6 rounded-xl">
                <pre className="text-sm overflow-auto">
                  <code className="text-gray-800 dark:text-gray-200">
{`// Model Context Protocol Example
const workflow = {
  context: {
    input: "Summarize this document",
    document: { type: "text", content: "..." },
    modelParams: {
      temperature: 0.2,
      maxTokens: 500
    }
  },
  steps: [
    { id: "extract", type: "ai.extract", prompt: "..." },
    { id: "summarize", type: "ai.generate", prompt: "..." },
    { id: "format", type: "transform", template: "..." }
  ]
}`}
                  </code>
                </pre>
              </div>
            </div>
            <div className="flex-1 space-y-6">
              <h2 className="text-3xl font-bold">
                Model Context Protocol
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Our innovative Model Context Protocol enables direct integration with any AI model, allowing for:
              </p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <Sparkles className="h-6 w-6 text-purple-600 dark:text-purple-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Seamless context passing between workflow steps</span>
                </li>
                <li className="flex items-start">
                  <Sparkles className="h-6 w-6 text-purple-600 dark:text-purple-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Structured interactions with language models</span>
                </li>
                <li className="flex items-start">
                  <Sparkles className="h-6 w-6 text-purple-600 dark:text-purple-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Optimized prompts and responses for AI workloads</span>
                </li>
                <li className="flex items-start">
                  <Sparkles className="h-6 w-6 text-purple-600 dark:text-purple-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Versioned model compatibility across workflow changes</span>
                </li>
              </ul>
              <div className="pt-4">
                <Button asChild>
                  <Link to="/subscribe">Sign Up for Updates</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-purple-100 dark:bg-purple-950/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to transform your workflow automation?</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
            Join our growing community of developers and businesses building the next generation of AI-powered workflows.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
      </section>

      {/* Footer */}
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
    </div>
  );
};

export default LandingPage;
