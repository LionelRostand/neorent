
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFirebaseProperties } from '@/hooks/useFirebaseProperties';
import { useFirebaseTenants } from '@/hooks/useFirebaseTenants';
import { useFirebaseRoommates } from '@/hooks/useFirebaseRoommates';
import { useFirebaseOwners } from '@/hooks/useFirebaseOwners';

// Constants for contract types
const CONTRACT_TYPE_RESIDENTIAL = 'Residential Lease';
const CONTRACT_TYPE_SHARED = 'Shared Accommodation Lease';

export const useContractForm = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    owner: '',
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
  const { owners, loading: ownersLoading } = useFirebaseOwners();

  const contractTypes = [
    {
      value: CONTRACT_TYPE_RESIDENTIAL,
      label: t('contractForm.contractTypes.residential')
    },
    {
      value: CONTRACT_TYPE_SHARED, 
      label: t('contractForm.contractTypes.shared')
    }
  ];

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
    
    if (formData.type === CONTRACT_TYPE_RESIDENTIAL) {
      return properties.filter(property => property.locationType === 'Location');
    }
    if (formData.type === CONTRACT_TYPE_SHARED) {
      return properties.filter(property => property.locationType === 'Colocation');
    }
    return properties;
  };

  const getAvailableTenants = () => {
    if (formData.type === CONTRACT_TYPE_RESIDENTIAL) {
      return tenants.map(tenant => ({
        id: tenant.id,
        name: tenant.name,
        type: 'Tenant'
      }));
    }
    if (formData.type === CONTRACT_TYPE_SHARED) {
      return roommates.map(roommate => ({
        id: roommate.id,
        name: roommate.name,
        type: 'Roommate'
      }));
    }
    return [];
  };

  const getAvailableRooms = () => {
    if (formData.type === CONTRACT_TYPE_SHARED && formData.property) {
      const selectedProperty = properties.find(p => p.title === formData.property);
      if (selectedProperty && selectedProperty.totalRooms) {
        // Generate room list based on totalRooms
        return Array.from({ length: selectedProperty.totalRooms }, (_, index) => `Chambre ${index + 1}`);
      }
    }
    return [];
  };

  const isBailContract = formData.type === CONTRACT_TYPE_RESIDENTIAL || formData.type === CONTRACT_TYPE_SHARED;
  const isColocatifContract = formData.type === CONTRACT_TYPE_SHARED;
  const isDataLoading = loading || tenantsLoading || roommatesLoading || ownersLoading;

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
    roommates,
    owners
  };
};
