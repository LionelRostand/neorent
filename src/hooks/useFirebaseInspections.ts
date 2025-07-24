
import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, getDoc } from 'firebase/firestore';
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
      
      console.log('Raw inspections data from Firebase:', inspectionsData);
      
      // Filter out any inspections with invalid IDs or missing critical data
      const validInspections = inspectionsData.filter(inspection => {
        const hasValidId = inspection.id && typeof inspection.id === 'string';
        const hasTitle = inspection.title && typeof inspection.title === 'string';
        
        if (!hasValidId) {
          console.warn('Filtered out inspection with invalid ID:', inspection);
          return false;
        }
        
        if (!hasTitle) {
          console.warn('Filtered out inspection without title:', inspection);
          return false;
        }
        
        return true;
      });
      
      console.log('Valid inspections after filtering:', validInspections);
      setInspections(validInspections);
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

  const updateInspection = async (id: string, updates: Partial<Inspection>) => {
    try {
      console.log('Updating inspection with ID:', id, 'Updates:', updates);
      
      // Ensure we're using string ID
      const documentId = String(id);
      
      // First check if the document exists
      const docRef = doc(db, 'Rent_Inspections', documentId);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        console.error('Document does not exist:', documentId);
        console.log('Available inspections:', inspections.map(i => ({ id: i.id, title: i.title })));
        setError(`Inspection with ID ${documentId} does not exist`);
        throw new Error(`Document with ID ${documentId} not found`);
      }
      
      await updateDoc(docRef, updates);
      setInspections(prev => prev.map(inspection => 
        inspection.id === documentId ? { ...inspection, ...updates } : inspection
      ));
      console.log('Successfully updated inspection:', documentId);
    } catch (err) {
      console.error('Error updating inspection:', err);
      setError('Error updating inspection');
      throw err;
    }
  };

  const deleteInspection = async (id: string) => {
    try {
      // Ensure we're using string ID
      const documentId = String(id);
      
      // First check if the document exists
      const docRef = doc(db, 'Rent_Inspections', documentId);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        console.error('Document does not exist:', documentId);
        setError(`Inspection with ID ${documentId} does not exist`);
        throw new Error(`Document with ID ${documentId} not found`);
      }
      
      await deleteDoc(docRef);
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
