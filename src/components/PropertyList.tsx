
import React from 'react';
import PropertyCard from './PropertyCard';

interface Property {
  id: number;
  title: string;
  address: string;
  type: string;
  surface: string;
  rent: string;
  status: string;
  tenant: string | null;
  image: string;
  locationType: string;
  totalRooms?: number | null;
  availableRooms?: number | null;
}

interface PropertyListProps {
  properties: Property[];
}

const PropertyList: React.FC<PropertyListProps> = ({ properties }) => {
  return (
    <>
      <div className="pt-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Liste des Biens Immobiliers</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </>
  );
};

export default PropertyList;
