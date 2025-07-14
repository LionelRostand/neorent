
import React from 'react';
import { FirebaseConfig } from './FirebaseConfig';
import { DatabaseStats } from './DatabaseStats';
import FirebaseCollectionsList from '../Firebase/FirebaseCollectionsList';
import MongoConfigComponent from './MongoConfig';
import ApiDocumentation from './ApiDocumentation';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
      
      <Tabs defaultValue="mongodb" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="mongodb">MongoDB</TabsTrigger>
          <TabsTrigger value="api">API REST</TabsTrigger>
          <TabsTrigger value="firebase">Firebase</TabsTrigger>
          <TabsTrigger value="stats">Statistiques</TabsTrigger>
        </TabsList>
        
        <TabsContent value="mongodb" className="space-y-4">
          <MongoConfigComponent />
        </TabsContent>
        
        <TabsContent value="api" className="space-y-4">
          <ApiDocumentation />
        </TabsContent>
        
        <TabsContent value="firebase" className="space-y-4">
          <FirebaseConfig onCopy={copyToClipboard} />
          <FirebaseCollectionsList />
        </TabsContent>
        
        <TabsContent value="stats" className="space-y-4">
          <DatabaseStats />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DatabaseTab;
