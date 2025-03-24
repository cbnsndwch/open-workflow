
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { User, LogIn } from 'lucide-react';

export const DemoAccounts: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleQuickLogin = async (identifier: string, password: string) => {
    try {
      if (login) {
        await login(identifier, password);
        // Navigation will be handled by the login function in AuthContext
      }
    } catch (error) {
      console.error("Quick login failed:", error);
    }
  };

  return (
    <div className="rounded-md bg-primary/5 p-3 text-xs space-y-2 w-full">
      <p className="text-center font-medium text-foreground/80">Quick login:</p>
      <div className="grid grid-cols-2 gap-x-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex justify-start gap-2 h-auto py-2"
          onClick={() => handleQuickLogin("admin", "password")}
        >
          <User className="h-3.5 w-3.5" />
          <div className="flex flex-col items-start text-xs">
            <span className="font-medium">Admin</span>
            <span className="text-muted-foreground text-[10px]">admin / password</span>
          </div>
        </Button>
        
        <Button 
          variant="outline" 
          size="sm" 
          className="flex justify-start gap-2 h-auto py-2"
          onClick={() => handleQuickLogin("user", "password")}
        >
          <LogIn className="h-3.5 w-3.5" />
          <div className="flex flex-col items-start text-xs">
            <span className="font-medium">User</span>
            <span className="text-muted-foreground text-[10px]">user / password</span>
          </div>
        </Button>
      </div>
    </div>
  );
};
