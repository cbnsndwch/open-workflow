
import React from 'react';
import { useAuth } from '@/contexts/auth';
import { Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { LastLoginInfo } from '@/components/auth/LastLoginInfo';

const AccountSelectPage = () => {
  const { accounts, setCurrentAccount, user } = useAuth();

  const handleAccountSelect = (accountId: string) => {
    const selectedAccount = accounts.find(acc => acc.id === accountId);
    if (selectedAccount) {
      setCurrentAccount(selectedAccount);
      // Navigation to /:accountId is handled in the setCurrentAccount function
    }
  };

  // If user is not logged in, this component shouldn't render
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Select an Account</h1>
          <p className="text-muted-foreground mt-2">
            Welcome back, {user.name}! Choose an account to continue.
          </p>
          <LastLoginInfo />
        </div>

        <div className="grid gap-4">
          {accounts.map((account) => (
            <Card key={account.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{account.name}</CardTitle>
                <CardDescription>Role: {account.role}</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{account.slug}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  onClick={() => handleAccountSelect(account.id)}
                >
                  Select Account
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AccountSelectPage;
