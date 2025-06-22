
import React from 'react';
import { useTranslation } from 'react-i18next';
import { DialogContent } from '@/components/ui/dialog';
import PropertyFormHeader from './PropertyForm/PropertyFormHeader';
import BasicPropertyFields from './PropertyForm/BasicPropertyFields';
import LocationFields from './PropertyForm/LocationFields';
import PropertyDetailsFields from './PropertyForm/PropertyDetailsFields';
import PropertyFormActions from './PropertyForm/PropertyFormActions';
import { usePropertyFormLogic } from '@/hooks/usePropertyFormLogic';

export interface PropertyFormData {
  title: string;
  address: string;
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
}

const PropertyForm = ({ onClose, onSubmit, isInDialog = true }: PropertyFormProps) => {
  const { t } = useTranslation();
  const {
    formData,
    handleInputChange,
    handleSubmit: handleFormSubmit
  } = usePropertyFormLogic(onSubmit, onClose);

  const formContent = (
    <>
      <PropertyFormHeader />
      
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

        <PropertyFormActions onClose={onClose} />
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
