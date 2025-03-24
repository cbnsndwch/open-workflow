
import React from 'react';
import { format } from 'date-fns';
import { useAuth } from '@/contexts/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getLoginHistory } from '@/contexts/auth/authService';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function SettingsPage() {
  const { user } = useAuth();
  const loginHistory = user ? getLoginHistory(user.id) : [];

  const formatLoginTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'PPpp'); // Format: Apr 29, 2023, 1:30 PM
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Unknown';
    }
  };

  return (
    <div className="container py-8 max-w-5xl">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>
      
      <div className="grid gap-8">
        <Card>
          <CardHeader>
            <CardTitle>User Profile</CardTitle>
            <CardDescription>Your account information</CardDescription>
          </CardHeader>
          <CardContent>
            {user && (
              <div className="space-y-2">
                <p><span className="font-medium">Name:</span> {user.name}</p>
                <p><span className="font-medium">Email:</span> {user.email}</p>
                <p><span className="font-medium">Role:</span> {user.role}</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Login History</CardTitle>
            <CardDescription>Recent logins to your account</CardDescription>
          </CardHeader>
          <CardContent>
            {loginHistory.length > 0 ? (
              <ScrollArea className="h-[300px]">
                <ul className="space-y-3">
                  {loginHistory.map((record, index) => (
                    <li key={index} className="p-3 bg-accent/30 rounded-md">
                      <p className="text-sm font-medium">{formatLoginTime(record.timestamp)}</p>
                      <p className="text-sm text-muted-foreground">{record.email}</p>
                    </li>
                  ))}
                </ul>
              </ScrollArea>
            ) : (
              <p className="text-muted-foreground">No login history available</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
