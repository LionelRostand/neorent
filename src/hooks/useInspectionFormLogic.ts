
import { useState, useEffect } from 'react';
import { useFirebaseProperties } from '@/hooks/useFirebaseProperties';
import { useFirebaseTenants } from '@/hooks/useFirebaseTenants';
import { useFirebaseRoommates } from '@/hooks/useFirebaseRoommates';
import { useFirebaseOwners } from '@/hooks/useFirebaseOwners';

export const useInspectionFormLogic = () => {
  const { properties } = useFirebaseProperties();
  const { tenants } = useFirebaseTenants();
  const { roommates } = useFirebaseRoommates();
  const { owners } = useFirebaseOwners();

  const [formData, setFormData] = useState({
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

  const [availableTenants, setAvailableTenants] = useState<Array<{id: string, name: string, type: string}>>([]);
  const [availableRooms, setAvailableRooms] = useState<string[]>([]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Update tenants when property changes
  useEffect(() => {
    if (formData.property) {
      const selectedProperty = properties.find(p => p.title === formData.property);
      
      if (selectedProperty) {
        let propertyTenants: Array<{id: string, name: string, type: string}> = [];
        
        if (selectedProperty.locationType === 'Location') {
          const propertyTenantsList = tenants.filter(tenant => 
            tenant.property === selectedProperty.title
          );
          propertyTenants = propertyTenantsList.map(tenant => ({
            id: tenant.id,
            name: tenant.name,
            type: 'Locataire'
          }));
        } else if (selectedProperty.locationType === 'Colocation') {
          const propertyRoommatesList = roommates.filter(roommate => 
            roommate.property === selectedProperty.title
          );
          propertyTenants = propertyRoommatesList.map(roommate => ({
            id: roommate.id,
            name: roommate.name,
            type: 'Colocataire'
          }));
        }
        
        setAvailableTenants(propertyTenants);
        
        const newContractType = selectedProperty.locationType === 'Colocation' ? 'Bail colocatif' : 'Bail locatif';
        setFormData(prev => ({ ...prev, contractType: newContractType }));
      }
    } else {
      setAvailableTenants([]);
    }
    
    setFormData(prev => ({ ...prev, tenant: '' }));
  }, [formData.property, properties, tenants, roommates]);

  // Update rooms when property and contract type change
  useEffect(() => {
    if (formData.property && formData.contractType === 'Bail colocatif') {
      const selectedProperty = properties.find(p => p.title === formData.property);
      
      if (selectedProperty && selectedProperty.locationType === 'Colocation') {
        const rooms = [];
        for (let i = 1; i <= (selectedProperty.totalRooms || 0); i++) {
          rooms.push(`Chambre ${i}`);
        }
        setAvailableRooms(rooms);
      } else {
        setAvailableRooms([]);
      }
    } else {
      setAvailableRooms([]);
    }
    
    setFormData(prev => ({ ...prev, roomNumber: '' }));
  }, [formData.property, formData.contractType, properties]);

  return {
    formData,
    handleInputChange,
    availableTenants,
    availableRooms,
    properties,
    owners
  };
};
