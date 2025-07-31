
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
      console.log('🔄 Starting approval process for:', request.email);
      console.log('📋 Request data:', request);
      
      // Utiliser le mot de passe fourni dans la demande ou générer un temporaire
      const password = request.password || ownerAccountService.generateTemporaryPassword();
      console.log('🔑 Password for account:', password ? 'provided' : 'generated');
      
      // Créer le compte dans Firebase Authentication
      console.log('🔥 Creating Firebase account...');
      const firebaseUser = await ownerAccountService.createFirebaseAccount(request.email, password);
      console.log('✅ Firebase account created with UID:', firebaseUser.uid);

      // Vérifier si un profil utilisateur existe déjà
      console.log('🔍 Checking for existing user profile...');
      const existingUser = await ownerAccountService.findExistingUser(request.email);

      if (existingUser) {
        console.log('📝 Updating existing profile for:', request.email);
        // Mettre à jour le profil existant avec l'UID Firebase
        const userData = existingUser.data();
        await ownerAccountService.updateExistingProfile(
          existingUser.id, 
          request, 
          firebaseUser.uid, 
          password, 
          userData
        );
        console.log('✅ Existing profile updated successfully');

        toast({
          title: "Demande approuvée",
          description: `Le profil de ${request.name} a été mis à jour et apparaît maintenant dans l'onglet Propriétaires. L'utilisateur peut maintenant se connecter.`,
        });
      } else {
        console.log('🆕 Creating new profile for:', request.email);
        // Créer un nouveau profil propriétaire avec l'UID Firebase
        await ownerAccountService.createNewProfile(firebaseUser.uid, request, password);
        console.log('✅ New profile created successfully');

        toast({
          title: "Demande approuvée",
          description: `Le profil de ${request.name} a été créé avec succès. L'utilisateur peut maintenant se connecter.`,
        });
      }

      // Supprimer la demande après approbation au lieu de juste mettre à jour le statut
      console.log('🗑️ Deleting request after approval...');
      await ownerRegistrationService.deleteRequest(request.id);
      console.log('✅ Request deleted successfully');

      console.log('🔄 Refreshing requests list...');
      fetchRequests();
      console.log('✅ Approval process completed successfully');
    } catch (error: any) {
      console.error('❌ Error in approval process:', error);
      console.error('❌ Error code:', error.code);
      console.error('❌ Error message:', error.message);
      console.error('❌ Full error:', error);
      
      let errorMessage = "Une erreur est survenue lors de l'approbation du compte.";
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = `Un compte Firebase existe déjà pour ${request.email}. Veuillez vérifier les paramètres d'authentification.`;
        console.log('🔍 Trying to handle existing Firebase account...');
        
        // Si le compte Firebase existe déjà, essayer de créer/mettre à jour seulement le profil
        try {
          const fallbackPassword = request.password || ownerAccountService.generateTemporaryPassword();
          const existingUser = await ownerAccountService.findExistingUser(request.email);
          
          if (existingUser) {
            const userData = existingUser.data();
            // Utiliser un UID fictif si on ne peut pas créer le compte Firebase
            await ownerAccountService.updateExistingProfile(
              existingUser.id, 
              request, 
              userData.firebaseUid || 'existing_firebase_account', 
              fallbackPassword, 
              userData
            );
          } else {
            // Créer le profil sans créer de compte Firebase
            await ownerAccountService.createNewProfile('existing_firebase_account', request, fallbackPassword);
          }
          
          await ownerRegistrationService.deleteRequest(request.id);
          fetchRequests();
          
          toast({
            title: "Demande approuvée",
            description: `Le profil de ${request.name} a été créé. L'utilisateur peut se connecter avec son compte existant.`,
          });
          return;
        } catch (fallbackError) {
          console.error('❌ Fallback also failed:', fallbackError);
        }
      } else if (error.code === 'auth/weak-password') {
        errorMessage = "Erreur de mot de passe. Veuillez réessayer.";
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = "L'adresse email n'est pas valide.";
      } else if (error.message) {
        errorMessage = `Erreur détaillée: ${error.message}`;
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
