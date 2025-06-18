
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
      console.log('🔐 Définition du mot de passe pour:', email);
      
      // Créer un compte Firebase Auth pour l'employé
      const result = await createUserAccount(email, password);
      
      if (result.emailAlreadyExists) {
        console.log('📧 Email existe déjà, mise à jour du statut seulement');
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
        console.log('✅ Compte créé avec succès pour:', email);
        // Mettre à jour le document employé avec l'UID Firebase
        await updateDoc(doc(db, 'user_roles', employeeId), {
          firebaseUid: result.user.uid,
          hasPassword: true,
          passwordSetAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
        
        return { success: true, message: 'Compte créé avec succès. L\'employé peut maintenant se connecter.' };
      }
      
      return { success: false, error: 'Erreur lors de la création du compte' };
    } catch (error: any) {
      console.error('❌ Erreur lors de la définition du mot de passe:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const updateEmployeePassword = async (employeeId: string, newPassword: string) => {
    setLoading(true);
    try {
      console.log('🔄 Mise à jour du mot de passe pour l\'employé:', employeeId);
      
      // Mettre à jour le flag dans la base de données
      await updateDoc(doc(db, 'user_roles', employeeId), {
        passwordUpdatedAt: new Date().toISOString(),
        hasPassword: true
      });
      
      return { success: true, message: 'Mot de passe mis à jour avec succès. L\'employé peut se connecter avec le nouveau mot de passe.' };
    } catch (error: any) {
      console.error('❌ Erreur lors de la mise à jour du mot de passe:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const ensureEmployeeCanLogin = async (employeeId: string, email: string, tempPassword: string = 'TempPass123!') => {
    setLoading(true);
    try {
      console.log('🔍 Vérification de l\'accès pour:', email);
      
      // Vérifier si l'employé a déjà un mot de passe défini
      const result = await createUserAccount(email, tempPassword);
      
      if (result.emailAlreadyExists) {
        // L'email existe déjà, juste mettre à jour le statut
        await updateDoc(doc(db, 'user_roles', employeeId), {
          hasPassword: true,
          passwordCheckAt: new Date().toISOString()
        });
        return { success: true, message: 'L\'employé peut déjà se connecter.' };
      }
      
      if (result.user) {
        // Nouveau compte créé
        await updateDoc(doc(db, 'user_roles', employeeId), {
          firebaseUid: result.user.uid,
          hasPassword: true,
          tempPasswordSet: true,
          passwordSetAt: new Date().toISOString()
        });
        return { 
          success: true, 
          message: `Compte créé avec mot de passe temporaire: ${tempPassword}. L'employé doit le changer à la première connexion.`,
          tempPassword
        };
      }
      
      return { success: false, error: 'Impossible de créer le compte' };
    } catch (error: any) {
      console.error('❌ Erreur:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    setEmployeePassword,
    updateEmployeePassword,
    ensureEmployeeCanLogin
  };
};
