
import React, { useState } from 'react';
import PropertyCard from './PropertyCard';
import PropertyDetailsModal from './PropertyDetailsModal';
import PropertyEditModal from './PropertyEditModal';

interface Property {
  id: string;
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
  onUpdateProperty?: (id: string, updates: Partial<Property>) => void;
  onDeleteProperty?: (id: string) => void;
}

const PropertyList: React.FC<PropertyListProps> = ({ properties, onUpdateProperty, onDeleteProperty }) => {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handlePropertyClick = (property: Property) => {
    setSelectedProperty(property);
    setIsDetailsModalOpen(true);
  };

  const handleEditProperty = (property: Property) => {
    setEditingProperty(property);
    setIsEditModalOpen(true);
  };

  const handleSaveProperty = (id: string, updates: Partial<Property>) => {
    if (onUpdateProperty) {
      onUpdateProperty(id, updates);
    }
  };

  const handleDeleteProperty = (id: string) => {
    if (onDeleteProperty) {
      onDeleteProperty(id);
    }
  };

  const handleCloseDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedProperty(null);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingProperty(null);
  };

  return (
    <>
      <div className="pt-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Liste des Biens Immobiliers</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => (
          <PropertyCard 
            key={property.id} 
            property={property} 
            onClick={handlePropertyClick}
            onEdit={handleEditProperty}
            onDelete={handleDeleteProperty}
          />
        ))}
      </div>
      
      <PropertyDetailsModal
        property={selectedProperty}
        isOpen={isDetailsModalOpen}
        onClose={handleCloseDetailsModal}
      />

      <PropertyEditModal
        property={editingProperty}
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        onSave={handleSaveProperty}
      />
    </>
  );
};

export default PropertyList;
