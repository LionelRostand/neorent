
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
    // Créer plusieurs variantes de recherche pour améliorer les chances de trouver l'adresse
    const searchQueries = generateSearchQueries(address);
    
    for (const query of searchQueries) {
      console.log(`🔍 Tentative de géocodage avec: "${query}"`);
      
      const encodedAddress = encodeURIComponent(query);
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}&limit=5&countrycodes=fr&addressdetails=1`
      );
      
      if (!response.ok) {
        continue; // Essayer la requête suivante
      }
      
      const data = await response.json();
      
      if (data && data.length > 0) {
        // Prendre le premier résultat qui semble pertinent
        const bestResult = data[0];
        const coordinates = {
          lat: parseFloat(bestResult.lat),
          lon: parseFloat(bestResult.lon)
        };
        
        console.log(`✅ Adresse trouvée: ${bestResult.display_name}`);
        
        // Mettre en cache avec l'adresse originale
        geocodeCache.set(address, coordinates);
        return coordinates;
      }
      
      // Petit délai entre les requêtes pour éviter de surcharger l'API
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    console.log(`❌ Aucune coordonnée trouvée pour: ${address}`);
    return null;
  } catch (error) {
    console.error('Erreur lors du géocodage de l\'adresse:', address, error);
    return null;
  }
};

// Fonction pour générer plusieurs variantes de recherche d'une adresse
const generateSearchQueries = (address: string): string[] => {
  const queries: string[] = [];
  
  // 1. Adresse complète originale
  queries.push(address);
  
  // 2. Extraire les informations de l'adresse
  const parts = address.split(/\s+/);
  const postalCodeMatch = address.match(/\b\d{5}\b/);
  const postalCode = postalCodeMatch ? postalCodeMatch[0] : '';
  
  // 3. Recherche avec juste la ville et le code postal
  if (postalCode) {
    const cityPart = address.split(postalCode)[1]?.trim();
    if (cityPart) {
      queries.push(`${postalCode} ${cityPart}`);
      queries.push(cityPart);
    }
  }
  
  // 4. Recherche sans le nom de la résidence
  const withoutResidence = address.replace(/RESIDENCE\s+[A-Z\s']+/i, '').trim();
  if (withoutResidence !== address) {
    queries.push(withoutResidence);
  }
  
  // 5. Recherche simplifiée avec juste le nom de la ville
  const cityName = extractCityName(address);
  if (cityName) {
    queries.push(cityName);
  }
  
  // 6. Si c'est une résidence, essayer avec juste l'adresse de la rue
  const streetMatch = address.match(/(?:RUE|AVENUE|BOULEVARD|PLACE|IMPASSE)\s+[^,\d]+/i);
  if (streetMatch && postalCode) {
    const cityPart = address.split(postalCode)[1]?.trim();
    if (cityPart) {
      queries.push(`${streetMatch[0]} ${postalCode} ${cityPart}`);
    }
  }
  
  return queries.filter((q, index, arr) => arr.indexOf(q) === index); // Supprimer les doublons
};

// Fonction pour extraire le nom de la ville
const extractCityName = (address: string): string | null => {
  const postalCodeMatch = address.match(/\b\d{5}\b/);
  if (postalCodeMatch) {
    const afterPostalCode = address.split(postalCodeMatch[0])[1]?.trim();
    if (afterPostalCode) {
      // Nettoyer le nom de la ville
      return afterPostalCode.replace(/[^\w\s-]/g, '').trim();
    }
  }
  return null;
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
