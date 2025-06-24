
import React from 'react';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useFormButtonConfig } from '@/hooks/useFormButtonConfig';
import PropertyForm from '@/components/PropertyForm';
import RoommateForm from '@/components/RoommateForm';
import InspectionForm from '@/components/InspectionForm';
import ContractForm from '@/components/ContractForm';

interface QuickActionDialogsProps {
  openDialog: string | null;
  setOpenDialog: (dialogId: string | null) => void;
  properties: any[];
  onPropertySubmit: (data: any) => Promise<void>;
  onRoommateSubmit: (data: any) => Promise<void>;
  onInspectionSubmit: (data: any) => void;
  onContractSubmit?: (data: any) => Promise<void>;
}

const QuickActionDialogs: React.FC<QuickActionDialogsProps> = ({
  openDialog,
  setOpenDialog,
  properties,
  onPropertySubmit,
  onRoommateSubmit,
  onInspectionSubmit,
  onContractSubmit
}) => {
  const { getButtonConfig } = useFormButtonConfig();

  // Configuration des boutons pour chaque type de formulaire
  const propertyButtonConfig = getButtonConfig('property');
  const roommateButtonConfig = getButtonConfig('roommate');
  const inspectionButtonConfig = getButtonConfig('inspection');
  const contractButtonConfig = getButtonConfig('contract');

  return (
    <>
      {/* Property Dialog */}
      <Dialog open={openDialog === 'property'} onOpenChange={() => setOpenDialog(null)}>
        <PropertyForm 
          onClose={() => setOpenDialog(null)}
          onSubmit={onPropertySubmit}
          buttonConfig={propertyButtonConfig}
        />
      </Dialog>

      {/* Roommate Dialog */}
      <Dialog open={openDialog === 'roommate'} onOpenChange={() => setOpenDialog(null)}>
        <RoommateForm 
          onClose={() => setOpenDialog(null)}
          onSubmit={onRoommateSubmit}
          buttonConfig={roommateButtonConfig}
        />
      </Dialog>

      {/* Inspection Dialog */}
      <Dialog open={openDialog === 'inspection'} onOpenChange={() => setOpenDialog(null)}>
        <InspectionForm 
          onClose={() => setOpenDialog(null)}
          onSubmit={onInspectionSubmit}
          buttonConfig={inspectionButtonConfig}
        />
      </Dialog>

      {/* Contract Dialog */}
      <Dialog open={openDialog === 'contract'} onOpenChange={() => setOpenDialog(null)}>
        <ContractForm 
          onClose={() => setOpenDialog(null)}
          onSubmit={onContractSubmit || (() => Promise.resolve())}
          buttonConfig={contractButtonConfig}
        />
      </Dialog>
    </>
  );
};

export default QuickActionDialogs;
