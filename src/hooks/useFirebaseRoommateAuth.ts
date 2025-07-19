
import { useState, useEffect } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
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
        
        // Sauvegarder aussi dans la collection des colocataires pour la gestion admin
        await setDoc(doc(db, 'Rent_colocataires', roommateData.id), roommateProfile);

        console.log('Roommate auth account created successfully:', authResult.user.uid);
        return { success: true, user: authResult.user, emailAlreadyExists: false };
      } else if (authResult.emailAlreadyExists) {
        console.log('Email already exists, but saving roommate data');
        
        // L'email existe déjà, mais on peut quand même sauvegarder les données
        const roommateProfile: RoommateAuthData = {
          ...roommateData,
          userType: 'colocataire'
        };

        await setDoc(doc(db, 'Rent_colocataires', roommateData.id), roommateProfile);
        
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

  return {
    loading,
    error,
    createRoommateAuthAccount,
    getRoommateProfile,
    updateRoommateProfile,
    setError
  };
};
