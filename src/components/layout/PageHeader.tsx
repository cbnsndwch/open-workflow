
import React from 'react';
import { useLocation } from 'react-router-dom';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { MoonStar, Sun } from 'lucide-react';

interface PageHeaderProps {
  title?: string;
}

export function PageHeader({ title }: PageHeaderProps) {
  const location = useLocation();
  
  // Determine title based on route if not provided
  const pageTitle = title || getPageTitle(location.pathname);
  
  return (
    <header className="border-b border-border/30 bg-background px-6 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <SidebarTrigger />
          <h1 className="text-xl font-semibold">{pageTitle}</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <MoonStar className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </div>
    </header>
  );
}

// Helper function to get page title based on route
function getPageTitle(pathname: string): string {
  switch (pathname) {
    case '/':
      return 'Home';
    case '/workflows':
      return 'Workflows';
    case '/settings':
      return 'Settings';
    case '/help':
      return 'Help';
    default:
      if (pathname.startsWith('/workflow/')) {
        return 'Workflow Details';
      }
      return 'Not Found';
  }
}
