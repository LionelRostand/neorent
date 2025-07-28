import React from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AdminSidebar } from './AdminSidebar';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        {/* Header with sidebar trigger */}
        <header className="fixed top-0 left-0 right-0 h-12 flex items-center border-b bg-background z-40">
          <SidebarTrigger className="ml-2" />
          <h1 className="ml-4 font-semibold">Administration Neo Rent</h1>
        </header>

        {/* Sidebar */}
        <AdminSidebar />

        {/* Main content */}
        <main className="flex-1 pt-12">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}