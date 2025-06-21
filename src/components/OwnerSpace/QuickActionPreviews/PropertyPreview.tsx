
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Building, MapPin } from 'lucide-react';
import { useFirebaseProperties } from '@/hooks/useFirebaseProperties';

interface PropertyPreviewProps {
  ownerProfile: any;
}

const PropertyPreview: React.FC<PropertyPreviewProps> = ({ ownerProfile }) => {
  const { t } = useTranslation();
  const { properties } = useFirebaseProperties();

  const ownerProperties = properties.filter(property => 
    property.owner === ownerProfile?.name || property.owner === ownerProfile?.email
  );

  const lastProperty = ownerProperties[ownerProperties.length - 1];

  return (
    <Card className="mt-2 border-l-4 border-l-blue-500">
      <CardContent className="p-3">
        <div className="flex items-center gap-2 mb-2">
          <Building className="h-4 w-4 text-blue-500" />
          <span className="text-sm font-medium">Dernière propriété</span>
        </div>
        {lastProperty ? (
          <div>
            <p className="text-sm font-medium text-gray-900">{lastProperty.title}</p>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <MapPin className="h-3 w-3" />
              {lastProperty.address}
            </div>
            <p className="text-xs text-gray-500 mt-1">{lastProperty.type}</p>
          </div>
        ) : (
          <p className="text-xs text-gray-500">Aucune propriété ajoutée</p>
        )}
      </CardContent>
    </Card>
  );
};

export default PropertyPreview;
