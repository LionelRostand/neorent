
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import PropertyForm from '@/components/PropertyForm';
import RoommateForm from '@/components/RoommateForm';
import InspectionForm from '@/components/InspectionForm';

interface QuickActionDialogsProps {
  openDialog: string | null;
  setOpenDialog: (dialog: string | null) => void;
  properties: any[];
  onPropertySubmit: (data: any) => Promise<void>;
  onRoommateSubmit: (data: any) => Promise<void>;
  onInspectionSubmit: (data: any) => void;
}

const QuickActionDialogs: React.FC<QuickActionDialogsProps> = ({
  openDialog,
  setOpenDialog,
  properties,
  onPropertySubmit,
  onRoommateSubmit,
  onInspectionSubmit
}) => {
  return (
    <>
      {/* Property Form Dialog */}
      {openDialog === 'property' && (
        <Dialog open={true} onOpenChange={() => setOpenDialog(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Ajouter une nouvelle propriété</DialogTitle>
            </DialogHeader>
            <PropertyForm 
              onSubmit={onPropertySubmit}
              onClose={() => setOpenDialog(null)}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Roommate Form Dialog */}
      {openDialog === 'roommate' && (
        <Dialog open={true} onOpenChange={() => setOpenDialog(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Ajouter un nouveau locataire</DialogTitle>
            </DialogHeader>
            <RoommateForm 
              onSubmit={onRoommateSubmit}
              onClose={() => setOpenDialog(null)}
              properties={properties}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Inspection Form Dialog */}
      {openDialog === 'inspection' && (
        <Dialog open={true} onOpenChange={() => setOpenDialog(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Programmer un état des lieux</DialogTitle>
            </DialogHeader>
            <InspectionForm 
              onSubmit={onInspectionSubmit}
              onClose={() => setOpenDialog(null)}
            />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default QuickActionDialogs;
