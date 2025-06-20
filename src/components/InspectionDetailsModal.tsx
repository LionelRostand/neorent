
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import InspectionEditForm from './InspectionEditForm';
import GeneralInfoSection from './InspectionDetails/GeneralInfoSection';
import PropertyDetailsSection from './InspectionDetails/PropertyDetailsSection';
import InspectionDetailsSection from './InspectionDetails/InspectionDetailsSection';
import ModalActions from './InspectionDetails/ModalActions';

interface InspectionDetails {
  id: number;
  title: string;
  type: string;
  tenant: string;
  property: string;
  roomNumber?: string;
  date: string;
  inspector: string;
  status: string;
  contractType?: string;
  description?: string;
  observations?: string;
}

interface InspectionDetailsModalProps {
  inspection: InspectionDetails | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate?: (inspection: InspectionDetails) => void;
}

const InspectionDetailsModal = ({ inspection, isOpen, onClose, onUpdate }: InspectionDetailsModalProps) => {
  const { t } = useTranslation();
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);

  const handleEditInspection = () => {
    setIsEditFormOpen(true);
  };

  const handleSaveInspection = (updatedData: any) => {
    if (inspection && onUpdate) {
      const updatedInspection = { ...inspection, ...updatedData };
      onUpdate(updatedInspection);
      console.log('État des lieux mis à jour dans la collection rent_etat:', updatedInspection);
    }
  };

  if (!inspection) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl w-[95vw] sm:w-[90vw] lg:w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto p-3 sm:p-4 lg:p-6">
          <DialogHeader className="pb-3 sm:pb-4">
            <DialogTitle className="text-lg sm:text-xl font-bold text-center sm:text-left pr-6 sm:pr-8">
              {t('inspections.inspectionDetails')}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 sm:space-y-6">
            <GeneralInfoSection inspection={inspection} />
            <PropertyDetailsSection inspection={inspection} />
            <InspectionDetailsSection inspection={inspection} />
            <ModalActions 
              inspection={inspection}
              onClose={onClose}
              onEdit={handleEditInspection}
            />
          </div>
        </DialogContent>
      </Dialog>

      <InspectionEditForm
        inspection={inspection}
        isOpen={isEditFormOpen}
        onClose={() => setIsEditFormOpen(false)}
        onSave={handleSaveInspection}
      />
    </>
  );
};

export default InspectionDetailsModal;
