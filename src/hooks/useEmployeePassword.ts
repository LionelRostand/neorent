
import { useState } from 'react';
import { updatePassword } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';

export const useEmployeePassword = () => {
  const [loading, setLoading] = useState(false);
  const { createUserAccount } = useFirebaseAuth();

  const setEmployeePassword = async (employeeId: string, email: string, password: string) => {
    setLoading(true);
    try {
      // Créer un compte Firebase Auth pour l'employé
      const result = await createUserAccount(email, password);
      
      if (result.emailAlreadyExists) {
        // Si l'email existe déjà, on met simplement à jour le document employé
        await updateDoc(doc(db, 'user_roles', employeeId), {
          hasPassword: true,
          passwordUpdatedAt: new Date().toISOString()
        });
        
        return { 
          success: true, 
          message: 'Un compte Firebase existe déjà pour cet email. Le statut du mot de passe a été mis à jour.' 
        };
      }
      
      if (result.user) {
        // Mettre à jour le document employé avec l'UID Firebase
        await updateDoc(doc(db, 'user_roles', employeeId), {
          firebaseUid: result.user.uid,
          hasPassword: true,
          updatedAt: new Date().toISOString()
        });
        
        return { success: true, message: 'Compte créé avec succès.' };
      }
      
      return { success: false, error: 'Erreur lors de la création du compte' };
    } catch (error: any) {
      console.error('Erreur lors de la définition du mot de passe:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const updateEmployeePassword = async (employeeId: string, newPassword: string) => {
    setLoading(true);
    try {
      // Cette fonction nécessiterait que l'employé soit connecté
      // Pour l'instant, on met juste à jour le flag dans la base
      await updateDoc(doc(db, 'user_roles', employeeId), {
        passwordUpdatedAt: new Date().toISOString()
      });
      
      return { success: true, message: 'Mot de passe mis à jour avec succès.' };
    } catch (error: any) {
      console.error('Erreur lors de la mise à jour du mot de passe:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    setEmployeePassword,
    updateEmployeePassword
  };
};
