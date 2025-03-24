import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';

const SettingsPage = () => {
    const { user, currentAccount } = useAuth();

    // If no user is logged in, don't render anything (auth context will handle redirect)
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // If user is logged in but no account is selected, redirect to account selection
    if (user && !currentAccount) {
        return <Navigate to="/accounts" replace />;
    }

    return (
        <div className="container py-8">
            <h1 className="text-3xl font-bold tracking-tight mb-6">Settings</h1>

            <div className="space-y-8">
                <div className="card p-6 bg-card rounded-lg border shadow-sm">
                    <h2 className="text-xl font-semibold mb-4">
                        User Settings
                    </h2>
                    <p className="text-muted-foreground">
                        User settings content will be implemented in a future
                        update.
                    </p>
                </div>

                <div className="card p-6 bg-card rounded-lg border shadow-sm">
                    <h2 className="text-xl font-semibold mb-4">
                        Account Settings
                    </h2>
                    <p className="text-muted-foreground mb-4">
                        Managing settings for:{' '}
                        <strong>{currentAccount?.name}</strong>
                    </p>
                    <p className="text-muted-foreground">
                        Account settings content will be implemented in a future
                        update.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
