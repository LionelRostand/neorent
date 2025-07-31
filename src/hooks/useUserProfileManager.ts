
import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  type: 'admin' | 'owner' | 'locataire' | 'colocataire';
}

export const useUserProfileManager = (user: User | null) => {
  const [selectedProfile, setSelectedProfile] = useState<UserProfile | null>(null);
  const [userType, setUserType] = useState<'admin' | 'owner' | 'locataire' | 'colocataire'>('locataire');

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        console.log('🔄 useUserProfileManager - User changed:', user?.email);
        
        // Clear any old data first
        sessionStorage.removeItem('adminSelectedProfile');
        
        if (!user) {
          setSelectedProfile(null);
          setUserType('locataire');
          return;
        }
        
        // Check if admin is impersonating
        const adminProfile = sessionStorage.getItem('adminSelectedProfile');
        console.log('🔍 Admin profile in storage:', adminProfile);
        if (adminProfile) {
          try {
            const profile = JSON.parse(adminProfile);
            console.log('👤 Admin impersonation detected:', profile);
            setSelectedProfile(profile);
            // Map owner role to owner type for consistency
            const mappedType = profile.role === 'owner' ? 'owner' : profile.type;
            setUserType(mappedType);
            return; // Exit early for admin impersonation
          } catch (error) {
            console.error('Error parsing admin profile:', error);
            sessionStorage.removeItem('adminSelectedProfile');
          }
        }
        
        // Regular user profile - check specific cases
        const isAdmin = user.email === 'admin@neotech-consulting.com';
        const isEmadAdam = user.email === 'entrepreneurpro19@gmail.com';
        const isRuthMegha = user.email === 'ruthmegha35@gmail.com';
        const isRostandOwner = user.email === 'rostandlionel@yahoo.fr';
        
        console.log('🔍 User type checks:', { isAdmin, isEmadAdam, isRuthMegha, isRostandOwner, email: user.email });
        
        let profile: UserProfile;
        
        if (isAdmin) {
          profile = {
            id: user.uid,
            name: 'Lionel DJOSSA',
            email: user.email || '',
            role: 'admin',
            type: 'admin' as const
          };
        } else if (isEmadAdam) {
          // Profile spécifique pour Emad ADAM
          profile = {
            id: '1752971742586',
            name: 'Emad ADAM',
            email: user.email || '',
            role: 'colocataire',
            type: 'colocataire' as const
          };
          console.log('✅ Profile Emad ADAM créé:', profile);
        } else if (isRuthMegha) {
          // Profile spécifique pour Ruth MEGHA
          profile = {
            id: '1752971742587',
            name: 'Ruth MEGHA',
            email: user.email || '',
            role: 'colocataire',
            type: 'colocataire' as const
          };
          console.log('✅ Profile Ruth MEGHA créé:', profile);
        } else if (isRostandOwner) {
          // Profile spécifique pour ROSTAND comme propriétaire
          profile = {
            id: user.uid,
            name: 'ROSTAND',
            email: user.email || '',
            role: 'owner',
            type: 'owner' as const
          };
          console.log('✅ Profile ROSTAND (propriétaire) créé:', profile);
        } else {
          // Pour les autres utilisateurs, récupérer le profil depuis Firebase
          try {
            // Chercher d'abord par firebaseUid
            let userDoc = await getDoc(doc(db, 'user_roles', user.uid));
            let userData = null;
            let docId = user.uid;
            
            if (userDoc.exists()) {
              userData = userDoc.data();
              console.log('📊 User data found by UID:', userData);
            } else {
              // Si pas trouvé par UID, chercher par email dans toute la collection
              const q = query(collection(db, 'user_roles'), where('email', '==', user.email));
              const querySnapshot = await getDocs(q);
              
              if (!querySnapshot.empty) {
                userDoc = querySnapshot.docs[0];
                userData = userDoc.data();
                docId = userDoc.id;
                console.log('📊 User data found by email:', userData);
                
                // Si trouvé par email mais pas par UID, mettre à jour le document avec le bon UID
                if (docId !== user.uid && userData.firebaseUid !== user.uid) {
                  console.log('🔄 Updating firebaseUid for user:', user.email);
                  const { updateDoc } = await import('firebase/firestore');
                  await updateDoc(doc(db, 'user_roles', docId), {
                    firebaseUid: user.uid
                  });
                }
              }
            }
            
            if (userData) {
              // Déterminer le type d'utilisateur - priorité aux champs owner
              let determinedUserType: 'admin' | 'owner' | 'locataire' | 'colocataire' = 'locataire';
              
              if (userData.role === 'owner' || userData.userType === 'owner' || userData.type === 'owner' || userData.isOwner || userData.isPropertyOwner) {
                determinedUserType = 'owner';
              } else if (userData.role === 'colocataire' || userData.userType === 'colocataire' || userData.type === 'colocataire') {
                determinedUserType = 'colocataire';
              }
              
              profile = {
                id: docId,
                name: userData.name || user.displayName || user.email || '',
                email: userData.email || user.email || '',
                role: userData.role || (determinedUserType === 'owner' ? 'owner' : 'locataire'),
                type: determinedUserType
              };
              
              console.log('✅ Profile loaded from Firebase:', profile);
              console.log('✅ Determined user type:', determinedUserType);
            } else {
              // Si aucun profil trouvé, créer un profil par défaut
              profile = {
                id: user.uid,
                name: user.displayName || user.email || '',
                email: user.email || '',
                role: 'locataire',
                type: 'locataire' as const
              };
              console.log('⚠️ Aucun profil trouvé, profil par défaut créé:', profile);
            }
          } catch (error) {
            console.error('❌ Erreur lors de la récupération du profil:', error);
            // Fallback vers le profil par défaut en cas d'erreur
            profile = {
              id: user.uid,
              name: user.displayName || user.email || '',
              email: user.email || '',
              role: 'locataire',
              type: 'locataire' as const
            };
          }
        }
        
        setSelectedProfile(profile);
        setUserType(profile.type);
        
        console.log('🔄 Setting user profile for:', user.email, profile);
        console.log('🔄 Setting user type:', profile.type);
      } catch (error) {
        console.error('❌ Critical error in useUserProfileManager:', error);
        // Fallback pour éviter que l'app plante
        if (user) {
          const fallbackProfile = {
            id: user.uid,
            name: user.displayName || user.email || '',
            email: user.email || '',
            role: 'locataire',
            type: 'locataire' as const
          };
          setSelectedProfile(fallbackProfile);
          setUserType('locataire');
        } else {
          setSelectedProfile(null);
          setUserType('locataire');
        }
      }
    };

    loadUserProfile();
  }, [user]);

  const clearAdminImpersonation = () => {
    sessionStorage.removeItem('adminSelectedProfile');
    window.location.reload();
  };

  const setAdminImpersonation = (profile: UserProfile) => {
    sessionStorage.setItem('adminSelectedProfile', JSON.stringify(profile));
  };

  return {
    selectedProfile,
    userType,
    setUserType,
    clearAdminImpersonation,
    setAdminImpersonation
  };
};
