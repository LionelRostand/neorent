
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Mail, Phone, MapPin, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ProfileFormFieldsProps {
  tenantData: {
    name: string;
    email: string;
    phone: string;
    address: string;
    leaseStart: string;
    leaseEnd: string;
    status: string;
  };
  formData: {
    phone: string;
  };
  isEditing: boolean;
  isUpdating: boolean;
  onFormDataChange: (field: string, value: string) => void;
}

const ProfileFormFields: React.FC<ProfileFormFieldsProps> = ({
  tenantData,
  formData,
  isEditing,
  isUpdating,
  onFormDataChange
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
          <div className="flex items-center space-x-3">
            <User className="h-4 w-4 md:h-5 md:w-5 text-gray-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xs md:text-sm text-gray-600">Nom complet</p>
              <p className="font-medium text-sm md:text-base truncate">{tenantData.name}</p>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
          <div className="flex items-center space-x-3">
            <Mail className="h-4 w-4 md:h-5 md:w-5 text-gray-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xs md:text-sm text-gray-600">Email</p>
              <p className="font-medium text-sm md:text-base truncate">{tenantData.email}</p>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
          <div className="flex items-center space-x-3 flex-1">
            <Phone className="h-4 w-4 md:h-5 md:w-5 text-gray-400 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs md:text-sm text-gray-600">Téléphone</p>
              {isEditing ? (
                <Input
                  value={formData.phone}
                  onChange={(e) => onFormDataChange('phone', e.target.value)}
                  className="mt-1 text-sm md:text-base"
                  placeholder="Numéro de téléphone"
                  disabled={isUpdating}
                />
              ) : (
                <p className="font-medium text-sm md:text-base">{tenantData.phone}</p>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-start space-y-2 sm:space-y-0 sm:space-x-3">
          <div className="flex items-start space-x-3">
            <MapPin className="h-4 w-4 md:h-5 md:w-5 text-gray-400 flex-shrink-0 mt-1" />
            <div className="min-w-0">
              <p className="text-xs md:text-sm text-gray-600">Adresse du logement</p>
              <p className="font-medium text-sm md:text-base">{tenantData.address}</p>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-start space-y-2 sm:space-y-0 sm:space-x-3">
          <div className="flex items-start space-x-3">
            <Calendar className="h-4 w-4 md:h-5 md:w-5 text-gray-400 flex-shrink-0 mt-1" />
            <div className="min-w-0">
              <p className="text-xs md:text-sm text-gray-600">Période de bail</p>
              <p className="font-medium text-sm md:text-base">
                Du {new Date(tenantData.leaseStart).toLocaleDateString('fr-FR')} au {new Date(tenantData.leaseEnd).toLocaleDateString('fr-FR')}
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 md:w-5 md:h-5 flex items-center justify-center">
              <Badge 
                variant={tenantData.status === 'À jour' ? 'default' : 'destructive'}
                className={`${tenantData.status === 'À jour' ? 'bg-green-100 text-green-800' : ''} text-xs`}
              >
                {tenantData.status}
              </Badge>
            </div>
            <div>
              <p className="text-xs md:text-sm text-gray-600">Statut du compte</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileFormFields;
