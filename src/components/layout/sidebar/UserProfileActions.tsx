
import React from 'react';
import { Link } from 'react-router-dom';
import { Building, Check, Settings, LogOut } from 'lucide-react';
import {
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/auth';
import { Account } from '@/contexts/auth/types';

interface UserProfileActionsProps {
  handleNavItemClick: () => void;
}

export function UserProfileActions({ handleNavItemClick }: UserProfileActionsProps) {
  const { accounts, currentAccount, setCurrentAccount, logout } = useAuth();
  
  return (
    <>
      {accounts.length > 0 && (
        <>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Building className="mr-2 h-4 w-4" />
              <span>Switch Account</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent className="min-w-[220px]">
                {accounts.map((account) => (
                  <DropdownMenuItem 
                    key={account.id}
                    onClick={() => {
                      setCurrentAccount(account);
                      handleNavItemClick();
                    }}
                    className="flex items-center justify-between"
                  >
                    <span className="truncate">{account.name}</span>
                    {currentAccount?.id === account.id && <Check className="h-4 w-4 text-primary" />}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/app/account-select" onClick={handleNavItemClick}>
                    <span>Account Selection</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          <DropdownMenuSeparator />
        </>
      )}
      
      <DropdownMenuItem asChild>
        <Link to="/app/settings" onClick={handleNavItemClick}>
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </Link>
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem onClick={logout}>
        <LogOut className="mr-2 h-4 w-4" />
        <span>Log out</span>
      </DropdownMenuItem>
    </>
  );
}
