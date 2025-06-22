
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import OwnerSpaceMetrics from '@/components/OwnerSpace/OwnerSpaceMetrics';
import RoommateForm from '@/components/RoommateForm';
import PropertyListTable from '@/components/OwnerSpace/PropertyListTable';

interface RoommateViewProps {
  currentProfile: any;
  onViewChange: (view: string) => void;
}

const RoommateView: React.FC<RoommateViewProps> = ({ currentProfile, onViewChange }) => {
  const [isNewTenantDialogOpen, setIsNewTenantDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Roommate metrics */}
      <OwnerSpaceMetrics ownerProfile={currentProfile} activeView="roommate" />
      
      {/* Add Tenant button */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Tenant Management</h3>
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
      
      {/* Properties table with roommate view */}
      <PropertyListTable ownerProfile={currentProfile} viewType="roommate" />
    </div>
  );
};

export default RoommateView;
