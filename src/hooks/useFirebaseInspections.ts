
import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface Inspection {
  id: string;
  title: string;
  type: string;
  tenant: string;
  property: string;
  roomNumber?: string;
  date: string;
  inspector: string;
  status: string;
  contractType: string;
  description?: string;
  observations?: string;
}

export const useFirebaseInspections = () => {
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInspections = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, 'Rent_Inspections'));
      const inspectionsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Inspection[];
      setInspections(inspectionsData);
      setError(null);
    } catch (err) {
      console.error('Error fetching inspections:', err);
      setError('Error loading inspections');
    } finally {
      setLoading(false);
    }
  };

  const addInspection = async (inspectionData: Omit<Inspection, 'id'>) => {
    try {
      const docRef = await addDoc(collection(db, 'Rent_Inspections'), inspectionData);
      const newInspection = { id: docRef.id, ...inspectionData };
      setInspections(prev => [...prev, newInspection]);
      return newInspection;
    } catch (err) {
      console.error('Error adding inspection:', err);
      setError('Error adding inspection');
      throw err;
    }
  };

  const updateInspection = async (id: string | number, updates: Partial<Inspection>) => {
    try {
      // Convert id to string to ensure Firebase compatibility
      const documentId = String(id);
      console.log('Updating inspection with ID:', documentId, 'Updates:', updates);
      
      await updateDoc(doc(db, 'Rent_Inspections', documentId), updates);
      setInspections(prev => prev.map(inspection => 
        inspection.id === documentId ? { ...inspection, ...updates } : inspection
      ));
    } catch (err) {
      console.error('Error updating inspection:', err);
      setError('Error updating inspection');
      throw err;
    }
  };

  const deleteInspection = async (id: string | number) => {
    try {
      // Convert id to string to ensure Firebase compatibility
      const documentId = String(id);
      await deleteDoc(doc(db, 'Rent_Inspections', documentId));
      setInspections(prev => prev.filter(inspection => inspection.id !== documentId));
    } catch (err) {
      console.error('Error deleting inspection:', err);
      setError('Error deleting inspection');
      throw err;
    }
  };

  useEffect(() => {
    fetchInspections();
  }, []);

  return {
    inspections,
    loading,
    error,
    addInspection,
    updateInspection,
    deleteInspection,
    refetch: fetchInspections
  };
};
