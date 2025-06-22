
import { useState, useEffect, useCallback } from 'react';
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

  const checkUserProfile = useCallback(async (currentUser: User | null) => {
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
          permissions: ['dashboard', 'properties', 'tenants', 'contracts', 'inspections', 'rentManagement', 'maintenance', 'messages'],
          hasPassword: true,
          phone: '0123456789',
          company: 'Rostand Immobilier',
          propertyCount: 5,
          activeContracts: 8,
          detailedPermissions: {
            dashboard: { read: true, write: true, view: true, delete: false },
            properties: { read: true, write: true, view: true, delete: true },
            tenants: { read: true, write: true, view: true, delete: true },
            roommates: { read: true, write: true, view: true, delete: true },
            contracts: { read: true, write: true, view: true, delete: true },
            inspections: { read: true, write: true, view: true, delete: true },
            rentManagement: { read: true, write: true, view: true, delete: false },
            rentalCharges: { read: true, write: true, view: true, delete: true },
            maintenance: { read: true, write: true, view: true, delete: true },
            messages: { read: true, write: true, view: true, delete: true },
            taxes: { read: true, write: true, view: true, delete: false },
            website: { read: true, write: false, view: true, delete: false },
            settings: { read: true, write: false, view: true, delete: false },
          }
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

      console.log('❌ Aucun profil trouvé pour:', currentUser.email);
      setUserProfile(null);
      setUserType(null);
    } catch (error) {
      console.error('❌ Erreur lors de la vérification du profil:', error);
      setUserProfile(null);
      setUserType(null);
    }
  }, [hooksInitialized, getUserRole, userRoles, tenants, roommates, dataLoaded]);

  // Marquer les données comme chargées
  useEffect(() => {
    if (!hooksInitialized) return;
    
    const timer = setTimeout(() => {
      console.log('📊 Données Firebase marquées comme chargées');
      setDataLoaded(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, [hooksInitialized]);

  const resetProfile = useCallback(() => {
    setUserProfile(null);
    setUserType(null);
    setDataLoaded(false);
  }, []);

  return {
    userProfile,
    userType,
    checkUserProfile,
    resetProfile
  };
};
