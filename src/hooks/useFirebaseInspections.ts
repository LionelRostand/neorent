
import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface Inspection {
  id: string;
  originalId?: string;
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
      console.log('Starting to fetch inspections from Rent_Inspections collection...');
      
      const querySnapshot = await getDocs(collection(db, 'Rent_Inspections'));
      console.log('Firebase query snapshot received, docs count:', querySnapshot.docs.length);
      
      const inspectionsData = querySnapshot.docs.map(doc => {
        const data = doc.data();
        console.log('Document data:', { 
          documentId: doc.id, 
          fieldId: data.id,
          ...data 
        });
        return {
          id: doc.id, // Use Firebase document ID
          originalId: data.id, // Keep original ID as backup
          ...data
        };
      }) as Inspection[];
      
      console.log('All inspections data:', inspectionsData);
      
      // Temporarily remove filtering to see all data
      setInspections(inspectionsData);
      setError(null);
      
      console.log('Inspections set in state:', inspectionsData);
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
      console.log('=== UPDATE INSPECTION DEBUG ===');
      console.log('Original ID received:', id, 'Type:', typeof id);
      console.log('Updates:', updates);
      
      // Ensure we're using string ID
      const documentId = String(id);
      console.log('Document ID after String conversion:', documentId);
      
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
