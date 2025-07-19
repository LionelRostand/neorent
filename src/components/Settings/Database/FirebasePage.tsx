
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Database, Download } from 'lucide-react';
import { FirestoreRulesSection } from '../Firebase/FirestoreRulesSection';
import { FirebaseConfig } from './FirebaseConfig';
import FirebaseCollectionsList from '../Firebase/FirebaseCollectionsList';
import FirebaseCollectionsExport from './FirebaseCollectionsExport';
import { useToast } from '@/hooks/use-toast';

const FirebasePage = () => {
  const { t } = useTranslation();
  const { toast } = useToast();

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: t('settings.copied'),
        description: `${type} ${t('settings.copiedToClipboard')}`,
      });
    });
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-2">
          {t('settings.firebase.title')}
        </h2>
        <p className="text-gray-600 text-sm md:text-base">
          {t('settings.firebase.subtitle')}
        </p>
      </div>

      <Tabs defaultValue="config" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="config" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Configuration
          </TabsTrigger>
          <TabsTrigger value="rules" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Firestore Rules
          </TabsTrigger>
          <TabsTrigger value="collections" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Collections
          </TabsTrigger>
          <TabsTrigger value="export" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export JSON
          </TabsTrigger>
        </TabsList>

        <TabsContent value="config" className="space-y-6">
          <FirebaseConfig onCopy={handleCopy} />
        </TabsContent>

        <TabsContent value="rules" className="space-y-6">
          <FirestoreRulesSection onCopy={handleCopy} />
        </TabsContent>

        <TabsContent value="collections" className="space-y-6">
          <FirebaseCollectionsList />
        </TabsContent>

        <TabsContent value="export" className="space-y-6">
          <FirebaseCollectionsExport />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FirebasePage;
