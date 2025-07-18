
import React from 'react';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import PropertyForm from '@/components/PropertyForm';
import RoommateForm from '@/components/RoommateForm';
import InspectionForm from '@/components/InspectionForm';
import ContractForm from '@/components/ContractForm';

interface QuickActionDialogsProps {
  openDialog: string | null;
  setOpenDialog: (dialogId: string | null) => void;
  onPropertySubmit: (data: any) => Promise<void>;
  onRoommateSubmit: (data: any) => Promise<void>;
  onTenantSubmit: (data: any) => Promise<void>;
  onContractSubmit: (data: any) => Promise<void>;
  onInspectionSubmit: (data: any) => Promise<void>;
  onPaymentSubmit: (data: any) => Promise<void>;
  ownerProperties: any[];
  activeTenants: any[];
  expiringContracts: number;
  pendingPayments: number;
}

const QuickActionDialogs: React.FC<QuickActionDialogsProps> = ({
  openDialog,
  setOpenDialog,
  onPropertySubmit,
  onRoommateSubmit,
  onTenantSubmit,
  onContractSubmit,
  onInspectionSubmit,
  onPaymentSubmit,
  ownerProperties,
  activeTenants,
  expiringContracts,
  pendingPayments
}) => {
  return (
    <>
      {/* Property Dialog */}
      <Dialog open={openDialog === 'property'} onOpenChange={() => setOpenDialog(null)}>
        <PropertyForm 
          onClose={() => setOpenDialog(null)}
          onSubmit={onPropertySubmit}
        />
      </Dialog>

      {/* Roommate Dialog */}
      <Dialog open={openDialog === 'roommate'} onOpenChange={() => setOpenDialog(null)}>
        <RoommateForm 
          onClose={() => setOpenDialog(null)}
          onSubmit={onRoommateSubmit}
        />
      </Dialog>

      {/* Inspection Dialog */}
      <Dialog open={openDialog === 'inspection'} onOpenChange={() => setOpenDialog(null)}>
        <InspectionForm 
          onClose={() => setOpenDialog(null)}
          onSubmit={onInspectionSubmit}
        />
      </Dialog>

      {/* Contract Dialog */}
      <Dialog open={openDialog === 'contract'} onOpenChange={() => setOpenDialog(null)}>
        <ContractForm 
          onClose={() => setOpenDialog(null)}
          onSubmit={onContractSubmit}
        />
      </Dialog>
    </>
  );
};

export default QuickActionDialogs;
