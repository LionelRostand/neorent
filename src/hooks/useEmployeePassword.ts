
import { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';

export const useEmployeePassword = () => {
  const [loading, setLoading] = useState(false);
  const { createUserAccount } = useFirebaseAuth();

  const setEmployeePassword = async (employeeId: string, email: string, password: string) => {
    setLoading(true);
    try {
      console.log('🔐 Configuration du compte pour:', email);
      
      // D'abord essayer de créer un nouveau compte
      const result = await createUserAccount(email, password);
      
      if (result.emailAlreadyExists) {
        console.log('📧 Email existe déjà, envoi d\'un email de réinitialisation');
        
        try {
          // Envoyer un email de réinitialisation de mot de passe
          await sendPasswordResetEmail(auth, email);
          console.log('✅ Email de réinitialisation envoyé avec succès');
          
          // Mettre à jour le document employé
          await updateDoc(doc(db, 'user_roles', employeeId), {
            hasPassword: true,
            passwordResetSent: true,
            passwordResetSentAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          });
          
          return { 
            success: true, 
            message: `Un email de réinitialisation de mot de passe a été envoyé à ${email}. Le propriétaire peut maintenant définir son nouveau mot de passe en cliquant sur le lien dans l'email.`,
            resetEmailSent: true
          };
        } catch (resetError: any) {
          console.error('❌ Erreur lors de l\'envoi de l\'email de réinitialisation:', resetError);
          
          // Même si l'envoi échoue, on met à jour le statut
          await updateDoc(doc(db, 'user_roles', employeeId), {
            hasPassword: false,
            passwordResetAttempted: true,
            passwordResetError: resetError.message,
            updatedAt: new Date().toISOString()
          });
          
          return { 
            success: false, 
            error: `Impossible d'envoyer l'email de réinitialisation: ${resetError.message}. Veuillez vérifier que l'adresse email est correcte.`
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
        
        return { success: true, message: 'Compte créé avec succès. Le propriétaire peut maintenant se connecter.' };
      }
      
      return { success: false, error: 'Erreur lors de la création du compte' };
    } catch (error: any) {
      console.error('❌ Erreur lors de la configuration du compte:', error);
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

  const sendPasswordReset = async (email: string) => {
    setLoading(true);
    try {
      console.log('📧 Envoi d\'un email de réinitialisation pour:', email);
      
      await sendPasswordResetEmail(auth, email);
      
      return { 
        success: true, 
        message: `Un email de réinitialisation de mot de passe a été envoyé à ${email}.`
      };
    } catch (error: any) {
      console.error('❌ Erreur lors de l\'envoi de l\'email:', error);
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
        // L'email existe déjà, envoyer un email de réinitialisation
        await sendPasswordResetEmail(auth, email);
        await updateDoc(doc(db, 'user_roles', employeeId), {
          hasPassword: true,
          passwordResetSent: true,
          passwordCheckAt: new Date().toISOString()
        });
        return { 
          success: true, 
          message: 'Un email de réinitialisation a été envoyé au propriétaire pour qu\'il puisse définir son mot de passe.',
          resetEmailSent: true
        };
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
          message: `Compte créé avec mot de passe temporaire: ${tempPassword}. Le propriétaire doit le changer à la première connexion.`,
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
    sendPasswordReset,
    ensureEmployeeCanLogin
  };
};
