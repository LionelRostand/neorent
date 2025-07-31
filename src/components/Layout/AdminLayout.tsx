import React from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AdminSidebar } from './AdminSidebar';
import { useTranslation } from 'react-i18next';
import { Menu } from 'lucide-react';
import LanguageSelector from '../LanguageSelector';
import UserProfile from './UserProfile';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const { t } = useTranslation();
  
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        {/* Sidebar */}
        <AdminSidebar />

        {/* Main content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header with sidebar trigger */}
          <header className="bg-white shadow-sm border-b px-4 py-3 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="p-2 hover:bg-gray-100 rounded-md transition-colors" />
              <h1 className="text-lg font-semibold text-gray-900 truncate">
                Tableau de bord
              </h1>
            </div>
            <div className="flex items-center space-x-3">
              <LanguageSelector />
              <UserProfile />
            </div>
          </header>

          {/* Main content area */}
          <main className="flex-1 overflow-hidden bg-gray-50 p-4 md:p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}