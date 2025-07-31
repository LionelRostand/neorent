import React from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AdminSidebar } from './AdminSidebar';
import Header from './Header';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        {/* Sidebar */}
        <AdminSidebar />

        {/* Main content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header with sidebar trigger */}
          <header className="bg-background border-b px-4 py-3 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="lg:hidden" />
              <h1 className="text-lg font-semibold text-foreground truncate">
                Tableau de bord
              </h1>
            </div>
            <div className="flex items-center space-x-2">
              {/* Additional header content can go here */}
            </div>
          </header>

          {/* Main content area */}
          <main className="flex-1 overflow-hidden">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}