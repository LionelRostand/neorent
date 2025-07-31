
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import MainLayout from '@/components/Layout/MainLayout';
import { Button } from '@/components/ui/button';
import { useTenantSpaceData } from '@/hooks/useTenantSpaceData';
import AdminImpersonationBanner from '@/components/TenantSpace/AdminImpersonationBanner';
import TenantSpaceHeader from '@/components/TenantSpace/TenantSpaceHeader';
import TenantSpaceTabs from '@/components/TenantSpace/TenantSpaceTabs';

const TenantSpace = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();
  const { t } = useTranslation();

  const {
    currentProfile,
    currentType,
    isAuthorizedAdmin,
    isImpersonating,
    switchBackToAdmin,
    mockPropertyData,
    mockTenantData
  } = useTenantSpaceData();

  const handleBackToAdmin = () => {
    console.log('Returning to admin settings');
    switchBackToAdmin();
    navigate('/admin/settings');
  };

  if (!currentProfile) {
    console.error('No current profile found');
    
    // Si c'est un propriétaire, rediriger vers owner-space
    if (currentType === 'owner' || isAuthorizedAdmin) {
      console.log('Redirecting owner to owner-space');
      navigate('/owner-space');
      return null;
    }
    
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-lg text-gray-600">{t('common.tenantNotFound')}</p>
            <p className="text-gray-500">{t('common.contactAdminForHelp')}</p>
            {isAuthorizedAdmin && (
              <Button onClick={() => navigate('/admin/settings')} className="mt-4">
                {t('common.backToAdmin')}
              </Button>
            )}
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-4 md:space-y-6">
        <AdminImpersonationBanner
          isImpersonating={isImpersonating}
          isAuthorizedAdmin={isAuthorizedAdmin}
          currentProfile={currentProfile}
          currentType={currentType}
          onBackToAdmin={handleBackToAdmin}
        />

        <TenantSpaceHeader
          currentProfile={currentProfile}
          currentType={currentType}
        />

        <TenantSpaceTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          mockPropertyData={mockPropertyData}
          mockTenantData={mockTenantData}
        />
      </div>
    </MainLayout>
  );
};

export default TenantSpace;
