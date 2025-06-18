
import { useState } from 'react';

interface TenantData {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  leaseStart: string;
  leaseEnd: string;
  status: string;
  type: 'Colocataire' | 'Locataire';
  emergencyContact: {
    name: string;
    phone: string;
    relation: string;
  };
}

interface ProfileUpdateData {
  phone?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relation: string;
  };
}

export const useTenantProfileUpdate = () => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  const updateProfile = async (tenantId: number, updates: ProfileUpdateData): Promise<boolean> => {
    setIsUpdating(true);
    setUpdateError(null);
    
    try {
      // Simuler une requête API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Log pour le debug
      console.log('Mise à jour du profil:', { tenantId, updates });
      
      // Simuler une réussite (dans un vrai projet, ici on ferait un appel API)
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 3000);
      
      return true;
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      setUpdateError('Erreur lors de la mise à jour du profil');
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    updateProfile,
    isUpdating,
    updateSuccess,
    updateError,
    clearError: () => setUpdateError(null)
  };
};
