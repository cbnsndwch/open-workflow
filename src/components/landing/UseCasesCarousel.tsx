import React from 'react';
import { FileCode, Server, Bot, Database, Workflow, Zap } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious
} from '@/components/ui/carousel';

interface UseCase {
    title: string;
    description: string;
    icon: React.ElementType;
}

const UseCasesCarousel: React.FC = () => {
    const useCases: UseCase[] = [
        {
            title: 'Document Processing',
            description:
                'Automate document analysis, extraction, and processing with AI-powered workflows that handle various document formats.',
            icon: FileCode
        },
        {
            title: 'Data Pipeline Automation',
            description:
                'Build resilient data pipelines that connect sources, transform data, and load to destinations with sophisticated error handling.',
            icon: Database
        },
        {
            title: 'AI Agent Orchestration',
            description:
                'Coordinate multiple AI agents to solve complex problems through planned sequences of interactions and context sharing.',
            icon: Bot
        },
        {
            title: 'API Integration Hub',
            description:
                'Connect disparate systems and services through a centralized API integration platform with prebuilt connectors.',
            icon: Server
        },
        {
            title: 'Customer Support Automation',
            description:
                'Route and respond to customer inquiries using AI-powered triage and response generation with human handoff capability.',
            icon: Workflow
        },
        {
            title: 'Real-time Decision Flows',
            description:
                'Create decision trees and business logic flows that respond to events in real-time with minimal latency.',
            icon: Zap
        }
    ];

    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-8">
                    Use Cases
                </h2>
                <p className="text-lg text-gray-600 text-center max-w-3xl mx-auto mb-12">
                    Exploring the innovative possibilities and future directions
                    for our workflow automation platform
                </p>

                <div className="px-10 md:px-16 lg:px-20">
                    <Carousel
                        opts={{
                            align: 'start',
                            loop: true
                        }}
                        className="w-full"
                    >
                        <CarouselContent className="-ml-2 md:-ml-4">
                            {useCases.map((useCase, index) => (
                                <CarouselItem
                                    key={index}
                                    className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3"
                                >
                                    <Card className="border border-gray-100 shadow-sm hover:shadow-md transition-shadow bg-white h-full">
                                        <CardContent className="flex flex-col items-start p-6">
                                            <div className="h-12 w-12 rounded-lg bg-amber-50 flex items-center justify-center mb-4">
                                                <useCase.icon className="h-6 w-6 text-amber-500" />
                                            </div>
                                            <h3 className="text-xl font-semibold mb-2 text-gray-900">
                                                {useCase.title}
                                            </h3>
                                            <p className="text-gray-600">
                                                {useCase.description}
                                            </p>
                                        </CardContent>
                                    </Card>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <div className="flex justify-center mt-8 space-x-4">
                            <CarouselPrevious className="static h-10 w-10 border border-gray-200 text-gray-700 bg-white hover:bg-gray-50" />
                            <CarouselNext className="static h-10 w-10 border border-gray-200 text-gray-700 bg-white hover:bg-gray-50" />
                        </div>
                    </Carousel>
                </div>
            </div>
        </section>
    );
};

export default UseCasesCarousel;
