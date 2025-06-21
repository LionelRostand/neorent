import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { useFirebaseTenants } from '@/hooks/useFirebaseTenants';
import { useFirebaseRoommates } from '@/hooks/useFirebaseRoommates';
import { useFirebaseUserRoles } from '@/hooks/useFirebaseUserRoles';

export const useUserProfileManager = (user: User | null, hooksInitialized: boolean) => {
  const [userProfile, setUserProfile] = useState<any | null>(null);
  const [userType, setUserType] = useState<'locataire' | 'colocataire' | 'admin' | 'employee' | null>(null);
  const [dataLoaded, setDataLoaded] = useState(false);
  
  const { tenants } = useFirebaseTenants();
  const { roommates } = useFirebaseRoommates();
  const { getUserRole, userRoles } = useFirebaseUserRoles();

  const checkUserProfile = async (currentUser: User | null) => {
    if (!currentUser || !hooksInitialized) {
      setUserProfile(null);
      setUserType(null);
      return;
    }

    console.log('🔍 Vérification du profil pour:', currentUser.email);

    try {
      // SOLUTION TEMPORAIRE : Créer un profil propriétaire pour lionelrostand@yahoo.fr
      if (currentUser.email === 'lionelrostand@yahoo.fr') {
        console.log('🏠 Création d\'un profil propriétaire pour lionelrostand@yahoo.fr');
        const ownerProfile = {
          id: 'owner-lionel',
          name: 'Lionel Rostand',
          email: 'lionelrostand@yahoo.fr',
          role: 'employee',
          isOwner: true,
          permissions: ['dashboard', 'properties', 'tenants', 'contracts'],
          hasPassword: true,
          phone: '0123456789',
          company: 'Rostand Immobilier',
          propertyCount: 5,
          activeContracts: 8
        };
        
        setUserProfile(ownerProfile);
        setUserType('employee');
        return;
      }

      // Chercher d'abord par UID dans user_roles
      let userRole = await getUserRole(currentUser.uid);
      
      // Si pas trouvé par UID, chercher par email
      if (!userRole && userRoles.length > 0) {
        console.log('🔍 Recherche par email dans user_roles...');
        userRole = userRoles.find(role => role.email === currentUser.email);
        console.log('📧 Résultat recherche par email:', userRole);
      }
      
      if (userRole) {
        console.log('👤 Profil admin/employé trouvé:', userRole);
        setUserProfile({
          id: userRole.id,
          name: userRole.name,
          email: userRole.email,
          role: userRole.role,
          permissions: userRole.permissions || [],
          hasPassword: userRole.hasPassword || false,
          isOwner: userRole.isOwner || false
        });
        setUserType(userRole.role);
        return;
      }

      // Attendre que les données tenants/roommates soient chargées
      if (!dataLoaded) {
        console.log('⏳ Données pas encore chargées, attente...');
        return;
      }

      // Chercher dans les locataires
      const tenantProfile = tenants.find(t => t.email === currentUser.email);
      if (tenantProfile) {
        console.log('🏠 Profil locataire trouvé:', tenantProfile);
        setUserProfile(tenantProfile);
        setUserType('locataire');
        return;
      }

      // Chercher dans les colocataires
      const roommateProfile = roommates.find(r => r.email === currentUser.email);
      if (roommateProfile) {
        console.log('👥 Profil colocataire trouvé:', roommateProfile);
        setUserProfile(roommateProfile);
        setUserType('colocataire');
        return;
      }

      // Si aucun profil trouvé
      console.log('❌ Aucun profil trouvé pour:', currentUser.email);
      console.log('📊 Données disponibles:', { 
        userRoles: userRoles.length, 
        tenants: tenants.length, 
        roommates: roommates.length 
      });
      
      // Ne pas définir comme null immédiatement pour les comptes en attente
      setUserProfile(null);
      setUserType(null);
    } catch (error) {
      console.error('❌ Erreur lors de la vérification du profil:', error);
      setUserProfile(null);
      setUserType(null);
    }
  };

  // Marquer les données comme chargées et vérifier le profil
  useEffect(() => {
    if (!hooksInitialized) return;
    
    if (!dataLoaded) {
      const timer = setTimeout(() => {
        console.log('📊 Données Firebase marquées comme chargées:', { 
          tenants: tenants.length, 
          roommates: roommates.length,
          userRoles: userRoles.length 
        });
        setDataLoaded(true);
        
        if (user && !userProfile) {
          console.log('🔄 Re-vérification du profil avec données disponibles...');
          checkUserProfile(user);
        }
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [tenants, roommates, userRoles, user, userProfile, dataLoaded, hooksInitialized]);

  // Re-vérifier le profil quand les données changent
  useEffect(() => {
    if (dataLoaded && user && !userProfile && hooksInitialized) {
      console.log('🔄 Nouvelles données disponibles, re-vérification du profil...');
      checkUserProfile(user);
    }
  }, [tenants, roommates, userRoles, dataLoaded, user, userProfile, hooksInitialized]);

  const resetProfile = () => {
    setUserProfile(null);
    setUserType(null);
    setDataLoaded(false);
  };

  return {
    userProfile,
    userType,
    checkUserProfile,
    resetProfile
  };
};
