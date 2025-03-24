import React, { useState } from 'react';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from '@/components/ui/card';
import { LoginForm, LoginFormValues } from '@/components/auth/LoginForm';
import { RememberForgotSection } from '@/components/auth/RememberForgotSection';
import { DemoAccounts } from '@/components/auth/DemoAccounts';
import { LoginHeader } from '@/components/auth/LoginHeader';
import { LastLoginInfo } from '@/components/auth/LastLoginInfo';

export default function LoginPage() {
    const [rememberMe, setRememberMe] = useState(false);

    // Auth context
    const auth = useAuth();
    const login = auth?.login;
    const isLoading = auth?.isLoading || false;
    const user = auth?.user || null;

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const redirectTo = searchParams.get('redirectTo') || '/workflows';

    // Redirect if already logged in
    if (user && !isLoading) {
        return <Navigate to={redirectTo} replace />;
    }

    const handleSubmit = async (data: LoginFormValues) => {
        try {
            if (typeof login === 'function') {
                await login(data.identifier, data.password);
                navigate(redirectTo);
            }
        } catch (error) {
            console.error('Login submission error:', error);
        }
    };

    const toggleRememberMe = () => {
        setRememberMe(!rememberMe);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary/30 p-4">
            <div className="w-full max-w-md space-y-8">
                <LoginHeader />

                <Card className="border-muted/30 bg-card/80 backdrop-blur shadow-xl">
                    <CardHeader className="space-y-1 pb-4">
                        <CardTitle className="text-xl text-center">
                            Welcome back
                        </CardTitle>
                        <CardDescription className="text-center">
                            Enter your credentials to continue
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <LoginForm
                            onSubmit={handleSubmit}
                            isLoading={isLoading}
                        />
                        <div className="mt-4">
                            <RememberForgotSection
                                rememberMe={rememberMe}
                                toggleRememberMe={toggleRememberMe}
                            />
                        </div>
                        {user && <LastLoginInfo />}
                    </CardContent>

                    <CardFooter className="flex flex-col border-t border-muted/30 pt-5">
                        <DemoAccounts />
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
