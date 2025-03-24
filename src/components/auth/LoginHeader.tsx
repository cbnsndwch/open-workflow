import React from 'react';
import { GitBranch } from 'lucide-react';

export const LoginHeader = () => {
    return (
        <div className="flex flex-col items-center space-y-2 text-center">
            <div className="size-16 flex items-center justify-center rounded-full bg-primary/10 mb-2">
                <GitBranch className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">OpenWorkflow</h1>
            <p className="text-muted-foreground">Sign in to your account</p>
        </div>
    );
};
