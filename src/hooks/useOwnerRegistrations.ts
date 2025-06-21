
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { OwnerRegistrationRequest } from '@/types/ownerRegistration';
import { ownerRegistrationService } from '@/services/ownerRegistrationService';
import { ownerAccountService } from '@/services/ownerAccountService';

export const useOwnerRegistrations = () => {
  const [requests, setRequests] = useState<OwnerRegistrationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const requestsData = await ownerRegistrationService.fetchRequests();
      setRequests(requestsData);
    } catch (error) {
      console.error('Error fetching registration requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const approveRequest = async (request: OwnerRegistrationRequest) => {
    try {
      // Générer un mot de passe temporaire
      const temporaryPassword = ownerAccountService.generateTemporaryPassword();
      
      // Créer le compte dans Firebase Authentication
      const firebaseUser = await ownerAccountService.createFirebaseAccount(request.email, temporaryPassword);
      
      console.log('Compte Firebase Auth créé pour:', request.email);

      // Vérifier si un profil utilisateur existe déjà
      const existingUser = await ownerAccountService.findExistingUser(request.email);

      if (existingUser) {
        // Mettre à jour le profil existant avec l'UID Firebase
        const userData = existingUser.data();
        await ownerAccountService.updateExistingProfile(
          existingUser.id, 
          request, 
          firebaseUser.uid, 
          temporaryPassword, 
          userData
        );

        toast({
          title: "Demande approuvée",
          description: `Le profil de ${request.name} a été mis à jour et apparaît maintenant dans l'onglet Propriétaires. Mot de passe temporaire : ${temporaryPassword}`,
        });
      } else {
        // Créer un nouveau profil propriétaire avec l'UID Firebase
        await ownerAccountService.createNewProfile(firebaseUser.uid, request, temporaryPassword);

        toast({
          title: "Demande approuvée",
          description: `Le profil de ${request.name} a été créé avec succès. Mot de passe temporaire : ${temporaryPassword}. L'utilisateur peut maintenant se connecter.`,
        });
      }

      // Mettre à jour le statut de la demande
      await ownerRegistrationService.updateRequestStatus(request.id, firebaseUser.uid, temporaryPassword);

      fetchRequests();
    } catch (error: any) {
      console.error('Error approving request:', error);
      
      let errorMessage = "Une erreur est survenue lors de l'approbation du compte.";
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = `Un compte Firebase existe déjà pour ${request.email}. Veuillez vérifier les paramètres d'authentification.`;
      } else if (error.code === 'auth/weak-password') {
        errorMessage = "Erreur de mot de passe. Veuillez réessayer.";
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = "L'adresse email n'est pas valide.";
      }
      
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const rejectRequest = async (requestId: string) => {
    try {
      await ownerRegistrationService.rejectRequest(requestId);

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
      await ownerRegistrationService.deleteRequest(requestId);
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
