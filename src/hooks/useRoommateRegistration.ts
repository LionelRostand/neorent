
import { useState } from 'react';
import { useFirebaseRoommates } from './useFirebaseRoommates';
import { useFirebaseRoommateAuth } from './useFirebaseRoommateAuth';
import { toast } from '@/hooks/use-toast';

export const useRoommateRegistration = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addRoommate, checkRoommateExists } = useFirebaseRoommates();
  const { createRoommateAuthAccount } = useFirebaseRoommateAuth();

  const registerRoommate = async (roommateData: any, password: string) => {
    try {
      setIsSubmitting(true);

      console.log('Starting roommate registration process...');

      // 1. Vérifier si le colocataire existe déjà
      const existingRoommate = await checkRoommateExists(roommateData.email);
      
      let roommate;
      if (existingRoommate) {
        console.log('Roommate already exists, skipping creation in database');
        roommate = existingRoommate;
      } else {
        // 2. Ajouter le colocataire dans la collection Rent_colocataires seulement s'il n'existe pas
        roommate = await addRoommate(roommateData);
        console.log('Roommate added to collection:', roommate);
      }

      // 3. Créer le compte Firebase Auth et le profil utilisateur
      const authResult = await createRoommateAuthAccount(roommate, password);
      
      if (authResult.success) {
        if (authResult.emailAlreadyExists) {
          toast({
            title: "Colocataire ajouté",
            description: "L'email existe déjà, mais le colocataire a été ajouté avec succès.",
            variant: "default",
          });
        } else {
          toast({
            title: "Colocataire créé",
            description: "Le colocataire a été ajouté et peut maintenant se connecter.",
            variant: "default",
          });
        }
        
        console.log('Roommate registration completed successfully');
        return { success: true, roommate };
      } else {
        throw new Error('Erreur lors de la création du compte d\'authentification');
      }
    } catch (error) {
      console.error('Error during roommate registration:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de l'ajout du colocataire",
        variant: "destructive",
      });
      return { success: false, error };
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    registerRoommate,
    isSubmitting
  };
};
