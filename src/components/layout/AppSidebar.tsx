
import React from 'react';
import { Home, GitBranch, Settings, CircleHelp } from 'lucide-react';
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
} from '@/components/ui/sidebar';

export function AppSidebar() {
  // Navigation items for the sidebar
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
    {
      title: "Settings",
      icon: Settings,
      to: "/settings",
    },
    {
      title: "Help",
      icon: CircleHelp,
      to: "/help",
    },
  ];

  return (
    <Sidebar variant="inset">
      <SidebarHeader className="px-2 py-4">
        <div className="flex items-center gap-2 px-2">
          <GitBranch className="h-6 w-6 text-primary" />
          <span className="font-semibold text-lg">Workflow SDK</span>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <Link to={item.to}>
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
    </Sidebar>
  );
}
