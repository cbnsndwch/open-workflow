
import React from 'react';
import { Home, GitBranch } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from '@/components/ui/sidebar';

type NavItem = {
  title: string;
  icon: React.ComponentType<any>;
  to: string;
};

const mainNavItems: NavItem[] = [
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

export function MainNavigation() {
  const { isMobile, setOpenMobile } = useSidebar();
  
  const handleNavItemClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          {mainNavItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild tooltip={item.title} className="justify-start px-2">
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
  );
}
