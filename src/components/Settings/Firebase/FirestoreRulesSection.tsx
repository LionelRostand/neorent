
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Copy } from 'lucide-react';
import { firestoreRules } from './FirestoreRulesData';
import { FirestoreRulesDisplay } from './FirestoreRulesDisplay';
import { FirestoreRulesInfo } from './FirestoreRulesInfo';

interface FirestoreRulesSectionProps {
  onCopy: (text: string, type: string) => void;
}

export const FirestoreRulesSection: React.FC<FirestoreRulesSectionProps> = ({ onCopy }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-lg md:text-xl">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-red-600" />
            Règles de sécurité Firestore
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onCopy(firestoreRules, 'Firestore')}
            className="flex items-center gap-2"
          >
            <Copy className="h-4 w-4" />
            Copier
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 text-sm mb-4">
          Copiez et collez ces règles dans votre console Firebase (Firestore Database → Règles) :
        </p>
        
        <FirestoreRulesDisplay />
        
        <FirestoreRulesInfo />
      </CardContent>
    </Card>
  );
};
