
import { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface OwnerRegistration {
  id: string;
  name: string;
  email: string;
  companyName: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  type: string;
}

export const useOwnerRegistrations = () => {
  const [registrations, setRegistrations] = useState<OwnerRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      console.log('🔍 Chargement des demandes d\'inscription...');
      const querySnapshot = await getDocs(collection(db, 'owner_registrations'));
      const registrationsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as OwnerRegistration[];
      console.log('📊 Demandes chargées:', registrationsData);
      setRegistrations(registrationsData);
      setError(null);
    } catch (err) {
      console.error('Error fetching registrations:', err);
      setError('Erreur lors du chargement des demandes');
    } finally {
      setLoading(false);
    }
  };

  const updateRegistrationStatus = async (registrationId: string, status: 'approved' | 'rejected') => {
    try {
      await updateDoc(doc(db, 'owner_registrations', registrationId), {
        status,
        updatedAt: new Date().toISOString()
      });
      
      // Refresh the list
      await fetchRegistrations();
      return true;
    } catch (error) {
      console.error('Error updating registration status:', error);
      return false;
    }
  };

  const deleteRegistration = async (registrationId: string) => {
    try {
      await deleteDoc(doc(db, 'owner_registrations', registrationId));
      
      // Refresh the list
      await fetchRegistrations();
      return true;
    } catch (error) {
      console.error('Error deleting registration:', error);
      return false;
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  return {
    registrations,
    loading,
    error,
    updateRegistrationStatus,
    deleteRegistration,
    refetch: fetchRegistrations
  };
};
