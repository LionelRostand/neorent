
import React from 'react';
import { useTranslation } from 'react-i18next';
import PublicLayout from '@/components/PublicSite/PublicLayout';
import LoginForm from '@/components/PublicSite/LoginForm';

const PublicLogin = () => {
  const { t } = useTranslation();

  return (
    <PublicLayout>
      <div className="min-h-screen bg-green-600 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-extrabold text-white">
              {t('publicSite.login.title')}
            </h2>
            <p className="mt-2 text-sm text-green-100">
              {t('publicSite.login.subtitle')}
            </p>
          </div>
          <LoginForm />
        </div>
      </div>
    </PublicLayout>
  );
};

export default PublicLogin;
