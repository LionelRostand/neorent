
// Configuration MongoDB
export interface MongoConfig {
  host: string;
  port: number;
  database: string;
  username?: string;
  password?: string;
  authSource?: string;
  ssl?: boolean;
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

class MongoConfigService {
  private config: MongoConfig | null = null;
  private baseUrl: string = 'https://161.97.108.157:30433';

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
    if (config.username && config.password) {
      url += `${config.username}:${config.password}@`;
    }
    url += `${config.host}:${config.port}/${config.database}`;
    
    const params = [];
    if (config.authSource) params.push(`authSource=${config.authSource}`);
    if (config.ssl) params.push('ssl=true');
    
    if (params.length > 0) {
      url += `?${params.join('&')}`;
    }
    
    return url;
  }

  // Tester la connexion MongoDB
  async testConnection(config: MongoConfig): Promise<MongoConnectionTest> {
    try {
      console.log('Testing MongoDB connection with config:', config);
      
      const response = await fetch(`${this.baseUrl}/api/test-connection`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          connectionUrl: this.buildConnectionUrl(config),
          database: config.database,
        }),
      });

      const result = await response.json();
      
      if (response.ok) {
        return {
          success: true,
          message: 'Connexion réussie à MongoDB',
          details: {
            host: config.host,
            database: config.database,
            collections: result.collections || [],
            latency: result.latency || 0,
          },
        };
      } else {
        return {
          success: false,
          message: result.message || 'Erreur de connexion',
        };
      }
    } catch (error) {
      console.error('MongoDB connection test failed:', error);
      return {
        success: false,
        message: `Erreur de connexion: ${error instanceof Error ? error.message : 'Erreur inconnue'}`,
      };
    }
  }

  // Récupérer les statistiques de la base de données
  async getDatabaseStats(): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/api/database-stats`);
      if (response.ok) {
        return await response.json();
      }
      throw new Error('Erreur lors de la récupération des statistiques');
    } catch (error) {
      console.error('Failed to get database stats:', error);
      throw error;
    }
  }
}

export const mongoConfigService = new MongoConfigService();
