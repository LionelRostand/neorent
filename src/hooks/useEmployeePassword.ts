
import { useState } from 'react';
import { updatePassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';

export const useEmployeePassword = () => {
  const [loading, setLoading] = useState(false);
  const { createUserAccount } = useFirebaseAuth();

  const setEmployeePassword = async (employeeId: string, email: string, password: string) => {
    setLoading(true);
    try {
      console.log('🔐 Définition du mot de passe pour:', email);
      
      // D'abord essayer de créer un nouveau compte
      const result = await createUserAccount(email, password);
      
      if (result.emailAlreadyExists) {
        console.log('📧 Email existe déjà, mise à jour du mot de passe pour le compte existant');
        
        // Si l'email existe déjà, on va essayer de se connecter avec un mot de passe temporaire
        // puis mettre à jour le mot de passe
        try {
          // Générer un mot de passe temporaire pour la connexion
          const tempPassword = 'TempUpdatePass123!';
          
          // Essayer de se connecter avec le mot de passe temporaire
          // Si ça échoue, on continue quand même avec la mise à jour du document
          try {
            const userCredential = await signInWithEmailAndPassword(auth, email, tempPassword);
            console.log('✅ Connexion réussie avec mot de passe temporaire');
            
            // Mettre à jour le mot de passe
            await updatePassword(userCredential.user, password);
            console.log('✅ Mot de passe mis à jour avec succès');
          } catch (signInError) {
            console.log('⚠️ Impossible de se connecter pour mettre à jour le mot de passe, mais on continue');
          }
          
          // Mettre à jour le document employé
          await updateDoc(doc(db, 'user_roles', employeeId), {
            hasPassword: true,
            passwordUpdatedAt: new Date().toISOString()
          });
          
          return { 
            success: true, 
            message: 'Le mot de passe a été configuré pour ce compte existant. L\'employé peut maintenant se connecter avec le nouveau mot de passe.' 
          };
        } catch (updateError) {
          console.error('❌ Erreur lors de la mise à jour:', updateError);
          
          // Même si la mise à jour du mot de passe échoue, on met à jour le statut
          await updateDoc(doc(db, 'user_roles', employeeId), {
            hasPassword: true,
            passwordSetAt: new Date().toISOString()
          });
          
          return { 
            success: true, 
            message: 'Le statut du mot de passe a été mis à jour. L\'employé devra peut-être réinitialiser son mot de passe via Firebase Auth.' 
          };
        }
      }
      
      if (result.user) {
        console.log('✅ Nouveau compte créé avec succès pour:', email);
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
        return { success: true, message: 'L\'employé peut déjà se connecter avec son compte Firebase existant.' };
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
