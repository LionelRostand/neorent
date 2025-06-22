
import React from 'react';
import OwnerSpaceMetrics from '@/components/OwnerSpace/OwnerSpaceMetrics';
import RoommateForm from '@/components/RoommateForm';

interface RoommateViewProps {
  currentProfile: any;
  onViewChange: (view: string) => void;
}

const RoommateView: React.FC<RoommateViewProps> = ({ currentProfile, onViewChange }) => {
  return (
    <div className="space-y-6">
      {/* Métriques pour les colocataires */}
      <OwnerSpaceMetrics ownerProfile={currentProfile} activeView="roommate" />
      
      <div className="bg-white rounded-lg shadow-sm p-6">
        <RoommateForm 
          onClose={() => onViewChange('dashboard')}
          onSubmit={async (data) => {
            // Handle roommate submission
            console.log('Roommate data:', data);
            onViewChange('dashboard');
          }}
          isInDialog={false}
        />
      </div>
    </div>
  );
};

export default RoommateView;
