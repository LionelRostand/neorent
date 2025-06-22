
import { useState } from 'react';
import { Roommate } from '@/types/roommate';

export const useRoommateFormLogic = (onSubmit: (data: any) => Promise<void>, onClose: () => void) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    property: '',
    roomNumber: '',
    rentAmount: '',
    status: 'Actif',
    primaryTenant: '',
    moveInDate: '',
    image: null
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    const roommateData = {
      ...formData,
      id: Date.now().toString()
    };

    try {
      await onSubmit(roommateData);
    } catch (error) {
      console.error('Error submitting roommate:', error);
    }
  };

  return {
    formData,
    handleInputChange,
    handleSubmit
  };
};
