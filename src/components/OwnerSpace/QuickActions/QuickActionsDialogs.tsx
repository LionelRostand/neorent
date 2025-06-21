
import React from 'react';
import { Dialog } from '@/components/ui/dialog';
import PropertyForm from '@/components/PropertyForm';
import RoommateForm from '@/components/RoommateForm';
import InspectionForm from '@/components/InspectionForm';

interface QuickActionsDialogsProps {
  openDialog: string | null;
  setOpenDialog: (dialog: string | null) => void;
  handlePropertySubmit: (propertyData: any) => Promise<void>;
  handleRoommateSubmit: (roommateData: any) => Promise<void>;
  handleInspectionSubmit: (inspectionData: any) => void;
  properties: any[];
}

const QuickActionsDialogs: React.FC<QuickActionsDialogsProps> = ({
  openDialog,
  setOpenDialog,
  handlePropertySubmit,
  handleRoommateSubmit,
  handleInspectionSubmit,
  properties
}) => {
  return (
    <>
      {/* Property Form Dialog */}
      <Dialog open={openDialog === 'property'} onOpenChange={() => setOpenDialog(null)}>
        <PropertyForm 
          onSubmit={handlePropertySubmit}
          onClose={() => setOpenDialog(null)}
        />
      </Dialog>

      {/* Roommate Form Dialog */}
      <Dialog open={openDialog === 'roommate'} onOpenChange={() => setOpenDialog(null)}>
        <RoommateForm 
          onSubmit={handleRoommateSubmit}
          onClose={() => setOpenDialog(null)}
          properties={properties}
        />
      </Dialog>

      {/* Inspection Form Dialog */}
      <Dialog open={openDialog === 'inspection'} onOpenChange={() => setOpenDialog(null)}>
        <InspectionForm 
          onSubmit={handleInspectionSubmit}
          onClose={() => setOpenDialog(null)}
        />
      </Dialog>
    </>
  );
};

export default QuickActionsDialogs;
