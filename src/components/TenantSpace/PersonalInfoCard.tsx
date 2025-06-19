
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Mail, Phone, Calendar, Clock, Key } from 'lucide-react';

interface PersonalInfoCardProps {
  tenantData: any;
  isRoommate: boolean;
}

const PersonalInfoCard: React.FC<PersonalInfoCardProps> = ({ tenantData, isRoommate }) => {
  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-xl">
          <div className="p-2 bg-green-100 rounded-lg">
            <User className="h-5 w-5 text-green-600" />
          </div>
          Mes informations
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <User className="h-4 w-4 text-gray-500" />
              <div>
                <span className="font-medium text-gray-700 block">Nom complet</span>
                <span className="text-gray-600">{tenantData.name}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-gray-500" />
              <div>
                <span className="font-medium text-gray-700 block">Email</span>
                <span className="text-gray-600 text-sm break-all">{tenantData.email}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-gray-500" />
              <div>
                <span className="font-medium text-gray-700 block">Téléphone</span>
                <span className="text-gray-600">{tenantData.phone}</span>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-blue-500" />
              <div>
                <span className="font-medium text-gray-700 block">Début du bail</span>
                <span className="text-blue-600">{new Date(tenantData.leaseStart).toLocaleDateString('fr-FR')}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="h-4 w-4 text-orange-500" />
              <div>
                <span className="font-medium text-gray-700 block">Fin du bail</span>
                <span className="text-orange-600">{new Date(tenantData.leaseEnd).toLocaleDateString('fr-FR')}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-4 w-4 bg-gray-400 rounded-full"></div>
              <div>
                <span className="font-medium text-gray-700 block">Statut</span>
                <Badge variant={tenantData.status === 'À jour' ? 'default' : 'destructive'}>
                  {tenantData.status}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {isRoommate && tenantData.roomNumber && (
          <div className="pt-4 border-t">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <Key className="h-5 w-5 text-blue-600" />
                <div>
                  <span className="font-medium text-blue-800 block">Numéro de chambre</span>
                  <Badge variant="outline" className="mt-1 border-blue-200 text-blue-700">
                    Chambre {tenantData.roomNumber}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PersonalInfoCard;
