
import React from 'react';
import { FirebaseConfig } from './FirebaseConfig';
import { DatabaseStats } from './DatabaseStats';
import FirebaseCollectionsList from '../Firebase/FirebaseCollectionsList';

const DatabaseTab: React.FC = () => {
  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    console.log(`${type} copié dans le presse-papier`);
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <FirebaseConfig onCopy={copyToClipboard} />
      <DatabaseStats />
      <FirebaseCollectionsList />
    </div>
  );
};

export default DatabaseTab;
