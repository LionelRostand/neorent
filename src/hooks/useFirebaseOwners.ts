
import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface Owner {
  id: string;
  name: string;
  email: string;
  role: string;
  companyId?: string;
}

export const useFirebaseOwners = () => {
  const [owners, setOwners] = useState<Owner[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOwners = async () => {
    try {
      setLoading(true);
      console.log('🔄 Starting to fetch owners...');
      
      // Fetch from Rent_owners collection
      const rentOwnersSnapshot = await getDocs(collection(db, 'Rent_owners'));
      const rentOwnersData = rentOwnersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Owner[];
      console.log('📊 Rent_owners data:', rentOwnersData);

      // Fetch from user_roles collection to include admin users who are also owners
      const userRolesSnapshot = await getDocs(collection(db, 'user_roles'));
      const adminOwnersData = userRolesSnapshot.docs
        .filter(doc => {
          const data = doc.data();
          // Include users who are admin or have isOwner flag
          return data.role === 'admin' || data.isOwner === true;
        })
        .map(doc => ({
          id: doc.id,
          name: doc.data().name || doc.data().email,
          email: doc.data().email,
          role: doc.data().role,
          companyId: doc.data().companyId
        })) as Owner[];
      console.log('👑 Admin owners data:', adminOwnersData);

      // Combine both lists and remove duplicates based on email
      const combinedOwners = [...rentOwnersData, ...adminOwnersData];
      const uniqueOwners = combinedOwners.filter((owner, index, self) => 
        index === self.findIndex(o => o.email === owner.email)
      );
      console.log('✅ Final combined owners:', uniqueOwners);

      setOwners(uniqueOwners);
    } catch (error) {
      console.error('Error fetching owners:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOwners();
  }, []);

  return {
    owners,
    loading,
    refetch: fetchOwners
  };
};
