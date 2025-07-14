
// Configuration de l'API MongoDB
const MONGODB_API_BASE_URL = 'https://161.97.108.157:30433';

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
  private baseUrl: string;

  constructor(baseUrl: string = MONGODB_API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  // Méthodes pour les propriétés
  async getProperties(): Promise<MongoProperty[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/properties`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching properties:', error);
      throw error;
    }
  }

  async getPropertyById(id: string): Promise<MongoProperty> {
    try {
      const response = await fetch(`${this.baseUrl}/api/properties/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching property:', error);
      throw error;
    }
  }

  async getPropertiesByOwner(ownerId: string): Promise<MongoProperty[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/properties/owner/${ownerId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching owner properties:', error);
      throw error;
    }
  }

  // Méthodes pour les paramètres du site web
  async getWebsiteSettings(): Promise<PropertyWebsiteSettings[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/website-settings`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching website settings:', error);
      throw error;
    }
  }

  async saveWebsiteSettings(settings: PropertyWebsiteSettings[]): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/api/website-settings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error saving website settings:', error);
      throw error;
    }
  }

  async updatePropertyWebsiteSettings(propertyId: string, settings: Partial<PropertyWebsiteSettings>): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/api/website-settings/${propertyId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error updating property website settings:', error);
      throw error;
    }
  }

  // Méthode utilitaire pour vérifier la connexion
  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/health`);
      return response.ok;
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  }
}

export const mongoApi = new MongoApiService();
