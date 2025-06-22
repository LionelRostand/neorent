
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import OwnerSpaceMetrics from '@/components/OwnerSpace/OwnerSpaceMetrics';
import PropertyForm from '@/components/PropertyForm';

interface PropertyViewProps {
  currentProfile: any;
  onViewChange: (view: string) => void;
}

const PropertyView: React.FC<PropertyViewProps> = ({ currentProfile, onViewChange }) => {
  const [isNewPropertyDialogOpen, setIsNewPropertyDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Métriques pour les propriétés */}
      <OwnerSpaceMetrics ownerProfile={currentProfile} activeView="property" />
      
      {/* Bouton Add Property */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Gestion des Propriétés</h3>
        <Dialog open={isNewPropertyDialogOpen} onOpenChange={setIsNewPropertyDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" />
              Add Property
            </Button>
          </DialogTrigger>
          <PropertyForm
            onClose={() => setIsNewPropertyDialogOpen(false)}
            onSubmit={async (data) => {
              // Handle property submission
              console.log('Property data:', data);
              setIsNewPropertyDialogOpen(false);
            }}
          />
        </Dialog>
      </div>
      
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
