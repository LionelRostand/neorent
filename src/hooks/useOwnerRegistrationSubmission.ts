
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
      
      const requestId = `owner_request_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const registrationRequest = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone?.trim() || '',
        company: formData.company?.trim() || '',
        address: formData.address?.trim() || '',
        message: formData.message?.trim() || '',
        status: 'pending',
        createdAt: new Date().toISOString(),
        type: 'owner_registration'
      };

      console.log('Données à envoyer:', registrationRequest);

      // Utiliser un ID unique pour éviter les conflits
      await setDoc(doc(db, 'owner_registration_requests', requestId), registrationRequest);
      
      console.log('Demande envoyée avec succès avec l\'ID:', requestId);
      
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
        console.log('Type d\'erreur:', error.name, 'Message:', error.message);
        
        // Messages d'erreur plus spécifiques
        if (error.message.includes('permission-denied') || error.message.includes('permission')) {
          errorMessage = 'Erreur de permission. Les règles de sécurité sont en cours de mise à jour. Veuillez réessayer dans quelques instants.';
        } else if (error.message.includes('network') || error.message.includes('fetch')) {
          errorMessage = 'Erreur de connexion. Vérifiez votre connexion internet et réessayez.';
        } else if (error.message.includes('quota') || error.message.includes('quota-exceeded')) {
          errorMessage = 'Service temporairement indisponible. Réessayez plus tard.';
        } else if (error.message.includes('invalid-argument')) {
          errorMessage = 'Données invalides. Vérifiez les informations saisies.';
        }
      }
      
      toast({
        title: 'Erreur lors de l\'envoi',
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
