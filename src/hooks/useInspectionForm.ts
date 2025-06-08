
import { useState } from 'react';
import { InspectionFormData, Tenant } from '@/types/inspection';
import { 
  tenants, 
  roommates, 
  locationProperties, 
  colocationProperties, 
  roomsByProperty 
} from '@/constants/inspectionData';

export const useInspectionForm = () => {
  const [formData, setFormData] = useState<InspectionFormData>({
    title: '',
    type: '',
    contractType: '',
    tenant: '',
    property: '',
    propertyType: '',
    roomNumber: '',
    date: '',
    inspector: '',
    description: '',
    observations: ''
  });

  const handleInputChange = (field: keyof InspectionFormData, value: string) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      
      // Reset dependent fields when contract type changes
      if (field === 'contractType') {
        newData.property = '';
        newData.tenant = '';
        newData.roomNumber = '';
      }
      
      // Reset room when property changes
      if (field === 'property') {
        newData.roomNumber = '';
      }
      
      return newData;
    });
  };

  const getAvailableProperties = () => {
    if (formData.contractType === 'Bail locatif') return locationProperties;
    if (formData.contractType === 'Bail colocatif') return colocationProperties;
    return [];
  };

  const getAvailableTenants = (): Tenant[] => {
    if (formData.contractType === 'Bail locatif') return tenants;
    if (formData.contractType === 'Bail colocatif') return roommates;
    return [];
  };

  const getAvailableRooms = () => {
    if (formData.contractType === 'Bail colocatif' && formData.property) {
      return roomsByProperty[formData.property] || [];
    }
    return [];
  };

  return {
    formData,
    handleInputChange,
    getAvailableProperties,
    getAvailableTenants,
    getAvailableRooms
  };
};
