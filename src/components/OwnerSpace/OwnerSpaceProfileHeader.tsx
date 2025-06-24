
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Building, Users, FileText, Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UserProfileDropdown } from '@/components/Layout/UserProfile/UserProfileDropdown';

interface OwnerSpaceProfileHeaderProps {
  currentProfile: any;
}

const OwnerSpaceProfileHeader: React.FC<OwnerSpaceProfileHeaderProps> = ({ currentProfile }) => {
  const { t } = useTranslation();

  if (!currentProfile) {
    return null;
  }

  return (
    <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Profile info */}
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0">
            <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-semibold text-lg">
                {currentProfile.name?.charAt(0)?.toUpperCase() || 'P'}
              </span>
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
              {currentProfile.name}
            </h1>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <Badge variant="outline" className="text-xs">
                {currentProfile.role === 'admin' ? 'Administrateur' : 'Propriétaire'}
              </Badge>
              {currentProfile.company && (
                <span className="text-sm text-gray-500 truncate">
                  {currentProfile.company}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* User actions dropdown */}
        <div className="flex items-center">
          <UserProfileDropdown />
        </div>
      </div>

      {/* Quick stats */}
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-3">
          <CardContent className="p-0">
            <div className="flex items-center space-x-2">
              <Building className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-xs text-gray-500">Propriétés</p>
                <p className="text-sm font-semibold">{currentProfile.propertyCount || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="p-3">
          <CardContent className="p-0">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-xs text-gray-500">Contrats actifs</p>
                <p className="text-sm font-semibold">{currentProfile.activeContracts || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="p-3">
          <CardContent className="p-0">
            <div className="flex items-center space-x-2">
              <FileText className="h-4 w-4 text-yellow-600" />
              <div>
                <p className="text-xs text-gray-500">Documents</p>
                <p className="text-sm font-semibold">-</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="p-3">
          <CardContent className="p-0">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-purple-600" />
              <div>
                <p className="text-xs text-gray-500">Échéances</p>
                <p className="text-sm font-semibold">-</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OwnerSpaceProfileHeader;
