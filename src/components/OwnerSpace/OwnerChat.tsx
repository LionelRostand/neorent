import React from 'react';
import { useTranslation } from 'react-i18next';
import UniversalChat from '@/components/Chat/UniversalChat';

interface OwnerChatProps {
  ownerProfile: any;
}

const OwnerChat: React.FC<OwnerChatProps> = ({ ownerProfile }) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Chat NeoRent</h1>
            <p className="text-gray-600 mt-1">Communiquez avec vos locataires et colocataires</p>
          </div>
          <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
            Propriétaire
          </div>
        </div>
      </div>

      <UniversalChat 
        currentProfile={ownerProfile} 
        userType="owner" 
      />
    </div>
  );
};

export default OwnerChat;