
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
      question: "What is this open-source workflow automation platform aiming to do?",
      answer: "We're building an open-source workflow automation platform that enables creating, managing, and executing automated processes with powerful AI capabilities. Our goal is to make it a drop-in addition to any application, allowing developers to integrate workflow automation with minimal effort."
    },
    {
      question: "When will the platform be available for use?",
      answer: "We're currently in the early stages of development and gathering interest from the community. By signing up for updates, you'll be the first to know about our progress, access to early previews, and opportunities to contribute to the open-source project."
    },
    {
      question: "How will the platform integrate with existing applications?",
      answer: "As an open-source solution, our platform is being designed to be a drop-in addition to any application. We're focusing on creating flexible APIs and integration points that will allow developers to easily incorporate workflow automation capabilities into their existing tech stack."
    },
    {
      question: "Will there be a chance to contribute to the project?",
      answer: "Absolutely! As an open-source initiative, we welcome contributions from developers, designers, and others interested in advancing workflow automation. Once we launch our repository, you'll be able to contribute code, documentation, or ideas to help shape the platform."
    },
    {
      question: "What sets this platform apart from other workflow tools?",
      answer: "Our platform distinguishes itself by being fully open-source and designed as a drop-in solution for any application. We're specifically focusing on AI-enabled workflows through our model context protocol, which will allow seamless integration of language models and AI capabilities into automated processes."
    },
    {
      question: "How can I stay updated on the project's progress?",
      answer: "The best way to stay informed is to sign up for our updates using the form on this page. We'll share development milestones, opportunities for early access, and ways to get involved with the community as the project evolves."
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
          Learn more about our open-source workflow automation platform and how you can get involved
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
