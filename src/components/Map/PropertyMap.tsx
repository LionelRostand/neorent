import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface PropertyMapProps {
  address?: string;
  streetNumber?: string;
  street?: string;
  city?: string;
  postalCode?: string;
  onLocationSelect?: (coordinates: [number, number]) => void;
}

const PropertyMap = ({ 
  address, 
  streetNumber, 
  street, 
  city, 
  postalCode,
  onLocationSelect 
}: PropertyMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
  const [mapboxToken, setMapboxToken] = useState('');
  const [isMapInitialized, setIsMapInitialized] = useState(false);

  // Construire l'adresse complète
  const fullAddress = address || (streetNumber && street && city && postalCode 
    ? `${streetNumber} ${street}, ${city} ${postalCode}`
    : '');

  const initializeMap = () => {
    if (!mapContainer.current || !mapboxToken.trim()) return;

    mapboxgl.accessToken = mapboxToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [2.3522, 48.8566], // Paris par défaut
      zoom: 12
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
    setIsMapInitialized(true);
  };

  const geocodeAddress = async (addressToGeocode: string) => {
    if (!addressToGeocode.trim() || !mapboxToken.trim()) return;

    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(addressToGeocode)}.json?access_token=${mapboxToken}&country=FR`
      );
      
      if (!response.ok) throw new Error('Geocoding failed');
      
      const data = await response.json();
      
      if (data.features && data.features.length > 0) {
        const [longitude, latitude] = data.features[0].center;
        
        if (map.current) {
          map.current.flyTo({
            center: [longitude, latitude],
            zoom: 16
          });

          // Supprimer l'ancien marqueur
          if (marker.current) {
            marker.current.remove();
          }

          // Ajouter un nouveau marqueur
          marker.current = new mapboxgl.Marker()
            .setLngLat([longitude, latitude])
            .addTo(map.current);

          // Callback avec les coordonnées
          if (onLocationSelect) {
            onLocationSelect([longitude, latitude]);
          }
        }
      }
    } catch (error) {
      console.error('Erreur de géocodage:', error);
    }
  };

  useEffect(() => {
    if (isMapInitialized && fullAddress) {
      geocodeAddress(fullAddress);
    }
  }, [fullAddress, isMapInitialized]);

  return (
    <div className="space-y-4">
      {!isMapInitialized && (
        <div className="space-y-2">
          <Label htmlFor="mapbox-token">
            Token Mapbox Public
          </Label>
          <div className="flex gap-2">
            <Input
              id="mapbox-token"
              type="password"
              value={mapboxToken}
              onChange={(e) => setMapboxToken(e.target.value)}
              placeholder="Entrez votre token Mapbox public"
              className="flex-1"
            />
            <Button onClick={initializeMap} disabled={!mapboxToken.trim()}>
              Initialiser
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Obtenez votre token gratuit sur{' '}
            <a 
              href="https://mapbox.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              mapbox.com
            </a>
          </p>
        </div>
      )}
      
      <div 
        ref={mapContainer} 
        className="w-full h-64 rounded-lg border"
        style={{ display: isMapInitialized ? 'block' : 'none' }}
      />
    </div>
  );
};

export default PropertyMap;