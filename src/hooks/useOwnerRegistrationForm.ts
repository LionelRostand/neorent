
import { useState } from 'react';

export interface OwnerRegistrationFormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  address: string;
  message: string;
}

export const useOwnerRegistrationForm = () => {
  const [formData, setFormData] = useState<OwnerRegistrationFormData>({
    name: '',
    email: '',
    phone: '',
    company: '',
    address: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      company: '',
      address: '',
      message: ''
    });
  };

  return {
    formData,
    handleChange,
    resetForm
  };
};
