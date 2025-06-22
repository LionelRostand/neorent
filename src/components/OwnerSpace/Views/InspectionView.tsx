
import React from 'react';
import OwnerSpaceMetrics from '@/components/OwnerSpace/OwnerSpaceMetrics';
import InspectionForm from '@/components/InspectionForm';

interface InspectionViewProps {
  currentProfile: any;
  onViewChange: (view: string) => void;
}

const InspectionView: React.FC<InspectionViewProps> = ({ currentProfile, onViewChange }) => {
  return (
    <div className="space-y-6">
      {/* Métriques pour les inspections */}
      <OwnerSpaceMetrics ownerProfile={currentProfile} activeView="inspection" />
      
      <div className="bg-white rounded-lg shadow-sm p-6">
        <InspectionForm 
          onClose={() => onViewChange('dashboard')}
          onSubmit={(data) => {
            // Handle inspection submission
            console.log('Inspection data:', data);
            onViewChange('dashboard');
          }}
          isInDialog={false}
        />
      </div>
    </div>
  );
};

export default InspectionView;
