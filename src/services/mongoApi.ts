import { mongoConfigService } from './mongoConfig';

// Configuration de l'API MongoDB - utilise la configuration dynamique

// Types pour les propriétés MongoDB
export interface MongoProperty {
  _id: string;
  title: string;
  address: string;
  rent: number;
  surface: number;
  status: string;
  image?: string;
  images?: string[];
  description?: string;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
}

// Types pour les paramètres du site web
export interface PropertyWebsiteSettings {
  propertyId: string;
  visible: boolean;
  description: string;
  featured: boolean;
}

class MongoApiService {
  private getBaseUrl(): string {
    const config = mongoConfigService.getConfig();
    if (config) {
      // Utilise l'URL configurée pour MongoDB
      return `https://${config.host}:${config.port === 27017 ? '30443' : config.port}`;
    }
    // Fallback vers l'URL par défaut
    return 'https://mongodb.neotech-consulting.com:30443';
  }

  private getAuthHeaders(): Record<string, string> {
    const config = mongoConfigService.getConfig();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (config?.username && config?.password) {
      const credentials = btoa(`${config.username}:${config.password}`);
      headers['Authorization'] = `Basic ${credentials}`;
    }
    
    return headers;
  }

  private async makeMongoRequest(endpoint: string, options: RequestInit = {}): Promise<Response> {
    const baseUrl = this.getBaseUrl();
    const headers = this.getAuthHeaders();
    
    const config = mongoConfigService.getConfig();
    const requestOptions: RequestInit = {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    };

    console.log(`🌐 Making MongoDB request to: ${baseUrl}${endpoint}`);
    
    try {
      const response = await fetch(`${baseUrl}${endpoint}`, requestOptions);
      return response;
    } catch (error) {
      console.error('❌ MongoDB request failed:', error);
      throw error;
    }
  }

  // Méthodes pour les propriétés
  async getProperties(): Promise<MongoProperty[]> {
    try {
      const response = await this.makeMongoRequest('/api/properties');
      if (!response.ok) {
        // Si l'API n'est pas disponible, retourner des données de test
        console.warn('MongoDB API not available, returning mock data');
        return this.getMockProperties();
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching properties:', error);
      // Retourner des données de test en cas d'erreur
      return this.getMockProperties();
    }
  }

  private getMockProperties(): MongoProperty[] {
    // Essayer de récupérer depuis le localStorage d'abord
    const stored = localStorage.getItem('mongoProperties');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (error) {
        console.error('Error parsing stored properties:', error);
      }
    }
    
    // Données par défaut
    return [
      {
        _id: '1',
        title: 'Appartement 2 pièces - Centre ville',
        address: '15 Rue de la Paix, 75001 Paris',
        rent: 1200,
        surface: 45,
        status: 'available',
        description: 'Bel appartement rénové en centre ville',
        ownerId: 'vtsAWmNBdpdLgcvHAIystSpv3qD2',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15')
      },
      {
        _id: '2', 
        title: 'Studio moderne - Quartier Latin',
        address: '8 Rue Saint-Jacques, 75005 Paris',
        rent: 850,
        surface: 25,
        status: 'rented',
        description: 'Studio moderne avec cuisine équipée',
        ownerId: 'vtsAWmNBdpdLgcvHAIystSpv3qD2',
        createdAt: new Date('2024-02-10'),
        updatedAt: new Date('2024-02-10')
      }
    ];
  }

