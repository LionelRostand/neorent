
import React from 'react';
import { FirestoreRulesSection } from './Firebase/FirestoreRulesSection';
import { StorageRulesSection } from './Firebase/StorageRulesSection';
import FirebaseCollectionsList from './Firebase/FirebaseCollectionsList';
import { UserRolesList } from './Firebase/UserRolesList';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const FirebaseTab: React.FC = () => {
  const { t } = useTranslation();
  
  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    console.log(`${type} ${t('settings.firebase.copiedToClipboard')}`);
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl font-semibold text-gray-900">
            🔥 Configuration Firebase
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-6">
            {t('settings.firebase.subtitle')}
          </p>
        </CardContent>
      </Card>
      
      <FirestoreRulesSection onCopy={copyToClipboard} />
      <StorageRulesSection onCopy={copyToClipboard} />
      <FirebaseCollectionsList />
      <UserRolesList />
    </div>
  );
};

export default FirebaseTab;
