
import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Property } from '@/types/property';

export const useFirebaseProperties = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProperties = async () => {
    try {
      console.log('🔄 Début récupération propriétés Firebase...');
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, 'Rent_properties'));
      console.log(`📊 Firebase response: ${querySnapshot.docs.length} documents trouvés`);
      
      const propertiesData = querySnapshot.docs.map(doc => {
        console.log(`📄 Document ${doc.id}:`, doc.data());
        return {
          id: doc.id,
          ...doc.data()
        };
      }) as Property[];
      
      console.log(`✅ Propriétés récupérées:`, propertiesData);
      setProperties(propertiesData);
      setError(null);
    } catch (err) {
      console.error('❌ Erreur Firebase:', err);
      setError('Erreur lors du chargement des biens');
    } finally {
      setLoading(false);
    }
  };

  const addProperty = async (propertyData: Omit<Property, 'id'>) => {
    try {
      // S'assurer qu'aucune valeur n'est undefined
      const cleanedData = {
        ...propertyData,
        totalRooms: propertyData.totalRooms || 0,
        availableRooms: propertyData.availableRooms || 0,
        creditImmobilier: propertyData.creditImmobilier || '',
        owner: propertyData.owner || '',
        charges: propertyData.charges || {},
        floor: propertyData.floor || ''
      };

      const docRef = await addDoc(collection(db, 'Rent_properties'), cleanedData);
      const newProperty = { id: docRef.id, ...cleanedData };
      setProperties(prev => [...prev, newProperty]);
      return newProperty;
    } catch (err) {
      console.error('Error adding property:', err);
      setError('Erreur lors de l\'ajout du bien');
      throw err;
    }
  };

  const updateProperty = async (id: string, updates: Partial<Property>) => {
    try {
      await updateDoc(doc(db, 'Rent_properties', id), updates);
      setProperties(prev => prev.map(property => 
        property.id === id ? { ...property, ...updates } : property
      ));
    } catch (err) {
      console.error('Error updating property:', err);
      setError('Erreur lors de la mise à jour du bien');
      throw err;
    }
  };

  const deleteProperty = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'Rent_properties', id));
      setProperties(prev => prev.filter(property => property.id !== id));
    } catch (err) {
      console.error('Error deleting property:', err);
      setError('Erreur lors de la suppression du bien');
      throw err;
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  return {
    properties,
    loading,
    error,
    addProperty,
    updateProperty,
    deleteProperty,
    refetch: fetchProperties
  };
};