  async getPropertyById(id: string): Promise<MongoProperty> {
    try {
      const response = await this.makeMongoRequest(`/api/properties/${id}`);
      if (!response.ok) {
        // Retourner une propriété de test
        const mockProperties = this.getMockProperties();
        const property = mockProperties.find(p => p._id === id);
        if (property) return property;
        throw new Error('Property not found');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching property:', error);
      throw error;
    }
  }

  async getPropertiesByOwner(ownerId: string): Promise<MongoProperty[]> {
    try {
      const response = await this.makeMongoRequest(`/api/properties/owner/${ownerId}`);
      if (!response.ok) {
        // Retourner les propriétés de test filtrées par owner
        const mockProperties = this.getMockProperties();
        return mockProperties.filter(p => p.ownerId === ownerId);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching owner properties:', error);
      const mockProperties = this.getMockProperties();
      return mockProperties.filter(p => p.ownerId === ownerId);
    }
  }

  // Méthodes pour les paramètres du site web
  async getWebsiteSettings(): Promise<PropertyWebsiteSettings[]> {
    try {
      const response = await this.makeMongoRequest('/api/website-settings');
      if (!response.ok) {
        // Retourner des settings de test
        return this.getMockWebsiteSettings();
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching website settings:', error);
      return this.getMockWebsiteSettings();
    }
  }

  private getMockWebsiteSettings(): PropertyWebsiteSettings[] {
    // Essayer de récupérer depuis le localStorage d'abord
    const stored = localStorage.getItem('websiteSettings');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (error) {
        console.error('Error parsing stored website settings:', error);
      }
    }
    
    // Données par défaut
    return [
      {
        propertyId: '1',
        visible: true,
        description: 'Appartement moderne en centre ville',
        featured: true
      },
      {
        propertyId: '2',
        visible: false,
        description: 'Studio confortable',
        featured: false
      }
    ];
  }

  async saveWebsiteSettings(settings: PropertyWebsiteSettings[]): Promise<void> {
    try {
      const response = await this.makeMongoRequest('/api/website-settings', {
        method: 'POST',
        body: JSON.stringify(settings),
      });
      
      if (!response.ok) {
        console.warn('Could not save to MongoDB API, saving locally');
        // Sauvegarder localement pour l'instant
        localStorage.setItem('websiteSettings', JSON.stringify(settings));
        return;
      }
    } catch (error) {
      console.error('Error saving website settings:', error);
      // Sauvegarder localement en cas d'erreur
      localStorage.setItem('websiteSettings', JSON.stringify(settings));
    }
  }

  async updatePropertyWebsiteSettings(propertyId: string, settings: Partial<PropertyWebsiteSettings>): Promise<void> {
    try {
      const response = await this.makeMongoRequest(`/api/website-settings/${propertyId}`, {
        method: 'PUT',
        body: JSON.stringify(settings),
      });
      
      if (!response.ok) {
        console.warn('Could not update MongoDB API, updating locally');
        // Mettre à jour localement
        const currentSettings = this.getMockWebsiteSettings();
        const updatedSettings = currentSettings.map(s => 
          s.propertyId === propertyId ? { ...s, ...settings } : s
        );
        localStorage.setItem('websiteSettings', JSON.stringify(updatedSettings));
        return;
      }
    } catch (error) {
      console.error('Error updating property website settings:', error);
    }
  }

  // Méthode utilitaire pour vérifier la connexion
  async healthCheck(): Promise<boolean> {
    try {
      const response = await this.makeMongoRequest('/api/health');
      return response.ok;
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  }

  // Récupérer la liste des collections MongoDB
  async getCollections(): Promise<any[]> {
    try {
      console.log('🔍 Fetching collections from MongoDB API...');
      const response = await this.makeMongoRequest('/api/collections');
      console.log('📡 Collections API response status:', response.status, response.statusText);
      
      if (!response.ok) {
        console.warn('❌ Could not fetch collections from MongoDB API, status:', response.status);
        console.warn('Response headers:', Object.fromEntries(response.headers.entries()));
        const errorText = await response.text();
        console.warn('Response body:', errorText);
        return [];
      }
      
      const collections = await response.json();
      console.log('✅ Collections fetched successfully:', collections);
      return collections;
    } catch (error) {
      console.error('❌ Error fetching collections:', error);
      console.error('Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
      return [];
    }
  }

  // Nouvelle méthode pour créer une propriété
  async createProperty(property: Omit<MongoProperty, '_id' | 'createdAt' | 'updatedAt'>): Promise<MongoProperty> {
    try {
      const response = await this.makeMongoRequest('/api/properties', {
        method: 'POST',
        body: JSON.stringify(property),
      });
      
      if (!response.ok) {
        // Créer localement avec un ID temporaire
        const newProperty: MongoProperty = {
          ...property,
          _id: Date.now().toString(),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        
        // Sauvegarder localement
        const existingProperties = this.getMockProperties();
        const allProperties = [...existingProperties, newProperty];
        localStorage.setItem('mongoProperties', JSON.stringify(allProperties));
        
        return newProperty;
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating property:', error);
      throw error;
    }
  }

  // Nouvelle méthode pour mettre à jour une propriété
  async updateProperty(id: string, updates: Partial<MongoProperty>): Promise<MongoProperty> {
    try {
      const response = await this.makeMongoRequest(`/api/properties/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
      
      if (!response.ok) {
        // Mettre à jour localement
        const properties = this.getMockProperties();
        const updatedProperties = properties.map(p => 
          p._id === id ? { ...p, ...updates, updatedAt: new Date() } : p
        );
        localStorage.setItem('mongoProperties', JSON.stringify(updatedProperties));
        
        const updatedProperty = updatedProperties.find(p => p._id === id);
        if (!updatedProperty) throw new Error('Property not found');
        return updatedProperty;
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating property:', error);
      throw error;
    }
  }

  // Nouvelle méthode pour supprimer une propriété
  async deleteProperty(id: string): Promise<void> {
    try {
      const response = await this.makeMongoRequest(`/api/properties/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        // Supprimer localement
        const properties = this.getMockProperties();
        const filteredProperties = properties.filter(p => p._id !== id);
        localStorage.setItem('mongoProperties', JSON.stringify(filteredProperties));
        return;
      }
    } catch (error) {
      console.error('Error deleting property:', error);
      throw error;
    }
  }
}

export const mongoApi = new MongoApiService();
