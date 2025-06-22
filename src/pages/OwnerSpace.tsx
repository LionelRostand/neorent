
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useAdminTenantAccess } from '@/hooks/useAdminTenantAccess';
import Header from '@/components/Layout/Header';
import OwnerSpaceQuickActionsSidebar from '@/components/OwnerSpace/OwnerSpaceQuickActionsSidebar';
import OwnerSpaceProfileHeader from '@/components/OwnerSpace/OwnerSpaceProfileHeader';
import ViewRenderer from '@/components/OwnerSpace/Views/ViewRenderer';

const OwnerSpace = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { userProfile, userType } = useAuth();
  const { getCurrentProfile, isAuthorizedAdmin } = useAdminTenantAccess();
  const [activeView, setActiveView] = useState('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Get current profile (logged user or profile selected by admin)
  const currentProfile = getCurrentProfile();

  // Check that user is owner/employee or administrator
  if ((userType !== 'employee' && userType !== 'admin') || !currentProfile) {
    return (
      <div className="min-h-screen flex w-full">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-lg text-gray-600">Unauthorized access</p>
            <p className="text-gray-500">This space is reserved for owners.</p>
            <Button onClick={() => navigate('/admin/dashboard')} className="mt-4">
              Back to dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex w-full">
      {/* Mobile sidebar overlay */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Quick actions sidebar - responsive */}
      <div className={`
        ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 transition-transform duration-300 ease-in-out
        fixed md:static inset-y-0 left-0 z-50 md:z-auto
        md:block flex-shrink-0
      `}>
        <OwnerSpaceQuickActionsSidebar 
          ownerProfile={currentProfile} 
          activeView={activeView}
          setActiveView={setActiveView}
          onMobileClose={() => setIsMobileSidebarOpen(false)}
        />
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        
        <main className="flex-1 overflow-auto">
          <div className="bg-gray-50 min-h-full">
            {/* Mobile menu button - only visible when sidebar is hidden */}
            <div className="md:hidden p-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsMobileSidebarOpen(true)}
                className="bg-white shadow-md"
              >
                <Menu className="h-4 w-4" />
              </Button>
            </div>

            {/* Header with owner profile */}
            <OwnerSpaceProfileHeader currentProfile={currentProfile} />

            {/* Main content with responsive padding */}
            <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 pb-6 lg:pb-8">
              <ViewRenderer 
                activeView={activeView}
                currentProfile={currentProfile}
                onViewChange={setActiveView}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default OwnerSpace;
