
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
      const querySnapshot = await getDocs(collection(db, 'Rent_owners'));
      const ownersData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Owner[];
      setOwners(ownersData);
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
