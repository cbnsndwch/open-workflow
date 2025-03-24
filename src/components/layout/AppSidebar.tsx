import React from 'react';
import { GitBranch } from 'lucide-react';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarSeparator
} from '@/components/ui/sidebar';
import { MainNavigation } from './sidebar/MainNavigation';
import { AccountSwitcher } from './sidebar/AccountSwitcher';
import { UserProfile } from './sidebar/UserProfile';
import { HelpSection } from './sidebar/HelpSection';
import { useAuth } from '@/contexts/auth';
export function AppSidebar() {
    const { currentAccount } = useAuth();
    return (
        <Sidebar variant="inset">
            <SidebarHeader className="px-2 py-4">
                <div className="flex items-center gap-2 px-2">
                    <GitBranch className="h-6 w-6 text-primary" />
                    <span className="font-semibold text-lg">OpenWorkflow</span>
                </div>
            </SidebarHeader>

            <SidebarContent>
                {currentAccount && <AccountSwitcher />}
                <MainNavigation />
            </SidebarContent>

            <SidebarFooter className="p-2 border-t border-sidebar-border flex flex-col gap-2 px-0">
                <HelpSection />

                <UserProfile />
            </SidebarFooter>
        </Sidebar>
    );
}
