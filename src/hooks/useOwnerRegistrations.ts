
import { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
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
      // Vérifier si un profil utilisateur existe déjà
      const userRolesSnapshot = await getDocs(collection(db, 'user_roles'));
      const existingUser = userRolesSnapshot.docs.find(doc => 
        doc.data().email === request.email
      );

      if (existingUser) {
        // Mettre à jour le profil existant
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

        toast({
          title: "Demande approuvée",
          description: `Le profil de ${request.name} a été mis à jour et apparaît maintenant dans l'onglet Propriétaires.`,
        });
      } else {
        // Créer un nouveau profil propriétaire
        const ownerId = `owner_${Date.now()}_${request.email.replace(/[^a-zA-Z0-9]/g, '_')}`;
        const ownerProfile = {
          role: 'employee' as const,
          email: request.email,
          name: request.name,
          createdAt: new Date().toISOString(),
          permissions: ['read'],
          hasPassword: false, // L'admin pourra définir le mot de passe
          isOwner: true,
          phone: request.phone || '',
          company: request.company || '',
          address: request.address || '',
          fromRegistrationRequest: true
        };

        await setDoc(doc(db, 'user_roles', ownerId), ownerProfile);

        toast({
          title: "Demande approuvée",
          description: `Le profil de ${request.name} a été créé et apparaît maintenant dans l'onglet Propriétaires. Vous pouvez maintenant lui attribuer un mot de passe.`,
        });
      }

      // Mettre à jour le statut de la demande
      await updateDoc(doc(db, 'owner_registration_requests', request.id), {
        status: 'approved',
        approvedAt: new Date().toISOString()
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
