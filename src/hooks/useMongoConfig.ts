
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
        port: 27017,
        database: 'neorent',
        username: 'admin',
        password: 'admin',
        authSource: 'admin',
        ssl: true,
        allowInvalidCertificates: true,
        connectionString: 'mongodb://admin:admin@mongodb.neotech-consulting.com:27017/neorent?authSource=admin&ssl=true&tlsAllowInvalidCertificates=true'
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
