
import React from 'react';
import PublicLayout from '@/components/PublicSite/PublicLayout';
import LoginForm from '@/components/PublicSite/LoginForm';

const PublicLogin = () => {
  return (
    <PublicLayout>
      <div className="min-h-screen bg-green-600 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-extrabold text-white">
              Connexion à votre espace
            </h2>
            <p className="mt-2 text-sm text-green-100">
              Gérez vos biens immobiliers en toute simplicité
            </p>
          </div>
          <LoginForm />
        </div>
      </div>
    </PublicLayout>
  );
};

export default PublicLogin;
