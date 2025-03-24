
import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  content: string;
}

const FeatureCard = ({ icon: Icon, title, description, content }: FeatureCardProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="h-12 w-12 rounded-lg bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center mb-4">
          <Icon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
        </div>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 dark:text-gray-300">
          {content}
        </p>
      </CardContent>
    </Card>
  );
};

export default FeatureCard;
