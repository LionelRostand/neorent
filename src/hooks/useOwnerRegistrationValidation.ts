
import { useState } from 'react';

export const useOwnerRegistrationValidation = () => {
  const [emailError, setEmailError] = useState('');

  const validateEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email.trim());
  };

  const handleEmailBlur = (email: string) => {
    if (email && !validateEmail(email)) {
      setEmailError('Veuillez entrer une adresse email valide.');
    } else {
      setEmailError('');
    }
  };

  const clearEmailError = () => {
    setEmailError('');
  };

  return {
    emailError,
    validateEmail,
    handleEmailBlur,
    clearEmailError,
    setEmailError
  };
};
