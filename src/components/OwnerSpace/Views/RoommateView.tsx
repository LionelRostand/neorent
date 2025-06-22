
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import OwnerSpaceMetrics from '@/components/OwnerSpace/OwnerSpaceMetrics';
import RoommateForm from '@/components/RoommateForm';

interface RoommateViewProps {
  currentProfile: any;
  onViewChange: (view: string) => void;
}

const RoommateView: React.FC<RoommateViewProps> = ({ currentProfile, onViewChange }) => {
  const [isNewTenantDialogOpen, setIsNewTenantDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Métriques pour les colocataires */}
      <OwnerSpaceMetrics ownerProfile={currentProfile} activeView="roommate" />
      
      {/* Bouton Add Tenant */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Gestion des Locataires</h3>
        <Dialog open={isNewTenantDialogOpen} onOpenChange={setIsNewTenantDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" />
              Add Tenant
            </Button>
          </DialogTrigger>
          <RoommateForm
            onClose={() => setIsNewTenantDialogOpen(false)}
            onSubmit={async (data) => {
              // Handle tenant submission
              console.log('Tenant data:', data);
              setIsNewTenantDialogOpen(false);
            }}
          />
        </Dialog>
      </div>
      
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
