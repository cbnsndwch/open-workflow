
import React from 'react';
import { HelpCircle } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ: React.FC = () => {
  const faqItems: FAQItem[] = [
    {
      question: "What is a workflow automation platform?",
      answer: "A workflow automation platform allows you to create, manage, and execute automated processes that connect different tools, applications, and data sources. Our platform specifically focuses on AI-enabled workflows that can handle complex tasks with minimal human intervention."
    },
    {
      question: "Do I need to know how to code to use the platform?",
      answer: "No, our platform features a visual workflow builder that allows non-technical users to create workflows using a drag-and-drop interface. More advanced users can also utilize code nodes for custom functionality when needed."
    },
    {
      question: "How can I integrate the platform with my existing tools?",
      answer: "We offer a wide range of pre-built connectors for popular applications and services. Additionally, our platform supports custom API integration, allowing you to connect virtually any system with accessible APIs."
    },
    {
      question: "Is there a free trial available?",
      answer: "Yes, we offer a 14-day free trial with full access to all features. No credit card is required to start your trial, and you can upgrade to a paid plan at any time."
    },
    {
      question: "How secure is the platform?",
      answer: "Security is our top priority. We employ industry-standard encryption for all data, both at rest and in transit. Our platform is SOC 2 compliant and undergoes regular security audits to ensure your data remains protected."
    },
    {
      question: "Can I run workflows on a schedule?",
      answer: "Absolutely! Our platform supports various trigger methods, including scheduled execution. You can set workflows to run at specific times, on recurring schedules, or in response to events from integrated systems."
    }
  ];

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center mb-8">
          <HelpCircle className="h-8 w-8 text-purple-600 dark:text-purple-400 mr-3" />
          <h2 className="text-3xl font-bold text-center">Frequently Asked Questions</h2>
        </div>
        <p className="text-lg text-gray-600 dark:text-gray-300 text-center max-w-3xl mx-auto mb-12">
          Get answers to the most common questions about our workflow automation platform
        </p>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqItems.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="bg-white dark:bg-gray-800 rounded-lg">
                <AccordionTrigger className="px-6 py-4 text-left font-medium text-lg hover:no-underline hover:text-purple-600 dark:hover:text-purple-400">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6 pt-2 text-gray-600 dark:text-gray-300">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
