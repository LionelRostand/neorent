
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, UserCheck, Mail, Phone, Bed, Users } from 'lucide-react';

interface Occupant {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: 'Locataire principal' | 'Colocataire';
  roomNumber?: string;
  rentAmount?: string;
}

interface PropertyOccupantsListProps {
  occupants: Occupant[];
}

const PropertyOccupantsList: React.FC<PropertyOccupantsListProps> = ({ occupants }) => {
  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">
        Liste des occupants ({occupants.length})
      </h3>
      
      {occupants.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {occupants.map((occupant) => (
            <Card key={occupant.id}>
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    {occupant.type === 'Locataire principal' ? (
                      <User className="h-5 w-5 text-gray-400" />
                    ) : (
                      <UserCheck className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium">{occupant.name}</h4>
                      <Badge variant="outline" className="text-xs">
                        {occupant.type === 'Locataire principal' ? 'Locataire principal' : 'Colocataire'}
                      </Badge>
                    </div>
                    
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Mail className="mr-1 h-3 w-3" />
                        {occupant.email}
                      </div>
                      <div className="flex items-center">
                        <Phone className="mr-1 h-3 w-3" />
                        {occupant.phone}
                      </div>
                      {occupant.roomNumber && (
                        <div className="flex items-center">
                          <Bed className="mr-1 h-3 w-3" />
                          {occupant.roomNumber} - {occupant.rentAmount}/mois
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <Users className="h-12 w-12 mx-auto mb-3 text-gray-400" />
            <p className="text-gray-600">Aucun occupant pour cette propriété</p>
            <p className="text-sm text-gray-500 mt-1">
              Les occupants apparaîtront automatiquement une fois ajoutés dans la section Colocataires
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PropertyOccupantsList;
