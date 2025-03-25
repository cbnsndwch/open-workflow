import React from 'react';
import { Outlet } from 'react-router-dom';
import {
    SidebarProvider,
    SidebarInset,
    SidebarRail
} from '@/components/ui/sidebar';
import { AppSidebar } from './AppSidebar';
import { PageHeader } from './PageHeader';

export function AppLayout() {
    return (
        <SidebarProvider defaultOpen={true}>
            <div className="flex min-h-svh w-full">
                <AppSidebar />
                <SidebarRail />

                <SidebarInset className="flex flex-col !overflow-hidden">
                    <PageHeader />
                    <main className="flex-1 p-0 overflow-auto">
                        <Outlet />
                    </main>
                </SidebarInset>
            </div>
        </SidebarProvider>
    );
}

// Only named export, no default export
