
import React from 'react';
import { format } from 'date-fns';
import { User } from '@/contexts/auth/types';
import { useAuth } from '@/contexts/auth';
import { Info } from 'lucide-react';

export const LastLoginInfo: React.FC = () => {
  const auth = useAuth();
  const user = auth?.user;
  
  if (!user?.lastLogin) {
    return null;
  }
  
  const formatLastLogin = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'PPpp'); // Format: Apr 29, 2023, 1:30 PM
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Unknown';
    }
  };
  
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2 bg-accent/30 p-2 rounded-md">
      <Info className="h-4 w-4" />
      <span>Last login: {formatLastLogin(user.lastLogin)}</span>
    </div>
  );
};
