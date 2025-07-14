
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { OwnerRegistrationFormData } from './useOwnerRegistrationForm';

export const useOwnerRegistrationSubmission = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslation();

  const submitRegistration = async (formData: OwnerRegistrationFormData, onSuccess: () => void, resetForm: () => void) => {
    setIsLoading(true);

    try {
      console.log('Tentative d\'envoi de la demande:', formData);
      
      const requestId = `owner_request_${Date.now()}`;
      const registrationRequest = {
        ...formData,
        email: formData.email.trim(),
        status: 'pending',
        createdAt: new Date().toISOString(),
        type: 'owner_registration'
      };

      console.log('Données à envoyer:', registrationRequest);

      await setDoc(doc(db, 'owner_registration_requests', requestId), registrationRequest);
      
      console.log('Demande envoyée avec succès');
      
      toast({
        title: t('publicSite.ownerRegistration.requestSent'),
        description: t('publicSite.ownerRegistration.requestSentDescription'),
      });
      
      resetForm();
      onSuccess();
    } catch (error) {
      console.error('Erreur détaillée lors de la soumission:', error);
      
      let errorMessage = 'Une erreur est survenue lors de l\'envoi de votre demande.';
      
      if (error instanceof Error) {
        if (error.message.includes('permission')) {
          errorMessage = 'Erreur de permission. Veuillez contacter l\'administrateur.';
        } else if (error.message.includes('network')) {
          errorMessage = 'Erreur de connexion. Vérifiez votre connexion internet.';
        } else if (error.message.includes('quota')) {
          errorMessage = 'Service temporairement indisponible. Réessayez plus tard.';
        }
      }
      
      toast({
        title: 'Erreur',
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    submitRegistration
  };
};
