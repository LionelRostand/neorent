import React from 'react';
import { useTranslation } from 'react-i18next';
import UniversalChat from '@/components/Chat/UniversalChat';

interface TenantChatProps {
  currentProfile: any;
}

const TenantChat: React.FC<TenantChatProps> = ({ currentProfile }) => {
  const { t } = useTranslation();

  // Déterminer le type d'utilisateur
  const getUserType = () => {
    if (currentProfile?.primaryTenant) {
      return 'roommate';
    }
    return 'tenant';
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Chat NeoRent</h1>
            <p className="text-gray-600 mt-1">{t('tenantSpace.chat.title')}</p>
          </div>
          <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
            {getUserType() === 'roommate' ? 'Colocataire' : 'Locataire'}
          </div>
        </div>
      </div>

      <UniversalChat 
        currentProfile={currentProfile} 
        userType={getUserType()} 
      />
    </div>
  );
};

export default TenantChat;