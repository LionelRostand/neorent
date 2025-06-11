
import { useState } from 'react';
import { useFirebaseProperties } from '@/hooks/useFirebaseProperties';
import { useFirebaseTenants } from '@/hooks/useFirebaseTenants';
import { useFirebaseRoommates } from '@/hooks/useFirebaseRoommates';

export const useContractForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    provider: '',
    property: '',
    roomNumber: '',
    startDate: '',
    endDate: '',
    amount: '',
    tenant: '',
    jurisdiction: '',
    description: ''
  });

  const { properties, loading } = useFirebaseProperties();
  const { tenants, loading: tenantsLoading } = useFirebaseTenants();
  const { roommates, loading: roommatesLoading } = useFirebaseRoommates();

  const contractTypes = [
    'Bail locatif',
    'Bail colocatif'
  ];

  // Chambres par bien en colocation
  const roomsByProperty = {
    'Villa Montparnasse': ['Chambre 1', 'Chambre 2', 'Chambre 3'],
    'Appartement République': ['Chambre A', 'Chambre B']
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      
      // Reset dependent fields when type changes
      if (field === 'type') {
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

  // Filtrer les propriétés selon le type de contrat
  const getAvailableProperties = () => {
    if (loading) return [];
    
    if (formData.type === 'Bail locatif') {
      return properties.filter(property => property.locationType === 'Location');
    }
    if (formData.type === 'Bail colocatif') {
      return properties.filter(property => property.locationType === 'Colocation');
    }
    return properties;
  };

  const getAvailableTenants = () => {
    if (formData.type === 'Bail locatif') {
      return tenants.map(tenant => ({
        id: tenant.id,
        name: tenant.name,
        type: 'Locataire'
      }));
    }
    if (formData.type === 'Bail colocatif') {
      return roommates.map(roommate => ({
        id: roommate.id,
        name: roommate.name,
        type: 'Colocataire'
      }));
    }
    return [];
  };

  const getAvailableRooms = () => {
    if (formData.type === 'Bail colocatif' && formData.property) {
      return roomsByProperty[formData.property] || [];
    }
    return [];
  };

  const isBailContract = formData.type === 'Bail locatif' || formData.type === 'Bail colocatif';
  const isColocatifContract = formData.type === 'Bail colocatif';
  const isDataLoading = loading || tenantsLoading || roommatesLoading;

  return {
    formData,
    handleInputChange,
    contractTypes,
    getAvailableProperties,
    getAvailableTenants,
    getAvailableRooms,
    isBailContract,
    isColocatifContract,
    isDataLoading,
    tenants,
    roommates
  };
};
