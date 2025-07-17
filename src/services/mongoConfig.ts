
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

  // Effectuer une requête HTTP avec gestion SSL
  private async makeRequest(endpoint: string, options: RequestInit = {}): Promise<Response> {
    const requestOptions = {
      ...options,
      // Ignorer les erreurs de certificat SSL pour les requêtes HTTP
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    try {
      console.log(`🌐 Making request to: ${this.baseUrl}${endpoint}`);
      const response = await fetch(`${this.baseUrl}${endpoint}`, requestOptions);
      return response;
    } catch (error) {
      console.error('❌ Request failed:', error);
      throw error;
    }
  }

  // Tester la connexion MongoDB avec gestion des certificats SSL
  async testConnection(config: MongoConfig): Promise<MongoConnectionTest> {
    try {
      console.log('🔍 Testing MongoDB connection with config:', config);
      
      const connectionUrl = this.buildConnectionUrl(config);
      console.log('🔗 Generated connection URL:', connectionUrl);
      
      const response = await this.makeRequest('/api/test-connection', {
        method: 'POST',
        body: JSON.stringify({
          connectionUrl: connectionUrl,
          database: config.database,
          allowInvalidCertificates: config.allowInvalidCertificates || false,
        }),
      });

      console.log('📡 Response status:', response.status, response.statusText);

      const result = await response.json();
      console.log('📊 Response data:', result);
      
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
      console.error('❌ MongoDB connection test failed:', error);
      return {
        success: false,
        message: `Erreur de connexion: ${error instanceof Error ? error.message : 'Erreur inconnue'}. Essayez d'activer "Autoriser les certificats invalides" dans la configuration.`,
      };
    }
  }

  // Récupérer toutes les collections avec leurs documents
  async getCollectionsWithData(): Promise<MongoCollection[]> {
    try {
      const config = this.getConfig();
      if (!config) {
        throw new Error('Configuration MongoDB non trouvée');
      }

      const connectionUrl = this.buildConnectionUrl(config);
      
      const response = await this.makeRequest('/api/collections-data', {
        method: 'POST',
        body: JSON.stringify({
          connectionUrl: connectionUrl,
          database: config.database,
          allowInvalidCertificates: config.allowInvalidCertificates || false,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        return result.collections || [];
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Erreur lors de la récupération des collections');
      }
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

  // Récupérer les statistiques de la base de données
  async getDatabaseStats(): Promise<any> {
    try {
      const response = await this.makeRequest('/api/database-stats');
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
