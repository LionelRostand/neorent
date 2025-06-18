
import React from 'react';
import { Home } from 'lucide-react';

interface Tenant {
  id: string;
  name: string;
  type: string;
  property: string;
  rentAmount: number;
}

interface PropertyInfoDisplayProps {
  tenantData: Tenant;
}

const PropertyInfoDisplay: React.FC<PropertyInfoDisplayProps> = ({ tenantData }) => {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Home className="h-5 w-5 text-blue-600" />
        </div>
        <span className="font-semibold text-gray-800 text-lg">Informations du bien</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg p-4 border border-blue-100">
          <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">Type</p>
          <p className="text-sm font-semibold text-gray-800">{tenantData.type}</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-blue-100">
          <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">Propriété</p>
          <p className="text-sm font-semibold text-gray-800">{tenantData.property}</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-blue-100">
          <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">Loyer mensuel</p>
          <p className="text-sm font-semibold text-green-600">{tenantData.rentAmount}€</p>
        </div>
      </div>
    </div>
  );
};

export default PropertyInfoDisplay;
