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
    
    if (params.length > 0) {
      url += `?${params.join('&')}`;
    }
    
    return url;
  }

  // Tester la connexion MongoDB avec gestion des certificats SSL
  async testConnection(config: MongoConfig): Promise<MongoConnectionTest> {
    try {
      console.log('🔍 Testing MongoDB connection with config:', config);
      
      const connectionUrl = this.buildConnectionUrl(config);
      console.log('🔗 Generated connection URL:', connectionUrl);
      console.log('🌐 API endpoint:', `${this.baseUrl}/api/test-connection`);
      
      // Première tentative avec HTTPS
      let response;
      try {
        response = await fetch(`${this.baseUrl}/api/test-connection`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            connectionUrl: connectionUrl,
            database: config.database,
          }),
        });
      } catch (httpsError) {
        console.warn('⚠️ HTTPS request failed, this might be due to SSL certificate issues:', httpsError);
        
        // Si HTTPS échoue, informer l'utilisateur du problème
        return {
          success: false,
          message: 'Erreur SSL: Le serveur utilise un certificat invalide. Pour résoudre ce problème, vous devez soit : 1) Configurer un certificat SSL valide sur le serveur, 2) Accéder manuellement à https://161.97.108.157:30433 dans votre navigateur et accepter le certificat, 3) Utiliser un proxy HTTPS.',
        };
      }

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
