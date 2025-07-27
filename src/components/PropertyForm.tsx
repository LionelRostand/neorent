
import React from 'react';
import { useTranslation } from 'react-i18next';
import { DialogContent } from '@/components/ui/dialog';
import PropertyFormHeader from './PropertyForm/PropertyFormHeader';
import BasicPropertyFields from './PropertyForm/BasicPropertyFields';
import LocationFields from './PropertyForm/LocationFields';
import PropertyDetailsFields from './PropertyForm/PropertyDetailsFields';
import PropertyFormActions from './PropertyForm/PropertyFormActions';
import { usePropertyFormLogic } from '@/hooks/usePropertyFormLogic';
import { FormButtonConfig } from '@/hooks/useFormButtonConfig';

export interface PropertyFormData {
  title: string;
  address: string;
  streetNumber: string;
  street: string;
  city: string;
  postalCode: string;
  latitude?: string;
  longitude?: string;
  type: string;
  surface: string;
  rent: string;
  locationType: string;
  totalRooms: number;
  availableRooms: number;
  creditImmobilier: string;
  charges: any;
  image: string | null;
}

interface PropertyFormProps {
  onClose: () => void;
  onSubmit: (data: PropertyFormData & { imageBase64?: string }) => Promise<void>;
  isInDialog?: boolean;
  initialType?: string;
  buttonConfig?: FormButtonConfig;
}

const PropertyForm = ({ onClose, onSubmit, isInDialog = true, initialType, buttonConfig }: PropertyFormProps) => {
  const { t } = useTranslation();
  const {
    formData,
    handleInputChange,
    handleSubmit: handleFormSubmit
  } = usePropertyFormLogic(onSubmit, onClose, initialType);

  const formContent = (
    <>
      <PropertyFormHeader isInDialog={isInDialog} />
      
      <form onSubmit={handleFormSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <BasicPropertyFields
            formData={formData}
            onInputChange={handleInputChange}
          />

          <LocationFields
            formData={formData}
            onInputChange={handleInputChange}
          />

          <PropertyDetailsFields
            formData={formData}
            onInputChange={handleInputChange}
          />
        </div>

        <PropertyFormActions onClose={onClose} buttonConfig={buttonConfig} />
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

export default PropertyForm;
