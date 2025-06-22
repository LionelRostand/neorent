
import React from 'react';
import OwnerSpaceMetrics from '@/components/OwnerSpace/OwnerSpaceMetrics';
import PropertyForm from '@/components/PropertyForm';

interface PropertyViewProps {
  currentProfile: any;
  onViewChange: (view: string) => void;
}

const PropertyView: React.FC<PropertyViewProps> = ({ currentProfile, onViewChange }) => {
  return (
    <div className="space-y-6">
      {/* Métriques pour les propriétés */}
      <OwnerSpaceMetrics ownerProfile={currentProfile} activeView="property" />
      
      <div className="bg-white rounded-lg shadow-sm p-6">
        <PropertyForm 
          onClose={() => onViewChange('dashboard')}
          onSubmit={async (data) => {
            // Handle property submission
            console.log('Property data:', data);
            onViewChange('dashboard');
          }}
          isInDialog={false}
        />
      </div>
    </div>
  );
};

export default PropertyView;
