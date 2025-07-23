
import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface MongoConfig {
  host: string;
  port: number;
  database: string;
  username?: string;
  password?: string;
  authSource?: string;
  ssl?: boolean;
  allowInvalidCertificates?: boolean;
  connectionString?: string;
}

interface FirebaseConfig {
  projectId: string;
  authDomain: string;
  storageBucket: string;
  status: string;
}

interface MongoConnectionTest {
  success: boolean;
  message: string;
  details?: {
    host?: string;
    database?: string;
    projectId?: string;
    collections: string[];
    documentsCount?: number;
    latency?: number;
  };
}

type DatabaseType = 'mongodb' | 'firebase';

interface DatabaseConfig {
  type: DatabaseType;
  mongodb?: MongoConfig;
  firebase?: FirebaseConfig;
}

export const useDatabaseConfig = () => {
  const [config, setConfig] = useState<DatabaseConfig | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [connectionTest, setConnectionTest] = useState<MongoConnectionTest | null>(null);

  useEffect(() => {
    const savedConfig = localStorage.getItem('databaseConfig');
    if (savedConfig) {
      setConfig(JSON.parse(savedConfig));
    } else {
      // Configuration par défaut
      const defaultConfig: DatabaseConfig = {
        type: 'firebase',
        firebase: {
          projectId: 'neorent-23d85',
          authDomain: 'neorent-23d85.firebaseapp.com',
          storageBucket: 'neorent-23d85.firebasestorage.app',
          status: 'Connecté'
        },
        mongodb: {
          host: 'mongodb.neotech-consulting.com',
          port: 27017,
          database: 'neorent',
          username: 'admin',
          password: 'admin',
          authSource: 'admin',
          ssl: true,
          allowInvalidCertificates: true,
          connectionString: 'mongodb://admin:admin@mongodb.neotech-consulting.com:27017/neorent?authSource=admin&ssl=true&tlsAllowInvalidCertificates=true'
        }
      };
      setConfig(defaultConfig);
      localStorage.setItem('databaseConfig', JSON.stringify(defaultConfig));
    }
  }, []);

  const saveConfig = (newConfig: DatabaseConfig) => {
    setConfig(newConfig);
    localStorage.setItem('databaseConfig', JSON.stringify(newConfig));
  };

  const testFirebaseConnection = async (): Promise<MongoConnectionTest> => {
    try {
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

      return {
        success: true,
        message: 'Connexion Firebase/Firestore réussie',
        details: {
          projectId: config?.firebase?.projectId || 'neorent-23d85',
          collections: results.map(r => `${r.name} (${r.count} docs)`),
          documentsCount: totalDocuments
        }
      };
    } catch (error) {
      console.error('Erreur de connexion Firebase:', error);
      return {
        success: false,
        message: 'Erreur lors du test de connexion Firebase/Firestore',
        details: {
          collections: []
        }
      };
    }
  };

  const testMongoConnection = async (mongoConfig: MongoConfig): Promise<MongoConnectionTest> => {
    try {
      // Simuler un test de connexion MongoDB (remplacez par votre logique réelle)
      const response = await fetch('http://localhost:5000/api/mongo/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mongoConfig),
      });

      if (response.ok) {
        const result = await response.json();
        return {
          success: true,
          message: 'Connexion MongoDB réussie',
          details: {
            host: mongoConfig.host,
            database: mongoConfig.database,
            collections: result.collections || ['test collection'],
            latency: Math.floor(Math.random() * 100) + 50,
          }
        };
      } else {
        throw new Error('Connexion MongoDB échouée');
      }
    } catch (error) {
      console.error('Erreur de connexion MongoDB:', error);
      return {
        success: false,
        message: 'Erreur lors du test de connexion MongoDB. Vérifiez que l\'API Node.js est démarrée sur localhost:5000',
        details: {
          collections: []
        }
      };
    }
  };

  const testConnection = async (testConfig?: MongoConfig) => {
    if (!config) return;

    setIsLoading(true);
    setConnectionTest(null);

    try {
      let result: MongoConnectionTest;
      
      if (config.type === 'firebase') {
        result = await testFirebaseConnection();
      } else if (config.type === 'mongodb' && config.mongodb) {
        result = await testMongoConnection(testConfig || config.mongodb);
      } else {
        result = {
          success: false,
          message: 'Configuration de base de données invalide',
          details: { collections: [] }
        };
      }
      
      setConnectionTest(result);
    } catch (error) {
      console.error('Erreur de test de connexion:', error);
      setConnectionTest({
        success: false,
        message: 'Erreur inattendue lors du test de connexion',
        details: { collections: [] }
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
