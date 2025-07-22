
import { useState, useEffect } from 'react';
import { mongoConfigService, MongoConfig, MongoConnectionTest } from '@/services/mongoConfig';

export const useMongoConfig = () => {
  const [config, setConfig] = useState<MongoConfig | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [connectionTest, setConnectionTest] = useState<MongoConnectionTest | null>(null);

  useEffect(() => {
    const savedConfig = mongoConfigService.getConfig();
    if (savedConfig) {
      setConfig(savedConfig);
    } else {
      // Configuration par défaut basée sur les paramètres utilisateur
      const defaultConfig: MongoConfig = {
        host: 'mongodb.neotech-consulting.com',
        port: 30017,
        database: 'Neorent',
        username: 'admin',
        password: '',
        authSource: 'admin',
        ssl: false,
        allowInvalidCertificates: false,
        connectionString: 'mongodb://admin@mongodb.neotech-consulting.com:30017/Neorent'
      };
      setConfig(defaultConfig);
      mongoConfigService.saveConfig(defaultConfig);
    }
  }, []);

  const saveConfig = (newConfig: MongoConfig) => {
    mongoConfigService.saveConfig(newConfig);
    setConfig(newConfig);
  };

  const testConnection = async (testConfig?: MongoConfig) => {
    const configToTest = testConfig || config;
    if (!configToTest) return;

    setIsLoading(true);
    setConnectionTest(null);

    try {
      const result = await mongoConfigService.testConnection(configToTest);
      setConnectionTest(result);
    } catch (error) {
      console.error('Erreur de connexion MongoDB:', error);
      setConnectionTest({
        success: false,
        message: 'Erreur lors du test de connexion: API Node.js non accessible sur localhost:5000. Veuillez démarrer votre API en local avec "cd api && npm run dev"',
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
