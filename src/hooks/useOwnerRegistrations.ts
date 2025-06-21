
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
      // Générer un mot de passe temporaire
      const tempPassword = `Owner${Math.random().toString(36).substring(2, 10)}!`;
      
      // Créer le compte Firebase
      const result = await createUserAccount(request.email, tempPassword);
      
      if (result.emailAlreadyExists) {
        toast({
          title: "Erreur",
          description: "Un compte existe déjà avec cette adresse email.",
          variant: "destructive",
        });
        return;
      }

      if (!result.user) {
        throw new Error('Échec de la création du compte');
      }

      // Créer le profil propriétaire dans user_roles
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
