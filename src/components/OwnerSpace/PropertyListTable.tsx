
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useFirebaseProperties } from '@/hooks/useFirebaseProperties';

interface PropertyListTableProps {
  ownerProfile: any;
  viewType: 'property' | 'contract' | 'roommate' | 'inspection';
}

const PropertyListTable: React.FC<PropertyListTableProps> = ({ ownerProfile, viewType }) => {
  const { t } = useTranslation();
  const { properties = [] } = useFirebaseProperties();

  // Filter properties by owner
  const ownerProperties = properties.filter(property => 
    property.owner === ownerProfile?.name || property.owner === ownerProfile?.email
  );

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Disponible':
        return 'secondary';
      case 'Loué':
        return 'default';
      default:
        return 'outline';
    }
  };

  const getViewSpecificColumns = () => {
    switch (viewType) {
      case 'property':
        return (
          <>
            <TableHead>Type</TableHead>
            <TableHead>Surface</TableHead>
            <TableHead>Loyer</TableHead>
            <TableHead>Statut</TableHead>
          </>
        );
      case 'contract':
        return (
          <>
            <TableHead>Type</TableHead>
            <TableHead>Locataire</TableHead>
            <TableHead>Loyer</TableHead>
            <TableHead>Statut</TableHead>
          </>
        );
      case 'roommate':
        return (
          <>
            <TableHead>Type</TableHead>
            <TableHead>Chambres Total</TableHead>
            <TableHead>Chambres Libres</TableHead>
            <TableHead>Loyer</TableHead>
          </>
        );
      case 'inspection':
        return (
          <>
            <TableHead>Type</TableHead>
            <TableHead>Surface</TableHead>
            <TableHead>Dernière Inspection</TableHead>
            <TableHead>Statut</TableHead>
          </>
        );
      default:
        return null;
    }
  };

  const getViewSpecificCells = (property: any) => {
    switch (viewType) {
      case 'property':
        return (
          <>
            <TableCell>{property.type}</TableCell>
            <TableCell>{property.surface}</TableCell>
            <TableCell>{property.rent}€</TableCell>
            <TableCell>
              <Badge variant={getStatusBadgeVariant(property.status)}>
                {property.status}
              </Badge>
            </TableCell>
          </>
        );
      case 'contract':
        return (
          <>
            <TableCell>{property.type}</TableCell>
            <TableCell>{property.tenant || 'Aucun'}</TableCell>
            <TableCell>{property.rent}€</TableCell>
            <TableCell>
              <Badge variant={getStatusBadgeVariant(property.status)}>
                {property.status}
              </Badge>
            </TableCell>
          </>
        );
      case 'roommate':
        return (
          <>
            <TableCell>{property.type}</TableCell>
            <TableCell>{property.totalRooms || 0}</TableCell>
            <TableCell>{property.availableRooms || 0}</TableCell>
            <TableCell>{property.rent}€</TableCell>
          </>
        );
      case 'inspection':
        return (
          <>
            <TableCell>{property.type}</TableCell>
            <TableCell>{property.surface}</TableCell>
            <TableCell>-</TableCell>
            <TableCell>
              <Badge variant="outline">
                À programmer
              </Badge>
            </TableCell>
          </>
        );
      default:
        return null;
    }
  };

  if (ownerProperties.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="text-center py-8">
          <p className="text-gray-500">Aucune propriété trouvée</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Titre</TableHead>
            <TableHead>Adresse</TableHead>
            {getViewSpecificColumns()}
          </TableRow>
        </TableHeader>
        <TableBody>
          {ownerProperties.map((property) => (
            <TableRow key={property.id}>
              <TableCell className="font-medium">{property.title}</TableCell>
              <TableCell>{property.address}</TableCell>
              {getViewSpecificCells(property)}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default PropertyListTable;
