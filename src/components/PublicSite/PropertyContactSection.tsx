
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Phone,
  Mail,
  Calendar
} from 'lucide-react';

interface PropertyContactSectionProps {
  property: any;
  onScheduleVisit: () => void;
}

export const PropertyContactSection = ({ property, onScheduleVisit }: PropertyContactSectionProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Libre':
        return 'bg-green-100 text-green-800';
      case 'Occupé':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Contact
        </h3>
        <div className="p-4 bg-blue-50 rounded-lg space-y-3">
          <div className="text-center">
            <p className="font-medium text-gray-900">Neo Rent</p>
            <p className="text-sm text-gray-600">Gestionnaire immobilier</p>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex items-center">
              <Phone className="h-4 w-4 mr-2 text-blue-600" />
              <span>+33 1 23 45 67 89</span>
            </div>
            <div className="flex items-center">
              <Mail className="h-4 w-4 mr-2 text-blue-600" />
              <span>contact@neorent.fr</span>
            </div>
          </div>
          <div className="pt-2 border-t border-blue-200">
            <Button 
              className="w-full bg-blue-600 hover:bg-blue-700"
              onClick={onScheduleVisit}
            >
              <Calendar className="h-4 w-4 mr-2" />
              Programmer une visite
            </Button>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Disponibilité
        </h3>
        <div className={`p-3 rounded-lg ${
          property.status === 'Libre' 
            ? 'bg-green-50 border border-green-200' 
            : 'bg-gray-50 border border-gray-200'
        }`}>
          <div className="flex items-center justify-between">
            <span className="font-medium">
              {property.status === 'Libre' ? 'Disponible immédiatement' : 'Non disponible'}
            </span>
            <Badge className={getStatusColor(property.status)}>
              {property.status}
            </Badge>
          </div>
          {property.status === 'Libre' && (
            <p className="text-sm text-gray-600 mt-1">
              Visite possible sous 24h
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
