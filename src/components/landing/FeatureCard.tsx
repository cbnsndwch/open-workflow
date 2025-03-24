import React from 'react';
import { LucideIcon } from 'lucide-react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from '@/components/ui/card';

interface FeatureCardProps {
    icon: LucideIcon;
    title: string;
    description: string;
    content: string;
}

const FeatureCard = ({
    icon: Icon,
    title,
    description,
    content
}: FeatureCardProps) => {
    return (
        <Card className="border border-gray-100 shadow-sm hover:shadow-md transition-shadow bg-white">
            <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-amber-50 flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-amber-500" />
                </div>
                <CardTitle className="text-gray-900">{title}</CardTitle>
                <CardDescription className="text-gray-500">
                    {description}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-gray-600">{content}</p>
            </CardContent>
        </Card>
    );
};

export default FeatureCard;
