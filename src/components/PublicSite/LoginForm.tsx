
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLoginForm } from './LoginForm/useLoginForm';
import LoginFormFields from './LoginForm/LoginFormFields';
import LoginFormActions from './LoginForm/LoginFormActions';

const LoginForm = () => {
  const { t } = useTranslation();
  const {
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    setShowPassword,
    isLoading,
    showRegistration,
    setShowRegistration,
    handleSubmit
  } = useLoginForm();

  return (
    <Card className="w-full max-w-md mx-auto bg-white shadow-xl">
      <CardHeader className="text-center bg-green-500 text-white rounded-t-lg">
        <CardTitle className="text-2xl font-bold">
          {t('public.login.title')}
        </CardTitle>
        <p className="text-green-100">
          {t('public.login.subtitle')}
        </p>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <LoginFormFields
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            isLoading={isLoading}
          />
          
          <LoginFormActions
            isLoading={isLoading}
            showRegistration={showRegistration}
            setShowRegistration={setShowRegistration}
          />
        </form>
      </CardContent>
    </Card>
  );
};

export default LoginForm;
