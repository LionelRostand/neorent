
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Users, UserPlus } from 'lucide-react';
import { useFirebaseRoommates } from '@/hooks/useFirebaseRoommates';
import { useFirebaseProperties } from '@/hooks/useFirebaseProperties';

interface TenantPreviewProps {
  ownerProfile: any;
}

const TenantPreview: React.FC<TenantPreviewProps> = ({ ownerProfile }) => {
  const { t } = useTranslation();
  const { roommates } = useFirebaseRoommates();
  const { properties } = useFirebaseProperties();

  const ownerProperties = properties.filter(property => 
    property.owner === ownerProfile?.name || property.owner === ownerProfile?.email
  );

  const activeTenants = roommates.filter(roommate => 
    roommate.status === 'Actif' && 
    ownerProperties.some(property => property.title === roommate.property)
  );

  const recentTenant = activeTenants.sort((a, b) => 
    new Date(b.moveInDate || 0).getTime() - new Date(a.moveInDate || 0).getTime()
  )[0];

  return (
    <Card className="mt-2 border-l-4 border-l-purple-500">
      <CardContent className="p-3">
        <div className="flex items-center gap-2 mb-2">
          <Users className="h-4 w-4 text-purple-500" />
          <span className="text-sm font-medium">Locataires actifs</span>
        </div>
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span>Total</span>
            <span className="font-medium">{activeTenants.length}</span>
          </div>
          {recentTenant && (
            <div className="mt-2">
              <div className="flex items-center gap-1 text-xs text-gray-600">
                <UserPlus className="h-3 w-3" />
                <span>Dernier ajout:</span>
              </div>
              <p className="text-xs font-medium">{recentTenant.name}</p>
              <p className="text-xs text-gray-500">{recentTenant.property}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TenantPreview;
