
import React from 'react';
import { useTranslation } from 'react-i18next';
import { DialogContent } from '@/components/ui/dialog';
import InspectionFormHeader from './InspectionForm/InspectionFormHeader';
import BasicInspectionFields from './InspectionForm/BasicInspectionFields';
import PropertyTenantSelector from './InspectionForm/PropertyTenantSelector';
import InspectionDetailsFields from './InspectionForm/InspectionDetailsFields';
import InspectionFormActions from './InspectionForm/InspectionFormActions';
import { useInspectionFormLogic } from '@/hooks/useInspectionFormLogic';

interface InspectionFormProps {
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const InspectionForm = ({ onClose, onSubmit }: InspectionFormProps) => {
  const { t } = useTranslation();
  const {
    formData,
    handleInputChange,
    availableTenants,
    availableRooms,
    properties
  } = useInspectionFormLogic();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.type || !formData.contractType || !formData.tenant || !formData.property) {
      alert(t('propertyForm.requiredFieldsError'));
      return;
    }

    const inspectionData = {
      ...formData,
      id: Date.now(),
      status: 'Planifié'
    };

    console.log('État des lieux ajouté à la collection rent_etat:', inspectionData);
    
    onSubmit(inspectionData);
    onClose();
  };

  return (
    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
      <InspectionFormHeader />
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <BasicInspectionFields
            formData={formData}
            onInputChange={handleInputChange}
          />

          <PropertyTenantSelector
            formData={formData}
            onInputChange={handleInputChange}
            properties={properties}
            availableTenants={availableTenants}
            availableRooms={availableRooms}
          />

          <InspectionDetailsFields
            formData={formData}
            onInputChange={handleInputChange}
          />
        </div>

        <InspectionFormActions onClose={onClose} />
      </form>
    </DialogContent>
  );
};

export default InspectionForm;
