
import { useState } from 'react';
import { mongoConfigService, MongoCollection } from '@/services/mongoConfig';

export const useMongoExport = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [collections, setCollections] = useState<MongoCollection[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchCollections = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const collectionsData = await mongoConfigService.getCollectionsWithData();
      setCollections(collectionsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setIsLoading(false);
    }
  };

  const exportAsJSON = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const jsonData = await mongoConfigService.exportCollectionsAsJSON();
      
      // Créer un blob et télécharger le fichier
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `mongodb-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      return jsonData;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    collections,
    isLoading,
    error,
    fetchCollections,
    exportAsJSON,
  };
};
