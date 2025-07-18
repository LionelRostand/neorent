
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { FirebaseRules } from './FirebaseRules';
import { FirebaseConfig } from './FirebaseConfig';
import { FirebaseCollections } from './FirebaseCollections';
import { FirebaseCollectionsExport } from './FirebaseCollectionsExport';
import { useToast } from '@/hooks/use-toast';

const FirebasePage: React.FC = () => {
  const { t } = useTranslation();
  const { toast } = useToast();

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: `${type} ${t('settings.firebase.config.copy')}`,
        description: "Le contenu a été copié dans le presse-papiers",
      });
    }).catch(() => {
      toast({
        title: "Erreur de copie",
        description: "Impossible de copier le contenu",
        variant: "destructive",
      });
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {t('settings.firebase.title')}
        </h2>
        <p className="text-gray-600">
          {t('settings.firebase.subtitle')}
        </p>
      </div>

      <Tabs defaultValue="rules" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="rules">Règles</TabsTrigger>
          <TabsTrigger value="config">Configuration</TabsTrigger>
          <TabsTrigger value="collections">Collections</TabsTrigger>
          <TabsTrigger value="export">Export JSON</TabsTrigger>
        </TabsList>

        <TabsContent value="rules">
          <FirebaseRules onCopy={handleCopy} />
        </TabsContent>

        <TabsContent value="config">
          <FirebaseConfig onCopy={handleCopy} />
        </TabsContent>

        <TabsContent value="collections">
          <FirebaseCollections />
        </TabsContent>

        <TabsContent value="export">
          <FirebaseCollectionsExport />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FirebasePage;
