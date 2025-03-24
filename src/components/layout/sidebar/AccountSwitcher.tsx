
import React from 'react';
import { Building, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { SidebarGroup } from '@/components/ui/sidebar';
import { useAuth } from '@/contexts/auth';

export function AccountSwitcher() {
  const { currentAccount, accounts, setCurrentAccount } = useAuth();
  
  if (!currentAccount) {
    return null;
  }

  return (
    <SidebarGroup>
      <div className="px-4 py-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full justify-start gap-2">
              <Building className="h-4 w-4" />
              <span className="truncate">{currentAccount.name}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuLabel>Accounts</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {accounts.map((account) => (
              <DropdownMenuItem 
                key={account.id}
                onClick={() => setCurrentAccount(account)}
                className="flex items-center justify-between"
              >
                <span className="truncate">{account.name}</span>
                {currentAccount.id === account.id && <Check className="h-4 w-4 text-primary" />}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/accounts">
                <span>Account Selection</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </SidebarGroup>
  );
}
