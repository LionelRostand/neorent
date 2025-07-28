import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

// Fix pour les icônes Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface OpenStreetMapProps {
  address?: string;
  streetNumber?: string;
  street?: string;
  city?: string;
  postalCode?: string;
  onLocationSelect?: (coordinates: [number, number]) => void;
}

const OpenStreetMap = ({ 
  address, 
  streetNumber, 
  street, 
  city, 
  postalCode,
  onLocationSelect 
}: OpenStreetMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const marker = useRef<L.Marker | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [geocodeStatus, setGeocodeStatus] = useState<string>('');

  // Construire l'adresse complète
  const fullAddress = address || (streetNumber && street && city && postalCode 
    ? `${streetNumber} ${street}, ${postalCode} ${city}`
    : '');

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialiser la carte centrée sur la France
    map.current = L.map(mapContainer.current).setView([48.8566, 2.3522], 6);

    // Ajouter les tuiles OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map.current);

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  const geocodeAddress = async (addressToGeocode: string) => {
    if (!addressToGeocode.trim()) return;

    setIsLoading(true);
    setGeocodeStatus('Recherche en cours...');

    try {
      // Utiliser Nominatim avec différentes variantes de l'adresse
      const queries = [
        addressToGeocode,
        `${streetNumber} ${street} ${city}`,
        `${street} ${city}`,
        `${city} ${postalCode}`
      ].filter(Boolean);

      let found = false;

      for (const query of queries) {
        if (found) break;

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&countrycodes=fr&addressdetails=1`
          );
          
          if (!response.ok) continue;
          
          const data = await response.json();
          
          if (data && data.length > 0) {
            // Prioriser les résultats avec une correspondance exacte
            let bestResult = data[0];
            
            // Chercher une correspondance plus précise
            for (const result of data) {
              if (result.display_name.toLowerCase().includes(street?.toLowerCase() || '') &&
                  result.display_name.toLowerCase().includes(city?.toLowerCase() || '')) {
                bestResult = result;
                break;
              }
            }

            const latitude = parseFloat(bestResult.lat);
            const longitude = parseFloat(bestResult.lon);
            
            if (map.current && !isNaN(latitude) && !isNaN(longitude)) {
              map.current.setView([latitude, longitude], 16);

              // Supprimer l'ancien marqueur
              if (marker.current) {
                map.current.removeLayer(marker.current);
              }

              // Ajouter un nouveau marqueur
              marker.current = L.marker([latitude, longitude]).addTo(map.current);
              marker.current.bindPopup(`
                <div>
                  <strong>${addressToGeocode}</strong><br/>
                  <small>${bestResult.display_name}</small>
                </div>
              `).openPopup();

              // Callback avec les coordonnées
              if (onLocationSelect) {
                onLocationSelect([longitude, latitude]);
              }

              setGeocodeStatus(`Adresse trouvée: ${bestResult.display_name}`);
              found = true;
            }
          }
        } catch (err) {
          console.log(`Tentative échouée pour: ${query}`);
        }

        // Attendre un peu entre les requêtes pour respecter les limites
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      if (!found) {
        setGeocodeStatus('Adresse non trouvée. Essayez avec une adresse plus simple (ex: rue + ville)');
      }
    } catch (error) {
      console.error('Erreur de géocodage:', error);
      setGeocodeStatus('Erreur lors de la recherche');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    if (fullAddress) {
      geocodeAddress(fullAddress);
    }
  };

  useEffect(() => {
    if (fullAddress && streetNumber && street && city) {
      geocodeAddress(fullAddress);
    }
  }, [fullAddress]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Button 
          onClick={handleSearch} 
          disabled={!fullAddress || isLoading}
          size="sm"
        >
          {isLoading ? 'Recherche...' : 'Localiser sur carte'}
        </Button>
        {geocodeStatus && (
          <span className="text-sm text-muted-foreground">
            {geocodeStatus}
          </span>
        )}
      </div>
      
      <div 
        ref={mapContainer} 
        className="w-full h-64 rounded-lg border"
      />
      
      {fullAddress && (
        <p className="text-sm text-muted-foreground">
          Adresse à localiser: <strong>{fullAddress}</strong>
        </p>
      )}
    </div>
  );
};

export default OpenStreetMap;