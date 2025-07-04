
import React from 'react';
import { FirebaseConfig } from './FirebaseConfig';
import { DatabaseStats } from './DatabaseStats';
import MongoDBConfig from './MongoDBConfig';
import FirebaseCollectionsList from '../Firebase/FirebaseCollectionsList';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const DatabaseTab: React.FC = () => {
  const { t } = useTranslation();
  
  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    console.log(`${type} ${t('settings.firebase.copy')}`);
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl font-semibold text-gray-900">
            🗄️ {t('settings.database.title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-6">
            {t('settings.database.subtitle')}
          </p>
        </CardContent>
      </Card>
      
      <FirebaseConfig onCopy={copyToClipboard} />
      <DatabaseStats />
      
      <Separator className="my-6" />
      
      <MongoDBConfig />
      
      <FirebaseCollectionsList />
    </div>
  );
};

export default DatabaseTab;
