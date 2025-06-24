
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useAdminTenantAccess } from '@/hooks/useAdminTenantAccess';

interface OwnerSpaceProfileHeaderProps {
  currentProfile: any;
}

const OwnerSpaceProfileHeader: React.FC<OwnerSpaceProfileHeaderProps> = ({ currentProfile }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isAuthorizedAdmin, switchBackToAdmin } = useAdminTenantAccess();

  const handleBackToAdmin = () => {
    switchBackToAdmin();
    navigate('/admin/dashboard');
  };

  return (
    <div>
      {/* Owner Space Header */}
      <div className="bg-white shadow-sm border-b mb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white text-base lg:text-lg font-bold">
                  {currentProfile?.name?.charAt(0).toUpperCase() || 'O'}
                </span>
              </div>
              <div>
                <h1 className="text-xl lg:text-2xl font-bold text-gray-900">
                  {t('ownerSpace.title')}
                </h1>
                <p className="text-gray-600 text-sm">
                  {t('ownerSpace.welcome')}, {currentProfile?.name || t('ownerSpace.status.owner')}
                </p>
                <p className="text-xs text-gray-500">
                  {currentProfile?.email}
                </p>
              </div>
            </div>
            <div className="mt-3 md:mt-0 flex items-center space-x-3">
              {/* Bouton de retour admin */}
              {isAuthorizedAdmin && (
                <Button
                  onClick={handleBackToAdmin}
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Retour Admin</span>
                </Button>
              )}
              
              <div className="flex items-center space-x-2 bg-green-100 px-3 py-1 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-green-800 text-xs font-medium">{t('ownerSpace.status.active')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerSpaceProfileHeader;
