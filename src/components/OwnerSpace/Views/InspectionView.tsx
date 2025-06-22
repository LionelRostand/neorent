
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import OwnerSpaceMetrics from '@/components/OwnerSpace/OwnerSpaceMetrics';
import InspectionForm from '@/components/InspectionForm';
import PropertyListTable from '@/components/OwnerSpace/PropertyListTable';

interface InspectionViewProps {
  currentProfile: any;
  onViewChange: (view: string) => void;
}

const InspectionView: React.FC<InspectionViewProps> = ({ currentProfile, onViewChange }) => {
  const [isNewInspectionDialogOpen, setIsNewInspectionDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Métriques pour les inspections */}
      <OwnerSpaceMetrics ownerProfile={currentProfile} activeView="inspection" />
      
      {/* Bouton New Inspection */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Gestion des États des Lieux</h3>
        <Dialog open={isNewInspectionDialogOpen} onOpenChange={setIsNewInspectionDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" />
              New Inspection
            </Button>
          </DialogTrigger>
          <InspectionForm
            onClose={() => setIsNewInspectionDialogOpen(false)}
            onSubmit={(data) => {
              // Handle inspection submission
              console.log('Inspection data:', data);
              setIsNewInspectionDialogOpen(false);
            }}
          />
        </Dialog>
      </div>
      
      {/* Tableau des propriétés avec vue inspections */}
      <PropertyListTable ownerProfile={currentProfile} viewType="inspection" />
    </div>
  );
};

export default InspectionView;
