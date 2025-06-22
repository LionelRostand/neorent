
import { useState } from 'react';
import { PropertyFormData } from '@/components/PropertyForm';

export const usePropertyFormLogic = (
  onSubmit: (data: PropertyFormData & { imageBase64?: string }) => Promise<void>,
  onClose: () => void
) => {
  const [formData, setFormData] = useState<PropertyFormData>({
    title: '',
    address: '',
    type: '',
    surface: '',
    rent: '',
    locationType: 'Entier',
    totalRooms: 1,
    availableRooms: 1,
    creditImmobilier: '',
    charges: {},
    image: null
  });

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.address || !formData.type) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Error submitting property:', error);
    }
  };

  return {
    formData,
    handleInputChange,
    handleSubmit
  };
};
