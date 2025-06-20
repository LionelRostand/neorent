
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building, Users, UserCheck, FileText } from 'lucide-react';

interface OwnerSpaceHeaderProps {
  owner: {
    name: string;
    email: string;
  };
  propertiesCount: number;
  tenantsCount: number;
  roommatesCount: number;
}

const OwnerSpaceHeader: React.FC<OwnerSpaceHeaderProps> = ({
  owner,
  propertiesCount,
  tenantsCount,
  roommatesCount
}) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Espace Propriétaire - {owner.name}
          </h1>
          <p className="text-gray-600 mt-1">{owner.email}</p>
          <Badge variant="outline" className="mt-2">
            Propriétaire NeoRent
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-500">Propriétés</p>
                <p className="text-lg sm:text-2xl font-bold text-blue-600">{propertiesCount}</p>
              </div>
              <Building className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-500">Locataires</p>
                <p className="text-lg sm:text-2xl font-bold text-green-600">{tenantsCount}</p>
              </div>
              <UserCheck className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-500">Colocataires</p>
                <p className="text-lg sm:text-2xl font-bold text-purple-600">{roommatesCount}</p>
              </div>
              <Users className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-500">Total Occupants</p>
                <p className="text-lg sm:text-2xl font-bold text-orange-600">{tenantsCount + roommatesCount}</p>
              </div>
              <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OwnerSpaceHeader;
