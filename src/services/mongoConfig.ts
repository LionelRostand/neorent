
// Configuration MongoDB
export interface MongoConfig {
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

export interface MongoConnectionTest {
  success: boolean;
  message: string;
  details?: {
    host: string;
    database: string;
    collections?: string[];
    latency?: number;
  };
}

export interface MongoCollection {
  name: string;
  count: number;
  documents?: any[];
}

class MongoConfigService {
  private config: MongoConfig | null = null;

  // Sauvegarder la configuration MongoDB
  saveConfig(config: MongoConfig): void {
    this.config = config;
    localStorage.setItem('mongoConfig', JSON.stringify(config));
  }

  // Récupérer la configuration MongoDB
  getConfig(): MongoConfig | null {
    if (this.config) return this.config;
    
    const saved = localStorage.getItem('mongoConfig');
    if (saved) {
      this.config = JSON.parse(saved);
    }
    return this.config;
  }

  // Construire l'URL de connexion
  buildConnectionUrl(config: MongoConfig): string {
    if (config.connectionString) {
      return config.connectionString;
    }

    let url = `mongodb://`;
    
    // Ajouter les credentials si fournis
    if (config.username && config.password) {
      url += `${encodeURIComponent(config.username)}:${encodeURIComponent(config.password)}@`;
    }
    
    // Ajouter host et port
    url += `${config.host}:${config.port}`;
    
    // Ajouter la base de données
    if (config.database) {
      url += `/${config.database}`;
    }
    
    // Ajouter les paramètres
    const params = [];
    if (config.authSource) params.push(`authSource=${config.authSource}`);
    if (config.ssl) params.push('ssl=true');
    if (config.allowInvalidCertificates) params.push('tlsAllowInvalidCertificates=true');
    
    if (params.length > 0) {
      url += `?${params.join('&')}`;
    }
    
    return url;
  }

  // Simuler un test de connexion MongoDB (dans un vrai environnement, ceci devrait appeler votre API backend)
  private async simulateMongoConnection(connectionUrl: string): Promise<boolean> {
    try {
      // En réalité, vous devriez avoir une API backend qui peut tester la connexion
      console.log('🔗 Attempting to connect to MongoDB with URL:', connectionUrl);
      
      // Simulation d'un délai de connexion
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Pour l'instant, on considère que la connexion réussit si l'URL est bien formée
      // et contient soit le domaine neotech-consulting.com soit l'IP 161.97.108.157
      const isValidUrl = connectionUrl.includes('mongodb://') && 
                        (connectionUrl.includes('neotech-consulting.com') || 
                         connectionUrl.includes('161.97.108.157'));
      
      return isValidUrl;
    } catch (error) {
      console.error('❌ Connection simulation failed:', error);
      return false;
    }
  }

  // Tester la connexion MongoDB
  async testConnection(config: MongoConfig): Promise<MongoConnectionTest> {
    try {
      console.log('🔍 Testing MongoDB connection with config:', config);
      
      const connectionUrl = this.buildConnectionUrl(config);
      console.log('🔗 Generated connection URL:', connectionUrl);
      
      // Simuler le test de connexion
      const connectionSuccess = await this.simulateMongoConnection(connectionUrl);
      
      if (connectionSuccess) {
        return {
          success: true,
          message: 'Connexion simulée réussie à MongoDB',
          details: {
            host: config.host,
            database: config.database,
            collections: ['neorent_properties', 'neorent_users'], // Collections d'exemple
            latency: Math.floor(Math.random() * 100) + 50, // Latence simulée
          },
        };
      } else {
        return {
          success: false,
          message: 'Échec de la connexion simulée. Vérifiez votre configuration.',
        };
      }
    } catch (error) {
      console.error('❌ MongoDB connection test failed:', error);
      return {
        success: false,
        message: `Erreur de connexion: ${error instanceof Error ? error.message : 'Erreur inconnue'}. Vérifiez que MongoDB est accessible sur ${config.host}:${config.port}`,
      };
    }
  }

  // Récupérer toutes les collections avec leurs documents (simulation)
  async getCollectionsWithData(): Promise<MongoCollection[]> {
    try {
      const config = this.getConfig();
      if (!config) {
        throw new Error('Configuration MongoDB non trouvée');
      }

      // Simulation de données de collections
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return [
        {
          name: 'neorent_properties',
          count: 25,
          documents: []
        },
        {
          name: 'neorent_users',
          count: 12,
          documents: []
        }
      ];
    } catch (error) {
      console.error('Failed to get collections data:', error);
      throw error;
    }
  }

  // Exporter les collections au format JSON
  async exportCollectionsAsJSON(): Promise<string> {
    try {
      const collections = await this.getCollectionsWithData();
      const exportData = {
        exportDate: new Date().toISOString(),
        database: this.config?.database || 'unknown',
        collections: collections,
      };
      
      return JSON.stringify(exportData, null, 2);
    } catch (error) {
      console.error('Failed to export collections:', error);
      throw error;
    }
  }

  // Récupérer les statistiques de la base de données (simulation)
  async getDatabaseStats(): Promise<any> {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      return {
        totalCollections: 2,
        totalDocuments: 37,
        totalSize: '2.4 MB',
        avgLatency: '45ms'
      };
    } catch (error) {
      console.error('Failed to get database stats:', error);
      throw error;
    }
  }
}

export const mongoConfigService = new MongoConfigService();
