
import { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';
import { useToast } from '@/hooks/use-toast';

interface OwnerRegistrationRequest {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  address?: string;
  message?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  type: 'owner_registration';
}

export const useOwnerRegistrations = () => {
  const [requests, setRequests] = useState<OwnerRegistrationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const { createUserAccount } = useFirebaseAuth();
  const { toast } = useToast();

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, 'owner_registration_requests'));
      const requestsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as OwnerRegistrationRequest[];
      
      setRequests(requestsData.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ));
    } catch (error) {
      console.error('Error fetching registration requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const approveRequest = async (request: OwnerRegistrationRequest) => {
    try {
      // Vérifier d'abord si un profil utilisateur existe déjà
      const userRolesSnapshot = await getDocs(collection(db, 'user_roles'));
      const existingUser = userRolesSnapshot.docs.find(doc => 
        doc.data().email === request.email
      );

      if (existingUser) {
        // Si un profil existe déjà, on met simplement à jour ses informations
        const userData = existingUser.data();
        const updatedProfile = {
          ...userData,
          role: 'employee' as const,
          name: request.name,
          phone: request.phone || userData.phone || '',
          company: request.company || userData.company || '',
          address: request.address || userData.address || '',
          isOwner: true,
          updatedAt: new Date().toISOString()
        };

        await updateDoc(doc(db, 'user_roles', existingUser.id), updatedProfile);

        // Mettre à jour le statut de la demande
        await updateDoc(doc(db, 'owner_registration_requests', request.id), {
          status: 'approved',
          approvedAt: new Date().toISOString(),
          note: 'Compte existant mis à jour'
        });

        toast({
          title: "Demande approuvée",
          description: `Le profil de ${request.name} a été mis à jour. Le compte existant peut maintenant accéder à l'espace propriétaire.`,
        });

        fetchRequests();
        return;
      }

      // Si aucun profil n'existe, créer un nouveau compte
      const tempPassword = `Owner${Math.random().toString(36).substring(2, 10)}!`;
      
      const result = await createUserAccount(request.email, tempPassword);
      
      if (result.emailAlreadyExists) {
        // Si le compte Firebase existe mais pas le profil Firestore, créer le profil
        toast({
          title: "Information",
          description: "Un compte Firebase existe déjà. Création du profil propriétaire...",
        });

        // Créer le profil propriétaire même si le compte Firebase existe
        const ownerProfile = {
          role: 'employee' as const,
          email: request.email,
          name: request.name,
          createdAt: new Date().toISOString(),
          permissions: ['read'],
          hasPassword: true,
          isOwner: true,
          phone: request.phone || '',
          company: request.company || '',
          address: request.address || '',
          note: 'Profil créé pour compte Firebase existant'
        };

        // Utiliser l'email comme ID temporaire (à remplacer par l'UID si nécessaire)
        const profileId = `profile_${Date.now()}_${request.email.replace(/[^a-zA-Z0-9]/g, '_')}`;
        await setDoc(doc(db, 'user_roles', profileId), ownerProfile);

        await updateDoc(doc(db, 'owner_registration_requests', request.id), {
          status: 'approved',
          approvedAt: new Date().toISOString(),
          note: 'Profil créé pour compte existant'
        });

        toast({
          title: "Profil créé",
          description: `Le profil propriétaire de ${request.name} a été créé. L'utilisateur peut maintenant se connecter avec son mot de passe existant.`,
        });

        fetchRequests();
        return;
      }

      if (!result.user) {
        throw new Error('Échec de la création du compte');
      }

      // Créer le profil propriétaire avec le nouvel UID
      const ownerProfile = {
        role: 'employee' as const,
        email: request.email,
        name: request.name,
        createdAt: new Date().toISOString(),
        permissions: ['read'],
        hasPassword: true,
        isOwner: true,
        phone: request.phone || '',
        company: request.company || '',
        address: request.address || '',
        tempPassword: tempPassword
      };

      await setDoc(doc(db, 'user_roles', result.user.uid), ownerProfile);

      // Mettre à jour le statut de la demande
      await updateDoc(doc(db, 'owner_registration_requests', request.id), {
        status: 'approved',
        approvedAt: new Date().toISOString(),
        tempPassword: tempPassword
      });

      toast({
        title: "Compte approuvé",
        description: `Le compte de ${request.name} a été créé. Mot de passe temporaire: ${tempPassword}`,
      });

      fetchRequests();
    } catch (error) {
      console.error('Error approving request:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'approbation du compte.",
        variant: "destructive",
      });
    }
  };

  const rejectRequest = async (requestId: string) => {
    try {
      await updateDoc(doc(db, 'owner_registration_requests', requestId), {
        status: 'rejected',
        rejectedAt: new Date().toISOString()
      });

      toast({
        title: "Demande rejetée",
        description: "La demande a été rejetée.",
      });

      fetchRequests();
    } catch (error) {
      console.error('Error rejecting request:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors du rejet de la demande.",
        variant: "destructive",
      });
    }
  };

  const deleteRequest = async (requestId: string) => {
    try {
      await deleteDoc(doc(db, 'owner_registration_requests', requestId));
      toast({
        title: "Demande supprimée",
        description: "La demande a été supprimée.",
      });
      fetchRequests();
    } catch (error) {
      console.error('Error deleting request:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return {
    requests,
    loading,
    approveRequest,
    rejectRequest,
    deleteRequest,
    refetch: fetchRequests
  };
};
