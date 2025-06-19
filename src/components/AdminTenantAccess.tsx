
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { UserCheck, Users, ArrowLeft, Shield } from 'lucide-react';
import { useAdminTenantAccess } from '@/hooks/useAdminTenantAccess';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const AdminTenantAccess: React.FC = () => {
  const { t } = useTranslation();
  const {
    isAuthorizedAdmin,
    getAllTenantProfiles,
    switchToTenantProfile,
    switchBackToAdmin,
    selectedTenantProfile,
    isImpersonating
  } = useAdminTenantAccess();
  const navigate = useNavigate();
  const [selectedTenantId, setSelectedTenantId] = useState('');

  if (!isAuthorizedAdmin) {
    console.log('User not authorized for admin access');
    return null;
  }

  const tenantProfiles = getAllTenantProfiles();
  console.log('Available tenant profiles for selection:', tenantProfiles);

  const handleSwitchToTenant = () => {
    const tenant = tenantProfiles.find(t => t.id === selectedTenantId);
    console.log('Selected tenant for switch:', { selectedTenantId, tenant });
    
    if (!tenant) {
      console.error('Tenant not found for ID:', selectedTenantId);
      toast.error('Tenant not found');
      return;
    }

    if (switchToTenantProfile(tenant)) {
      console.log('Successfully switched to tenant profile, navigating to tenant space');
      toast.success(`Accessing ${tenant.name}'s space`, {
        description: `You are now viewing the ${tenant.type} space`
      });
      
      // Small delay to ensure state is updated before navigation
      setTimeout(() => {
        navigate('/tenant-space');
      }, 100);
    } else {
      console.error('Failed to switch to tenant profile');
      toast.error('Error accessing tenant space');
    }
  };

  const handleSwitchBack = () => {
    console.log('Switching back to admin');
    switchBackToAdmin();
    toast.info('Returned to administrator space');
    navigate('/admin/settings');
  };

  const handleViewTenantSpace = () => {
    console.log('Viewing tenant space with current profile:', selectedTenantProfile);
    navigate('/tenant-space');
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="pb-3 sm:pb-4">
        <CardTitle className="flex flex-col gap-2 text-sm sm:text-base md:text-lg">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 flex-shrink-0" />
            <span className="break-words leading-tight text-xs sm:text-sm md:text-base">
              {t('settings.adminAccess')}
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 sm:space-y-4 p-3 sm:p-4 md:p-6">
        {isImpersonating ? (
          <div className="space-y-3 sm:space-y-4">
            <div className="p-3 sm:p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex flex-col gap-3">
                <div className="flex items-start gap-2 sm:gap-3">
                  <UserCheck className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="min-w-0 flex-1 space-y-2 sm:space-y-3">
                    <div className="space-y-2">
                      <h3 className="font-medium text-blue-900 text-xs sm:text-sm md:text-base break-words leading-tight">
                        {t('settings.adminModeConsultation', { name: selectedTenantProfile?.name })}
                      </h3>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                          <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs">
                            {t('settings.adminModeTitle')}
                          </Badge>
                          <Button 
                            onClick={handleSwitchBack}
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-1 text-xs px-2 py-1 h-7 sm:h-8 flex-shrink-0"
                          >
                            <ArrowLeft className="h-3 w-3" />
                            <span className="hidden xs:inline">{t('settings.returnButton')}</span>
                            <span className="xs:hidden">{t('settings.returnButton')}</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white/50 rounded-md p-2 sm:p-3 space-y-1">
                      <p className="text-xs sm:text-sm text-blue-700">
                        <span className="font-medium">{t('settings.viewingAsAdmin')}</span>
                      </p>
                      <div className="space-y-0.5 sm:space-y-1 text-xs">
                        <p className="text-blue-700">
                          <span className="font-medium">{t('settings.tenantType')}:</span> {selectedTenantProfile?.type}
                        </p>
                        <p className="text-blue-600 break-all">
                          <span className="font-medium">{t('settings.tenantEmail')}:</span> {selectedTenantProfile?.email}
                        </p>
                        <p className="text-blue-600 break-words">
                          <span className="font-medium">{t('settings.tenantAddress')}:</span> {selectedTenantProfile?.address}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col gap-2">
              <Button 
                onClick={handleViewTenantSpace}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-xs sm:text-sm min-h-[40px] sm:min-h-[44px]"
              >
                <Users className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="truncate">{t('settings.viewTenantSpace')}</span>
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            <div className="space-y-2">
              <label className="text-xs sm:text-sm font-medium block">
                Select a tenant/roommate
              </label>
              <Select value={selectedTenantId} onValueChange={setSelectedTenantId}>
                <SelectTrigger className="w-full text-xs sm:text-sm">
                  <SelectValue placeholder="Choose a profile to view" />
                </SelectTrigger>
                <SelectContent>
                  {tenantProfiles.map((tenant) => (
                    <SelectItem key={tenant.id} value={tenant.id.toString()}>
                      <div className="flex flex-col gap-1 py-1 w-full">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-xs sm:text-sm">{tenant.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {tenant.type}
                          </Badge>
                        </div>
                        <span className="text-xs text-gray-500 break-all">({tenant.email})</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Button 
              onClick={handleSwitchToTenant}
              disabled={!selectedTenantId}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-xs sm:text-sm min-h-[40px] sm:min-h-[44px]"
            >
              <Users className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>Access tenant space</span>
            </Button>
            
            <p className="text-xs text-gray-500 text-center break-words">
              Feature reserved for admin@neotech-consulting.com
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminTenantAccess;
