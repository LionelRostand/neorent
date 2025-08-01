
import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface Roommate {
  id: string;
  name: string;
  email: string;
  phone: string;
  property: string;
  roomNumber: string;
  rentAmount: string;
  status: string;
  primaryTenant: string;
  moveInDate: string;
  image: string | null;
  paidAmount?: number;
}

export const useFirebaseRoommates = () => {
  const [roommates, setRoommates] = useState<Roommate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkRoommateExists = async (email: string): Promise<Roommate | null> => {
    try {
      const querySnapshot = await getDocs(collection(db, 'Rent_colocataires'));
      const existingRoommate = querySnapshot.docs.find(doc => {
        const data = doc.data();
        return data.email === email;
      });
      
      if (existingRoommate) {
        return { id: existingRoommate.id, ...existingRoommate.data() } as Roommate;
      }
      return null;
    } catch (err) {
      console.error('Error checking roommate existence:', err);
      return null;
    }
  };

  const fetchRoommates = async () => {
    try {
      console.log('🔄 Début récupération colocataires Firebase...');
      setLoading(true);
      
      console.log('📡 Récupération des colocataires depuis Rent_colocataires...');
      const querySnapshot = await getDocs(collection(db, 'Rent_colocataires'));
      console.log(`📊 Firebase response: ${querySnapshot.docs.length} documents trouvés`);
      
      const roommatesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Roommate[];
      
      // Déduplication basée sur l'email (champ unique)
      const uniqueRoommates = roommatesData.reduce((acc: Roommate[], current) => {
        const isDuplicate = acc.some(roommate => 
          roommate.email === current.email && 
          roommate.name === current.name
        );
        
        if (!isDuplicate) {
          acc.push(current);
        } else {
          console.warn(`Duplicata détecté pour ${current.name} (${current.email}), ignoré`);
        }
        
        return acc;
      }, []);
      
      console.log(`📊 Colocataires récupérés: ${roommatesData.length} total, ${uniqueRoommates.length} uniques`);
      setRoommates(uniqueRoommates);
      setError(null);
    } catch (err) {
      console.error('Error fetching roommates:', err);
      setError('Erreur lors du chargement des colocataires');
    } finally {
      setLoading(false);
    }
  };

  const addRoommate = async (roommateData: Omit<Roommate, 'id'>) => {
    try {
      const docRef = await addDoc(collection(db, 'Rent_colocataires'), roommateData);
      const newRoommate = { id: docRef.id, ...roommateData };
      setRoommates(prev => [...prev, newRoommate]);
      return newRoommate;
    } catch (err) {
      console.error('Error adding roommate:', err);
      setError('Erreur lors de l\'ajout du colocataire');
      throw err;
    }
  };

  const updateRoommate = async (id: string, updates: Partial<Roommate>) => {
    try {
      await updateDoc(doc(db, 'Rent_colocataires', id), updates);
      setRoommates(prev => prev.map(roommate => 
        roommate.id === id ? { ...roommate, ...updates } : roommate
      ));
    } catch (err) {
      console.error('Error updating roommate:', err);
      setError('Erreur lors de la mise à jour du colocataire');
      throw err;
    }
  };

  const deleteRoommate = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'Rent_colocataires', id));
      setRoommates(prev => prev.filter(roommate => roommate.id !== id));
    } catch (err) {
      console.error('Error deleting roommate:', err);
      setError('Erreur lors de la suppression du colocataire');
      throw err;
    }
  };

  const cleanupDuplicates = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'Rent_colocataires'));
      const allRoommates = querySnapshot.docs.map(doc => ({
        docId: doc.id,
        ...doc.data()
      }));

      console.log(`🔍 Recherche de doublons parmi ${allRoommates.length} colocataires...`);

      // Grouper par email normalisé + nom normalisé pour détecter les doublons
      const emailGroups = allRoommates.reduce((groups: any, roommate: any) => {
        // Normaliser email et nom (minuscules, espaces supprimés)
        const normalizedEmail = (roommate.email || '').toLowerCase().trim();
        const normalizedName = (roommate.name || '').toLowerCase().trim().replace(/\s+/g, ' ');
        const key = `${normalizedEmail}_${normalizedName}`;
        
        if (!groups[key]) groups[key] = [];
        groups[key].push(roommate);
        return groups;
      }, {});

      // Supprimer les doublons (garder le plus récent ou celui avec plus d'infos)
      const duplicatesToDelete = [];
      for (const [key, duplicates] of Object.entries(emailGroups) as [string, any[]][]) {
        if (duplicates.length > 1) {
          console.log(`🗑️ Doublons trouvés pour ${key}:`, duplicates.length);
          console.log('Détails des doublons:', duplicates.map(d => ({
            id: d.docId,
            name: d.name,
            email: d.email,
            property: d.property,
            room: d.room
          })));
          
          // Trier par qualité des données (plus d'infos = meilleur)
          const sortedDuplicates = duplicates.sort((a, b) => {
            const scoreA = (a.name ? 1 : 0) + (a.email ? 1 : 0) + (a.property ? 1 : 0) + (a.room ? 1 : 0) + (a.rentAmount ? 1 : 0);
            const scoreB = (b.name ? 1 : 0) + (b.email ? 1 : 0) + (b.property ? 1 : 0) + (b.room ? 1 : 0) + (b.rentAmount ? 1 : 0);
            return scoreB - scoreA; // Meilleur score en premier
          });
          
          // Garder le premier (meilleur), marquer les autres pour suppression
          duplicatesToDelete.push(...sortedDuplicates.slice(1));
          console.log(`📌 Garder:`, sortedDuplicates[0].name, sortedDuplicates[0].property);
          console.log(`🗑️ Supprimer:`, sortedDuplicates.slice(1).map(d => `${d.name} (${d.property})`));
        }
      }

      // Supprimer les doublons de Firestore
      for (const duplicate of duplicatesToDelete) {
        console.log(`🗑️ Suppression du doublon:`, duplicate.docId, duplicate.name, duplicate.property);
        await deleteDoc(doc(db, 'Rent_colocataires', duplicate.docId));
      }

      if (duplicatesToDelete.length > 0) {
        console.log(`✅ ${duplicatesToDelete.length} doublons supprimés`);
        // Recharger les données après le nettoyage
        await fetchRoommates();
      } else {
        console.log('✅ Aucun doublon trouvé');
      }

      return duplicatesToDelete.length;
    } catch (err) {
      console.error('Error cleaning up duplicates:', err);
      return 0;
    }
  };

  useEffect(() => {
    fetchRoommates();
  }, []);

  return {
    roommates,
    loading,
    error,
    addRoommate,
    updateRoommate,
    deleteRoommate,
    cleanupDuplicates,
    checkRoommateExists,
    refetch: fetchRoommates
  };
};
