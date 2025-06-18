
import React from 'react';
import { Building, Calendar, CheckCircle } from 'lucide-react';

interface PropertyDetailsProps {
  property: string;
  dueDate: string;
  paymentDate: string | null;
  paymentMethod: string | null;
}

const PropertyDetails: React.FC<PropertyDetailsProps> = ({ 
  property, 
  dueDate, 
  paymentDate, 
  paymentMethod 
}) => {
  return (
    <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4 flex-1">
      <div className="flex items-start text-xs sm:text-sm text-gray-600">
        <Building className="mr-2 h-3 w-3 sm:h-4 sm:w-4 text-blue-500 flex-shrink-0 mt-0.5" />
        <span className="break-words">{property}</span>
      </div>
      
      <div className="flex items-center text-xs sm:text-sm text-gray-600">
        <Calendar className="mr-2 h-3 w-3 sm:h-4 sm:w-4 text-orange-500 flex-shrink-0" />
        <span>Échéance: {new Date(dueDate).toLocaleDateString('fr-FR')}</span>
      </div>

      {paymentDate && (
        <div className="flex items-center text-xs sm:text-sm text-gray-600">
          <CheckCircle className="mr-2 h-3 w-3 sm:h-4 sm:w-4 text-green-500 flex-shrink-0" />
          <span className="break-words">
            Payé le: {new Date(paymentDate).toLocaleDateString('fr-FR')}
            {paymentMethod && <span className="ml-1">({paymentMethod})</span>}
          </span>
        </div>
      )}
    </div>
  );
};

export default PropertyDetails;
