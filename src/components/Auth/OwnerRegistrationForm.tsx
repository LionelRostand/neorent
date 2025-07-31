
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { useOwnerRegistrationForm } from '@/hooks/useOwnerRegistrationForm';
import { useOwnerRegistrationValidation } from '@/hooks/useOwnerRegistrationValidation';
import { useOwnerRegistrationSubmission } from '@/hooks/useOwnerRegistrationSubmission';
import PersonalInfoFields from './OwnerRegistrationForm/PersonalInfoFields';
import BusinessInfoFields from './OwnerRegistrationForm/BusinessInfoFields';
import InfoBanner from './OwnerRegistrationForm/InfoBanner';

interface OwnerRegistrationFormProps {
  onSuccess: () => void;
}

const OwnerRegistrationForm: React.FC<OwnerRegistrationFormProps> = ({ onSuccess }) => {
  const { t } = useTranslation();
  const { formData, handleChange, resetForm } = useOwnerRegistrationForm();
  const { emailError, validateEmail, handleEmailBlur, clearEmailError, setEmailError } = useOwnerRegistrationValidation();
  const { isLoading, submitRegistration } = useOwnerRegistrationSubmission();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail(formData.email)) {
      setEmailError('Veuillez entrer une adresse email valide.');
      return;
    }

    if (!formData.password || formData.password.length < 6) {
      setEmailError('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }
    
    clearEmailError();
    await submitRegistration(formData, onSuccess, resetForm);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    handleChange(e);

    if (e.target.name === 'email' && emailError) {
      clearEmailError();
    }
  };

  const handleEmailBlurEvent = () => {
    handleEmailBlur(formData.email);
  };

  return (
    <div className="max-h-[70vh] overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
      <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <PersonalInfoFields
        formData={formData}
        onChange={handleFormChange}
        onEmailBlur={handleEmailBlurEvent}
        emailError={emailError}
        isLoading={isLoading}
      />

      <BusinessInfoFields
        formData={formData}
        onChange={handleFormChange}
        isLoading={isLoading}
      />

      <InfoBanner />

      <Button 
        type="submit" 
        className="w-full mt-6 bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3 px-6 rounded-md transition-colors" 
        disabled={isLoading || !!emailError || !formData.name || !formData.email || !formData.password}
      >
        {isLoading ? t('publicSite.ownerRegistration.sending') : t('publicSite.ownerRegistration.sendRequest')}
      </Button>
      </form>
    </div>
  );
};

export default OwnerRegistrationForm;
