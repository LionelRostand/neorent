
import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface ChargeData {
  id: string;
  propertyName: string;
  propertyType: string;
  month: string;
  electricity: number;
  water: number;
  heating: number;
  maintenance: number;
  insurance: number;
  garbage: number;
  internet: number;
  taxeHabitation: number; // Nouvelle charge - Taxe d'habitation (gérée par les locataires)
  taxeFonciere: number;   // Nouvelle charge - Taxe foncière
  total: number;
  tenant: string;
}

export const useFirebaseCharges = () => {
  const [charges, setCharges] = useState<ChargeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCharges = async () => {
    try {
      setLoading(true);
      console.log('🔍 Tentative de récupération des charges depuis Firebase...');
      const querySnapshot = await getDocs(collection(db, 'Rent_Charges'));
      console.log('📊 Snapshot reçu, nombre de documents:', querySnapshot.size);
      
      const chargesData = querySnapshot.docs.map(doc => {
        const data = { id: doc.id, ...doc.data() };
        console.log('📄 Document charge:', data);
        return data;
      }) as ChargeData[];
      
      console.log('💾 Charges finales récupérées:', chargesData);
      setCharges(chargesData);
      setError(null);
    } catch (err) {
      console.error('❌ Erreur lors de la récupération des charges:', err);
      setError('Erreur lors du chargement des charges');
    } finally {
      setLoading(false);
    }
  };

  const addCharge = async (chargeData: Omit<ChargeData, 'id'>) => {
    try {
      console.log('🔍 Tentative d\'ajout de charge:', chargeData);
      
      // Vérifier que toutes les données requises sont présentes
      if (!chargeData.propertyName || !chargeData.month) {
        throw new Error('Propriété et mois requis');
      }
      
      // Retirer le champ id s'il existe et s'assurer que les champs numériques sont bien des nombres
      const { id, ...dataWithoutId } = chargeData as any;
      const sanitizedData = {
        ...dataWithoutId,
        electricity: Number(chargeData.electricity) || 0,
        water: Number(chargeData.water) || 0,
        heating: Number(chargeData.heating) || 0,
        maintenance: Number(chargeData.maintenance) || 0,
        insurance: Number(chargeData.insurance) || 0,
        garbage: Number(chargeData.garbage) || 0,
        internet: Number(chargeData.internet) || 0,
        taxeHabitation: Number(chargeData.taxeHabitation) || 0,
        taxeFonciere: Number(chargeData.taxeFonciere) || 0,
        total: Number(chargeData.total) || 0,
        createdAt: new Date().toISOString()
      };
      
      // Supprimer tous les champs undefined
      Object.keys(sanitizedData).forEach(key => {
        if (sanitizedData[key] === undefined) {
          delete sanitizedData[key];
        }
      });
      
      console.log('📊 Données sanitisées:', sanitizedData);
      
      const docRef = await addDoc(collection(db, 'Rent_Charges'), sanitizedData);
      console.log('✅ Charge ajoutée avec succès, ID:', docRef.id);
      
      const newCharge = { id: docRef.id, ...sanitizedData };
      setCharges(prev => [...prev, newCharge]);
      setError(null);
      return newCharge;
    } catch (err) {
      console.error('❌ Erreur détaillée lors de l\'ajout de la charge:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de l\'ajout de la charge';
      setError(errorMessage);
      throw err;
    }
  };

  const updateCharge = async (id: string, updates: Partial<ChargeData>) => {
    try {
      await updateDoc(doc(db, 'Rent_Charges', id), updates);
      setCharges(prev => prev.map(charge => 
        charge.id === id ? { ...charge, ...updates } : charge
      ));
    } catch (err) {
      console.error('Error updating charge:', err);
      setError('Erreur lors de la mise à jour de la charge');
      throw err;
    }
  };

  const deleteCharge = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'Rent_Charges', id));
      setCharges(prev => prev.filter(charge => charge.id !== id));
    } catch (err) {
      console.error('Error deleting charge:', err);
      setError('Erreur lors de la suppression de la charge');
      throw err;
    }
  };

  useEffect(() => {
    fetchCharges();
  }, []);

  return {
    charges,
    loading,
    error,
    addCharge,
    updateCharge,
    deleteCharge,
    refetch: fetchCharges
  };
};
