
import React from 'react';
import { Lock, Bot, Workflow, Zap, Code, Database } from 'lucide-react';
import FeatureCard from './FeatureCard';

const Features = () => {
  const features = [
    {
      icon: Lock,
      title: "Self-Hosted & Secure",
      description: "Maintain full control of your data and workflows",
      content: "Deploy in your own environment to meet compliance and privacy requirements. Your sensitive data never leaves your infrastructure."
    },
    {
      icon: Bot,
      title: "AI Integration",
      description: "Connect with any AI or language model",
      content: "Seamless integration with language models through our model context protocol, enabling powerful AI-driven automation."
    },
    {
      icon: Workflow,
      title: "Visual Workflow Editor",
      description: "Design complex workflows without code",
      content: "Intuitive drag-and-drop interface makes it easy to create, test, and deploy sophisticated process automation."
    },
    {
      icon: Zap,
      title: "High Performance",
      description: "Execute workflows at scale",
      content: "Efficiently process thousands of workflow executions with minimal resources, optimized for speed and reliability."
    },
    {
      icon: Code,
      title: "Open Source",
      description: "Community-driven development",
      content: "Benefit from a transparent codebase, community contributions, and the freedom to customize to your specific needs."
    },
    {
      icon: Database,
      title: "Extensible",
      description: "Connect to any data source or API",
      content: "Integrates with databases, APIs, and third-party services through a flexible plugin architecture."
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Why You'll Love It</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard 
              key={index}
              icon={feature.icon} 
              title={feature.title} 
              description={feature.description} 
              content={feature.content} 
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
