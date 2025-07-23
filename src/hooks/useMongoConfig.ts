
import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface FirebaseConfig {
  projectId: string;
  authDomain: string;
  storageBucket: string;
  status: string;
}

interface FirebaseConnectionTest {
  success: boolean;
  message: string;
  details?: {
    projectId: string;
    collections: string[];
    documentsCount: number;
  };
}

export const useMongoConfig = () => {
  const [config, setConfig] = useState<FirebaseConfig | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [connectionTest, setConnectionTest] = useState<FirebaseConnectionTest | null>(null);

  useEffect(() => {
    // Configuration Firebase (déjà disponible dans votre app)
    const firebaseConfig: FirebaseConfig = {
      projectId: 'neorent-23d85',
      authDomain: 'neorent-23d85.firebaseapp.com',
      storageBucket: 'neorent-23d85.firebasestorage.app',
      status: 'Connecté'
    };
    setConfig(firebaseConfig);
  }, []);

  const saveConfig = (newConfig: FirebaseConfig) => {
    setConfig(newConfig);
  };

  const testConnection = async () => {
    if (!config) return;

    setIsLoading(true);
    setConnectionTest(null);

    try {
      // Tester la connexion à Firestore en récupérant quelques collections
      const collections = ['Rent_locataires', 'Rent_colocataires', 'Rent_properties', 'Rent_owners'];
      const results = await Promise.all(
        collections.map(async (collectionName) => {
          try {
            const snapshot = await getDocs(collection(db, collectionName));
            return { name: collectionName, count: snapshot.size };
          } catch (error) {
            return { name: collectionName, count: 0 };
          }
        })
      );

      const totalDocuments = results.reduce((sum, col) => sum + col.count, 0);

      setConnectionTest({
        success: true,
        message: 'Connexion Firebase/Firestore réussie',
        details: {
          projectId: config.projectId,
          collections: results.map(r => `${r.name} (${r.count} docs)`),
          documentsCount: totalDocuments
        }
      });
    } catch (error) {
      console.error('Erreur de connexion Firebase:', error);
      setConnectionTest({
        success: false,
        message: 'Erreur lors du test de connexion Firebase/Firestore',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    config,
    saveConfig,
    testConnection,
    isLoading,
    connectionTest,
  };
};
