import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Workflow, ArrowLeft, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';

const SubscribePage = () => {
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !email.includes('@')) {
            toast({
                title: 'Invalid email',
                description: 'Please enter a valid email address',
                variant: 'destructive'
            });
            return;
        }

        setIsSubmitting(true);

        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSubmitted(true);

            toast({
                title: 'Successfully subscribed!',
                description: 'You will receive updates about OpenWorkflow.',
                variant: 'default'
            });

            // Reset form after 3 seconds and navigate back
            setTimeout(() => {
                setEmail('');
                navigate('/');
            }, 3000);
        }, 1500);
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4">
            <Button
                variant="ghost"
                size="sm"
                className="absolute top-4 left-4"
                asChild
            >
                <Link to="/">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Home
                </Link>
            </Button>

            <div className="flex items-center mb-8">
                <Workflow className="h-10 w-10 text-purple-600 dark:text-purple-400 mr-3" />
                <h1 className="text-3xl font-bold">OpenWorkflow</h1>
            </div>

            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Stay Updated</CardTitle>
                    <CardDescription>
                        Subscribe to receive updates about OpenWorkflow's
                        development, features, and releases.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {isSubmitted ? (
                        <div className="py-6 text-center space-y-4">
                            <div className="flex justify-center">
                                <CheckCircle className="h-16 w-16 text-green-500" />
                            </div>
                            <h3 className="text-xl font-medium">
                                Thank you for subscribing!
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                We'll keep you informed about our latest
                                updates.
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="your.email@example.com"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <Button
                                type="submit"
                                className="w-full"
                                disabled={isSubmitting}
                            >
                                {isSubmitting
                                    ? 'Subscribing...'
                                    : 'Subscribe for Updates'}
                            </Button>
                        </form>
                    )}
                </CardContent>
                <CardFooter className="flex justify-center border-t pt-6">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        We respect your privacy and will never share your
                        information.
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
};

export default SubscribePage;
