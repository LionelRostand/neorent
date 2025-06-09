
import React from 'react';
import { firestoreRules } from './FirestoreRulesData';

export const FirestoreRulesDisplay: React.FC = () => {
  return (
    <div className="bg-gray-900 text-gray-100 p-3 md:p-4 rounded-lg overflow-x-auto">
      <pre className="text-xs whitespace-pre-wrap">
        <code>{firestoreRules}</code>
      </pre>
    </div>
  );
};
