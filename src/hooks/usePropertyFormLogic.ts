
import { useState, useEffect } from 'react';
import { PropertyFormData } from '@/components/PropertyForm';

export const usePropertyFormLogic = (
  onSubmit: (data: PropertyFormData & { imageBase64?: string }) => Promise<void>,
  onClose: () => void,
  initialType?: string
) => {
  const [formData, setFormData] = useState<PropertyFormData>({
    title: '',
    address: '',
    streetNumber: '',
    street: '',
    city: '',
    postalCode: '',
    type: initialType || '',
    surface: '',
    rent: '',
    locationType: 'Entier',
    totalRooms: 1,
    availableRooms: 1,
    creditImmobilier: '',
    charges: {},
    image: null
  });

  useEffect(() => {
    if (initialType) {
      setFormData(prev => ({
        ...prev,
        type: initialType
      }));
    }
  }, [initialType]);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.streetNumber || !formData.street || !formData.city || !formData.postalCode || !formData.type) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    try {
      // Assembler l'adresse complète à partir des champs séparés
      const fullAddress = `${formData.streetNumber} ${formData.street}, ${formData.city} ${formData.postalCode}`;
      const submitData = {
        ...formData,
        address: fullAddress
      };
      
      await onSubmit(submitData);
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
