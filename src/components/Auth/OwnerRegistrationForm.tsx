
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
    <form onSubmit={handleSubmit} className="space-y-4">
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
        className="w-full" 
        disabled={isLoading || !!emailError}
      >
        {isLoading ? t('publicSite.ownerRegistration.sending') : t('publicSite.ownerRegistration.sendRequest')}
      </Button>
    </form>
  );
};

export default OwnerRegistrationForm;
