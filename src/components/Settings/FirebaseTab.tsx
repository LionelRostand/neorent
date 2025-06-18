
import React from 'react';
import { FirestoreRulesSection } from './Firebase/FirestoreRulesSection';
import { StorageRulesSection } from './Firebase/StorageRulesSection';
import FirebaseCollectionsList from './Firebase/FirebaseCollectionsList';
import { UserRolesList } from './Firebase/UserRolesList';
import { useTranslation } from 'react-i18next';

const FirebaseTab: React.FC = () => {
  const { t } = useTranslation();
  
  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    console.log(`${type} ${t('settings.firebase.copiedToClipboard')}`);
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <FirestoreRulesSection onCopy={copyToClipboard} />
      <StorageRulesSection onCopy={copyToClipboard} />
      <FirebaseCollectionsList />
      <UserRolesList />
    </div>
  );
};

export default FirebaseTab;
