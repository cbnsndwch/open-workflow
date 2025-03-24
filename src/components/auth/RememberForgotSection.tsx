
import React from 'react';

interface RememberForgotSectionProps {
  rememberMe: boolean;
  toggleRememberMe: () => void;
}

export const RememberForgotSection = ({ rememberMe, toggleRememberMe }: RememberForgotSectionProps) => {
  return (
    <div className="flex items-center justify-between pt-2">
      <div className="flex items-center space-x-2">
        <div 
          onClick={toggleRememberMe} 
          className={`size-4 rounded border cursor-pointer flex items-center justify-center ${rememberMe ? 'bg-primary border-primary' : 'border-muted-foreground/50'}`}
        >
          {rememberMe && <span className="text-xs text-primary-foreground">✓</span>}
        </div>
        <span className="text-sm cursor-pointer text-muted-foreground" onClick={toggleRememberMe}>Remember me</span>
      </div>
      <a href="#" className="text-sm text-primary hover:underline">Forgot password?</a>
    </div>
  );
};
