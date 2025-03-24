import React from 'react';
import { Home, GitBranch } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
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
    path: string;
};

export function MainNavigation() {
    const { isMobile, setOpenMobile } = useSidebar();
    const { accountId } = useParams<{ accountId: string }>();

    const mainNavItems: NavItem[] = [
        {
            title: 'Home',
            icon: Home,
            path: `/${accountId}`
        },
        {
            title: 'Workflows',
            icon: GitBranch,
            path: `/${accountId}/workflows`
        }
    ];

    const handleNavItemClick = () => {
        if (isMobile) {
            setOpenMobile(false);
        }
    };

    return (
        <SidebarGroup>
            <SidebarGroupContent>
                <SidebarMenu>
                    {mainNavItems.map(item => (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                                asChild
                                tooltip={item.title}
                                className="justify-start px-2"
                            >
                                <Link
                                    to={item.path}
                                    onClick={handleNavItemClick}
                                >
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
