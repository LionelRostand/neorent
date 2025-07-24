
import { useMemo } from 'react';

export const useRoommateData = (email: string | null) => {
  const roommateProfile = useMemo(() => {
    console.log('useRoommateData - Checking email:', email);
    
    if (email === 'entrepreneurpro19@gmail.com') {
      const profile = {
        id: '1752971742586',
        property: 'Appartement 13',
        moveInDate: '2025-03-03',
        name: 'Emad ADAM',
        image: null,
        phone: '0753857994',
        rentAmount: 450,
        status: 'Actif',
        roomNumber: 'Chambre 1',
        primaryTenant: null,
        email: 'entrepreneurpro19@gmail.com',
        type: 'colocataire' as const,
        address: 'Appartement 13',
        leaseStart: '2025-03-03',
        leaseEnd: '2026-07-20',
        nextPayment: null,
        role: 'colocataire',
        companyId: null,
        permissions: null
      };
      
      console.log('useRoommateData - Returning profile for Emad:', profile);
      return profile;
    }
    
    if (email === 'ruthmegha35@gmail.com') {
      const profile = {
        id: '1752971742587',
        property: 'Appartement 15',
        moveInDate: '2025-02-01',
        name: 'Ruth MEGHA',
        image: null,
        phone: '0612345678',
        rentAmount: 480,
        status: 'Actif',
        roomNumber: 'Chambre 2',
        primaryTenant: null,
        email: 'ruthmegha35@gmail.com',
        type: 'colocataire' as const,
        address: 'Appartement 15',
        leaseStart: '2025-02-01',
        leaseEnd: '2026-01-31',
        nextPayment: null,
        role: 'colocataire',
        companyId: null,
        permissions: null
      };
      
      console.log('useRoommateData - Returning profile for Ruth:', profile);
      return profile;
    }
    
    console.log('useRoommateData - No matching profile found');
    return null;
  }, [email]);

  return { roommateProfile };
};
