
import React from 'react';
import { CircleHelp } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar
} from '@/components/ui/sidebar';

export function HelpSection() {
  const { isMobile, setOpenMobile } = useSidebar();
  
  const handleNavItemClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
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
  );
}
