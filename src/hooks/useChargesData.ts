
import { useFirebaseCharges } from './useFirebaseCharges';

// Réexporte les fonctionnalités de useFirebaseCharges pour maintenir la compatibilité
export const useChargesData = () => {
  const { charges, addCharge, deleteCharge, loading, error } = useFirebaseCharges();
  
  return {
    charges,
    addCharge,
    deleteCharge,
    loading,
    error
  };
};
