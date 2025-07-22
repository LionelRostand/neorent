
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
      // Configuration par défaut pour mongodb.neotech-consulting.com
      const defaultConfig: MongoConfig = {
        host: 'mongodb.neotech-consulting.com',
        port: 30017, // Port NodePort pour MongoDB direct
        database: 'neorent',
        username: '',
        password: '',
        authSource: 'admin',
        ssl: false, // Désactiver SSL pour la connexion directe à MongoDB
        allowInvalidCertificates: false,
        connectionString: 'mongodb://mongodb.neotech-consulting.com:30017/neorent'
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
      setConnectionTest({
        success: false,
        message: 'Erreur lors du test de connexion',
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
