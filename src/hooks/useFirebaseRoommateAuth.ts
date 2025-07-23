
import { useState, useEffect } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { useFirebaseAuth } from './useFirebaseAuth';

interface RoommateAuthData {
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
  userType: 'colocataire';
}

export const useFirebaseRoommateAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { createUserAccount } = useFirebaseAuth();

  const createRoommateAuthAccount = async (roommateData: Omit<RoommateAuthData, 'userType'>, password: string) => {
    try {
      setLoading(true);
      setError(null);

      console.log('Creating Firebase Auth account for roommate:', roommateData.email);

      // Créer le compte Firebase Auth
      const authResult = await createUserAccount(roommateData.email, password);
      
      if (authResult.user) {
        // Créer le profil colocataire dans Firestore
        const roommateProfile: RoommateAuthData = {
          ...roommateData,
          userType: 'colocataire'
        };

        // Sauvegarder dans la collection des profils utilisateurs
        await setDoc(doc(db, 'user_profiles', authResult.user.uid), roommateProfile);
        
        console.log('✅ Profil utilisateur créé, SKIP création dans Rent_colocataires (géré par useRoommateRegistration)');

        console.log('Roommate auth account created successfully:', authResult.user.uid);
        return { success: true, user: authResult.user, emailAlreadyExists: false };
      } else if (authResult.emailAlreadyExists) {
        console.log('Email already exists, but saving roommate data');
        
        // L'email existe déjà, vérifier si les données existent aussi
        const roommateProfile: RoommateAuthData = {
          ...roommateData,
          userType: 'colocataire'
        };

        console.log('✅ Email existe déjà, SKIP création dans Rent_colocataires (géré par useRoommateRegistration)');
        
        return { success: true, user: null, emailAlreadyExists: true };
      }

      return { success: false, user: null, emailAlreadyExists: false };
    } catch (err) {
      console.error('Error creating roommate auth account:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors de la création du compte');
      return { success: false, user: null, emailAlreadyExists: false };
    } finally {
      setLoading(false);
    }
  };

  const getRoommateProfile = async (userId: string): Promise<RoommateAuthData | null> => {
    try {
      const profileDoc = await getDoc(doc(db, 'user_profiles', userId));
      if (profileDoc.exists() && profileDoc.data().userType === 'colocataire') {
        return profileDoc.data() as RoommateAuthData;
      }
      return null;
    } catch (err) {
      console.error('Error fetching roommate profile:', err);
      return null;
    }
  };

  const updateRoommateProfile = async (userId: string, updates: Partial<RoommateAuthData>) => {
    try {
      await setDoc(doc(db, 'user_profiles', userId), updates, { merge: true });
      await setDoc(doc(db, 'Rent_colocataires', updates.id || userId), updates, { merge: true });
      return true;
    } catch (err) {
      console.error('Error updating roommate profile:', err);
      return false;
    }
  };

  const updateRoommateWithAuth = async (roommateId: string, roommateData: Omit<RoommateAuthData, 'userType'>, password?: string) => {
    try {
      setLoading(true);
      setError(null);

      console.log('Updating roommate data for:', roommateData.email);

      const roommateProfile: RoommateAuthData = {
        ...roommateData,
        userType: 'colocataire'
      };

      // Mettre à jour dans la collection des colocataires
      await setDoc(doc(db, 'Rent_colocataires', roommateId), roommateProfile, { merge: true });

      // Si un mot de passe est fourni, essayer de créer le compte Firebase Auth
      if (password && password.length >= 6) {
        console.log('Attempting to create Firebase Auth account for:', roommateData.email);
        
        try {
          const authResult = await createUserAccount(roommateData.email, password);
          
          if (authResult.user) {
            // Mettre à jour le profil utilisateur avec l'UID Firebase
            await setDoc(doc(db, 'user_profiles', authResult.user.uid), roommateProfile);
            console.log('Firebase Auth account created and profile updated');
            return { success: true, authCreated: true, emailAlreadyExists: false };
          }
        } catch (authError: any) {
          // Si l'email existe déjà, c'est OK, on continue sans erreur
          if (authError.code === 'auth/email-already-in-use') {
            console.log('Email already exists in Firebase Auth, continuing with data update only');
            return { success: true, authCreated: false, emailAlreadyExists: true };
          }
          // Pour les autres erreurs d'auth, on continue mais on log l'erreur
          console.warn('Firebase Auth error (continuing with data update):', authError);
          return { success: true, authCreated: false, emailAlreadyExists: false };
        }
      }

      console.log('Roommate data updated successfully (no auth update)');
      return { success: true, authCreated: false, emailAlreadyExists: false };
    } catch (err) {
      console.error('Error updating roommate:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour du colocataire');
      return { success: false, authCreated: false, emailAlreadyExists: false };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    createRoommateAuthAccount,
    getRoommateProfile,
    updateRoommateProfile,
    updateRoommateWithAuth,
    setError
  };
};
