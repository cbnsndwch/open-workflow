
import React from 'react';
import { Home, GitBranch, CircleHelp, User, LogOut, Settings, Building, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
  SidebarSeparator
} from '@/components/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { LastLoginInfo } from '../auth/LastLoginInfo';

export function AppSidebar() {
  const { isMobile, setOpenMobile } = useSidebar();
  const { user, accounts, currentAccount, setCurrentAccount, logout } = useAuth();
  
  const mainNavItems = [
    {
      title: "Home",
      icon: Home,
      to: "/",
    },
    {
      title: "Workflows",
      icon: GitBranch,
      to: "/workflows",
    },
  ];

  const handleNavItemClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  // Generate initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <Sidebar variant="inset">
      <SidebarHeader className="px-2 py-4">
        <div className="flex items-center gap-2 px-2">
          <GitBranch className="h-6 w-6 text-primary" />
          <span className="font-semibold text-lg">OpenWorkflow</span>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        {currentAccount && (
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
                    <Link to="/account-select">
                      <span>Account Selection</span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </SidebarGroup>
        )}

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <Link to={item.to} onClick={handleNavItemClick}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-2 border-t border-sidebar-border flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Help">
              <Link to="/help" onClick={handleNavItemClick}>
                <CircleHelp />
                <span>Help</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        <SidebarSeparator />
        
        {user ? (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full justify-start px-2">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{user.name ? getInitials(user.name) : 'U'}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col truncate">
                      <span className="text-xs">Logged in as</span>
                      <span className="truncate text-xs font-medium">{user.email}</span>
                    </div>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                
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
                              onClick={() => setCurrentAccount(account)}
                              className="flex items-center justify-between"
                            >
                              <span className="truncate">{account.name}</span>
                              {currentAccount?.id === account.id && <Check className="h-4 w-4 text-primary" />}
                            </DropdownMenuItem>
                          ))}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem asChild>
                            <Link to="/account-select" onClick={handleNavItemClick}>
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
                  <Link to="/settings" onClick={handleNavItemClick}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <LastLoginInfo />
          </>
        ) : (
          <Button variant="ghost" className="w-full justify-start px-2" asChild>
            <Link to="/login">
              <User className="mr-2 h-4 w-4" />
              <span>Sign in</span>
            </Link>
          </Button>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
