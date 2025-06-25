
// Service pour géocoder les adresses en coordonnées
export interface Coordinates {
  lat: number;
  lon: number;
}

// Cache pour éviter trop d'appels à l'API
const geocodeCache = new Map<string, Coordinates>();

// Fonction pour géocoder une adresse en utilisant l'API Nominatim (gratuite)
export const geocodeAddress = async (address: string): Promise<Coordinates | null> => {
  // Vérifier le cache d'abord
  if (geocodeCache.has(address)) {
    return geocodeCache.get(address) || null;
  }

  try {
    const encodedAddress = encodeURIComponent(address);
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}&limit=1&countrycodes=fr`
    );
    
    if (!response.ok) {
      throw new Error('Erreur lors du géocodage');
    }
    
    const data = await response.json();
    
    if (data && data.length > 0) {
      const coordinates = {
        lat: parseFloat(data[0].lat),
        lon: parseFloat(data[0].lon)
      };
      
      // Mettre en cache pour éviter les appels répétés
      geocodeCache.set(address, coordinates);
      return coordinates;
    }
    
    return null;
  } catch (error) {
    console.error('Erreur lors du géocodage de l\'adresse:', address, error);
    return null;
  }
};

// Fonction pour obtenir des coordonnées par défaut pour Paris
export const getDefaultCoordinates = (): Coordinates => {
  return {
    lat: 48.8566,
    lon: 2.3522
  };
};

// Fonction pour géocoder plusieurs adresses en lot
export const geocodeMultipleAddresses = async (addresses: string[]): Promise<Map<string, Coordinates>> => {
  const results = new Map<string, Coordinates>();
  
  for (const address of addresses) {
    const coords = await geocodeAddress(address);
    if (coords) {
      results.set(address, coords);
    }
    
    // Petit délai pour éviter de surcharger l'API
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  return results;
};
