
import { useState, useEffect } from 'react';
import { mongoConfigService, MongoConfig, MongoConnectionTest } from '@/services/mongoConfig';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

export type DatabaseType = 'mongodb' | 'firebase';

export interface FirebaseConfig {
  projectId: string;
  apiKey: string;
  authDomain: string;
  databaseURL?: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

export interface DatabaseConfig {
  type: DatabaseType;
  mongodb?: MongoConfig;
  firebase?: FirebaseConfig;
}

export interface ConnectionTest {
  success: boolean;
  message: string;
  details?: {
    host?: string;
    database?: string;
    collections?: string[];
    latency?: number;
  };
}

export const useDatabaseConfig = () => {
  const [config, setConfig] = useState<DatabaseConfig | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [connectionTest, setConnectionTest] = useState<ConnectionTest | null>(null);

  useEffect(() => {
    const savedConfig = localStorage.getItem('databaseConfig');
    if (savedConfig) {
      setConfig(JSON.parse(savedConfig));
    } else {
      // Configuration par défaut
      const defaultConfig: DatabaseConfig = {
        type: 'mongodb',
        mongodb: {
          host: '161.97.108.157',
          port: 27017,
          database: 'immobilier',
          username: 'admin',
          password: '',
          authSource: 'admin',
          ssl: true,
          allowInvalidCertificates: true,
          connectionString: 'mongodb://admin@161.97.108.157:27017/immobilier?authSource=admin'
        },
        firebase: {
          projectId: 'neorent-23d85',
          apiKey: 'AIzaSyDInXgSvKg0hvD8b57ts400lah99XjZx34',
          authDomain: 'neorent-23d85.firebaseapp.com',
          storageBucket: 'neorent-23d85.firebasestorage.app',
          messagingSenderId: '312457908893',
          appId: '1:312457908893:web:f625fd27aacf3798e77a74'
        }
      };
      setConfig(defaultConfig);
      localStorage.setItem('databaseConfig', JSON.stringify(defaultConfig));
    }
  }, []);

  const saveConfig = (newConfig: DatabaseConfig) => {
    localStorage.setItem('databaseConfig', JSON.stringify(newConfig));
    setConfig(newConfig);
  };

  const testFirebaseConnection = async (firebaseConfig: FirebaseConfig): Promise<ConnectionTest> => {
    try {
      // Test simple : essayer de récupérer un document ou vérifier l'accès
      const testDoc = doc(db, '_test', 'connection');
      await getDoc(testDoc);
      
      return {
        success: true,
        message: 'Connexion Firebase établie avec succès',
        details: {
          host: firebaseConfig.authDomain,
          database: firebaseConfig.projectId,
        }
      };
    } catch (error) {
      return {
        success: false,
        message: `Erreur de connexion Firebase: ${error instanceof Error ? error.message : 'Erreur inconnue'}`
      };
    }
  };

  const testMongoConnection = async (mongoConfig: MongoConfig): Promise<ConnectionTest> => {
    try {
      const result = await mongoConfigService.testConnection(mongoConfig);
      return result;
    } catch (error) {
      console.error('Erreur de connexion MongoDB:', error);
      return {
        success: false,
        message: 'Erreur lors du test de connexion: API Node.js non accessible sur localhost:5000. Veuillez démarrer votre API en local avec "cd api && npm run dev"',
      };
    }
  };

  const testConnection = async (testConfig?: DatabaseConfig) => {
    const configToTest = testConfig || config;
    if (!configToTest) return;

    setIsLoading(true);
    setConnectionTest(null);

    try {
      let result: ConnectionTest;
      
      if (configToTest.type === 'firebase' && configToTest.firebase) {
        result = await testFirebaseConnection(configToTest.firebase);
      } else if (configToTest.type === 'mongodb' && configToTest.mongodb) {
        result = await testMongoConnection(configToTest.mongodb);
      } else {
        result = {
          success: false,
          message: 'Configuration manquante pour le type de base de données sélectionné'
        };
      }
      
      setConnectionTest(result);
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

// Maintenir la compatibilité avec l'ancien hook
export const useMongoConfig = () => {
  const { config, saveConfig, testConnection, isLoading, connectionTest } = useDatabaseConfig();
  
  return {
    config: config?.mongodb || null,
    saveConfig: (mongoConfig: MongoConfig) => {
      const newConfig: DatabaseConfig = {
        type: 'mongodb',
        mongodb: mongoConfig,
        firebase: config?.firebase
      };
      saveConfig(newConfig);
    },
    testConnection: () => testConnection(),
    isLoading,
    connectionTest,
  };
};
