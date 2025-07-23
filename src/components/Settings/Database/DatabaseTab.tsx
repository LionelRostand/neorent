
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Database, FileText, Globe, Flame } from 'lucide-react';
import DatabaseConfigComponent from './DatabaseConfig';
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
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto p-1 bg-gray-100">
          <TabsTrigger 
            value="config" 
            className="flex items-center gap-1 md:gap-2 p-2 md:p-3 text-xs md:text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            <Database className="h-3 w-3 md:h-4 md:w-4" />
            <span className="hidden sm:inline">Configuration</span>
            <span className="sm:hidden">Config</span>
          </TabsTrigger>
          <TabsTrigger 
            value="export" 
            className="flex items-center gap-1 md:gap-2 p-2 md:p-3 text-xs md:text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            <FileText className="h-3 w-3 md:h-4 md:w-4" />
            <span className="hidden sm:inline">Export MongoDB</span>
            <span className="sm:hidden">Export</span>
          </TabsTrigger>
          <TabsTrigger 
            value="firebase" 
            className="flex items-center gap-1 md:gap-2 p-2 md:p-3 text-xs md:text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            <Flame className="h-3 w-3 md:h-4 md:w-4" />
            <span className="hidden sm:inline">Export Firebase</span>
            <span className="sm:hidden">Firebase</span>
          </TabsTrigger>
          <TabsTrigger 
            value="api" 
            className="flex items-center gap-1 md:gap-2 p-2 md:p-3 text-xs md:text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            <Globe className="h-3 w-3 md:h-4 md:w-4" />
            <span className="hidden sm:inline">API REST</span>
            <span className="sm:hidden">API</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="config" className="space-y-6">
          <DatabaseConfigComponent />
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
