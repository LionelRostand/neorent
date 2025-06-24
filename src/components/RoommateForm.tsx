
import React from 'react';
import { useTranslation } from 'react-i18next';
import { DialogContent } from '@/components/ui/dialog';
import RoommateFormHeader from './RoommateForm/RoommateFormHeader';
import BasicRoommateFields from './RoommateForm/BasicRoommateFields';
import PropertyRoomFields from './RoommateForm/PropertyRoomFields';
import RoommateDetailsFields from './RoommateForm/RoommateDetailsFields';
import RoommateFormActions from './RoommateForm/RoommateFormActions';
import { useRoommateFormLogic } from '@/hooks/useRoommateFormLogic';
import { FormButtonConfig } from '@/hooks/useFormButtonConfig';

interface Property {
  id: string;
  title: string;
  address: string;
  type: string;
  surface: string;
  rent: string;
  status: string;
  tenant: string | null;
  image: string;
  locationType: string;
  totalRooms: number;
  availableRooms: number;
}

interface RoommateFormProps {
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  isInDialog?: boolean;
  properties?: Property[];
  buttonConfig?: FormButtonConfig;
}

const RoommateForm = ({ onClose, onSubmit, isInDialog = true, properties, buttonConfig }: RoommateFormProps) => {
  const { t } = useTranslation();
  const {
    formData,
    handleInputChange,
    handleSubmit: handleFormSubmit
  } = useRoommateFormLogic(onSubmit, onClose);

  const formContent = (
    <>
      <RoommateFormHeader isInDialog={isInDialog} />
      
      <form onSubmit={handleFormSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <BasicRoommateFields
            formData={formData}
            onInputChange={handleInputChange}
          />

          <PropertyRoomFields
            formData={formData}
            onInputChange={handleInputChange}
            properties={properties}
          />

          <RoommateDetailsFields
            formData={formData}
            onInputChange={handleInputChange}
          />
        </div>

        <RoommateFormActions onClose={onClose} buttonConfig={buttonConfig} />
      </form>
    </>
  );

  if (isInDialog) {
    return (
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        {formContent}
      </DialogContent>
    );
  }

  return (
    <div className="space-y-4">
      {formContent}
    </div>
  );
};

export default RoommateForm;
