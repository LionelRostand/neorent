
import React from 'react';
import { FirestoreRulesSection } from './Firebase/FirestoreRulesSection';
import { StorageRulesSection } from './Firebase/StorageRulesSection';
import { FirebaseCollectionsList } from './Firebase/FirebaseCollectionsList';
import { UserRolesList } from './Firebase/UserRolesList';

const FirebaseTab: React.FC = () => {
  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    console.log(`Règles ${type} copiées dans le presse-papier`);
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
