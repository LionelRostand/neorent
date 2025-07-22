
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Database, FileText, Globe, Flame } from 'lucide-react';
import MongoConfigComponent from './MongoConfig';
import MongoExport from './MongoExport';
import ApiDocumentation from './ApiDocumentation';
import FirebaseCollectionsExport from './FirebaseCollectionsExport';

const DatabaseTab = () => {
  const { t } = useTranslation();

  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-2">
          {t('settings.database.title')}
        </h2>
        <p className="text-gray-600 text-sm md:text-base">
          {t('settings.database.subtitle')}
        </p>
      </div>

      <Tabs defaultValue="config" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="config" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            MongoDB
          </TabsTrigger>
          <TabsTrigger value="export" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Export MongoDB
          </TabsTrigger>
          <TabsTrigger value="firebase" className="flex items-center gap-2">
            <Flame className="h-4 w-4" />
            Export Firebase
          </TabsTrigger>
          <TabsTrigger value="api" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            API REST
          </TabsTrigger>
        </TabsList>

        <TabsContent value="config" className="space-y-6">
          <MongoConfigComponent />
        </TabsContent>

        <TabsContent value="export" className="space-y-6">
          <MongoExport />
        </TabsContent>

        <TabsContent value="firebase" className="space-y-6">
          <FirebaseCollectionsExport />
        </TabsContent>

        <TabsContent value="api" className="space-y-6">
          <ApiDocumentation />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DatabaseTab;
