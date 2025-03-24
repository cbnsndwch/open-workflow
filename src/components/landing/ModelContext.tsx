
import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

const ModelContext = () => {
  const isMobile = useIsMobile();

  // Don't render on mobile
  if (isMobile) {
    return null;
  }

  return (
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
                <Sparkles className="h-6 w-6 text-amber-500 dark:text-amber-400 mr-2 flex-shrink-0 mt-0.5" />
                <span>Seamless context passing between workflow steps</span>
              </li>
              <li className="flex items-start">
                <Sparkles className="h-6 w-6 text-amber-500 dark:text-amber-400 mr-2 flex-shrink-0 mt-0.5" />
                <span>Structured interactions with language models</span>
              </li>
              <li className="flex items-start">
                <Sparkles className="h-6 w-6 text-amber-500 dark:text-amber-400 mr-2 flex-shrink-0 mt-0.5" />
                <span>Optimized prompts and responses for AI workloads</span>
              </li>
              <li className="flex items-start">
                <Sparkles className="h-6 w-6 text-amber-500 dark:text-amber-400 mr-2 flex-shrink-0 mt-0.5" />
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
  );
};

export default ModelContext;
