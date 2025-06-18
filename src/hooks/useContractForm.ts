
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
    'Residential Lease',
    'Shared Accommodation Lease'
  ];

  // Rooms by property for shared accommodation
  const roomsByProperty = {
    'Villa Montparnasse': ['Room 1', 'Room 2', 'Room 3'],
    'Appartement République': ['Room A', 'Room B']
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

  // Filter properties according to contract type
  const getAvailableProperties = () => {
    if (loading) return [];
    
    if (formData.type === 'Residential Lease') {
      return properties.filter(property => property.locationType === 'Location');
    }
    if (formData.type === 'Shared Accommodation Lease') {
      return properties.filter(property => property.locationType === 'Colocation');
    }
    return properties;
  };

  const getAvailableTenants = () => {
    if (formData.type === 'Residential Lease') {
      return tenants.map(tenant => ({
        id: tenant.id,
        name: tenant.name,
        type: 'Tenant'
      }));
    }
    if (formData.type === 'Shared Accommodation Lease') {
      return roommates.map(roommate => ({
        id: roommate.id,
        name: roommate.name,
        type: 'Roommate'
      }));
    }
    return [];
  };

  const getAvailableRooms = () => {
    if (formData.type === 'Shared Accommodation Lease' && formData.property) {
      return roomsByProperty[formData.property] || [];
    }
    return [];
  };

  const isBailContract = formData.type === 'Residential Lease' || formData.type === 'Shared Accommodation Lease';
  const isColocatifContract = formData.type === 'Shared Accommodation Lease';
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
