
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, ArrowLeft } from 'lucide-react';

interface AdminImpersonationBannerProps {
  isImpersonating: boolean;
  isAuthorizedAdmin: boolean;
  currentProfile: {
    name: string;
    email: string;
    address?: string;
  };
  currentType: string;
  onBackToAdmin: () => void;
}

const AdminImpersonationBanner: React.FC<AdminImpersonationBannerProps> = ({
  isImpersonating,
  isAuthorizedAdmin,
  currentProfile,
  currentType,
  onBackToAdmin
}) => {
  const { t } = useTranslation();

  if (!isImpersonating || !isAuthorizedAdmin) return null;

  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardContent className="p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="flex items-start gap-2 sm:gap-3 flex-1 min-w-0">
            <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="min-w-0 flex-1">
              <p className="font-medium text-blue-900 text-sm sm:text-base break-words leading-tight">
                {t('settings.adminModeConsultation', { name: currentProfile.name })}
              </p>
              <p className="text-xs sm:text-sm text-blue-700 mt-1">
                {t('settings.viewingAsAdmin')}
              </p>
              <div className="mt-2 space-y-1">
                <p className="text-xs text-blue-600">
                  <span className="font-medium">{t('settings.tenantType')}:</span> {currentType}
                </p>
                <p className="text-xs text-blue-600 break-all">
                  <span className="font-medium">{t('settings.tenantEmail')}:</span> {currentProfile.email}
                </p>
                <p className="text-xs text-blue-600 break-words">
                  <span className="font-medium">{t('settings.tenantAddress')}:</span> {currentProfile.address}
                </p>
              </div>
            </div>
          </div>
          <div className="flex justify-end sm:justify-start">
            <Button 
              onClick={onBackToAdmin}
              variant="outline"
              size="sm"
              className="flex items-center gap-1.5 text-xs px-2 py-1 h-8 sm:h-9 flex-shrink-0"
            >
              <ArrowLeft className="h-3 w-3" />
              <span className="hidden xs:inline">{t('settings.returnButton')}</span>
              <span className="xs:hidden">{t('settings.returnButton')}</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminImpersonationBanner;
