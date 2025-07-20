
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import InspectionEditForm from './InspectionEditForm';
import GeneralInfoSection from './InspectionDetails/GeneralInfoSection';
import PropertyDetailsSection from './InspectionDetails/PropertyDetailsSection';
import InspectionDetailsSection from './InspectionDetails/InspectionDetailsSection';
import ModalActions from './InspectionDetails/ModalActions';
import { Inspection } from '@/types/inspection';

interface InspectionDetailsModalProps {
  inspection: Inspection | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate?: (inspection: Inspection) => void;
}

const InspectionDetailsModal = ({ inspection, isOpen, onClose, onUpdate }: InspectionDetailsModalProps) => {
  const { t } = useTranslation();
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);

  const handleEditInspection = () => {
    setIsEditFormOpen(true);
  };

  const handleSaveInspection = (updatedData: Partial<Inspection>) => {
    if (inspection && onUpdate) {
      const updatedInspection = { ...inspection, ...updatedData };
      onUpdate(updatedInspection);
      console.log('État des lieux mis à jour dans la collection rent_etat:', updatedInspection);
    }
  };

  const getTranslatedInspectionType = (type: string) => {
    switch (type) {
      case 'Entrée':
        return t('inspections.entryInspection');
      case 'Sortie':
        return t('inspections.exitInspection');
      case 'Intermédiaire':
        return t('inspections.intermediateInspection');
      default:
        return type;
    }
  };

  const getTranslatedStatus = (status: string) => {
    switch (status) {
      case 'Planifié':
        return t('inspections.planned');
      case 'En cours':
        return t('inspections.inProgress');
      case 'Terminé':
        return t('inspections.completed');
      default:
        return status;
    }
  };

  if (!inspection) return null;

  // Create a translated version of the inspection for display
  const translatedInspection = {
    ...inspection,
    type: getTranslatedInspectionType(inspection.type),
    status: getTranslatedStatus(inspection.status)
  };

  // Convert inspection to the format expected by ModalActions (with numeric id)
  const modalActionsInspection = {
    ...inspection,
    id: parseInt(inspection.id) || 0 // Convert string id to number for ModalActions compatibility
  };

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
            <GeneralInfoSection inspection={translatedInspection} />
            <PropertyDetailsSection inspection={translatedInspection} />
            <InspectionDetailsSection inspection={translatedInspection} />
            <ModalActions 
              inspection={modalActionsInspection}
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
