
import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Euro, Square, Building } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// Fix for default markers in Leaflet with webpack
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png',
});

interface PropertyMapProps {
  properties: any[];
  selectedProperty?: any;
  onPropertySelect?: (property: any) => void;
}

export const PropertyMap: React.FC<PropertyMapProps> = ({
  properties,
  selectedProperty,
  onPropertySelect
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  // Fonction pour obtenir les coordonnées approximatives basées sur l'adresse
  const getPropertyCoordinates = (property: any, index: number) => {
    // Coordonnées de base pour Paris avec variation pour chaque propriété
    const baseLat = 48.8566;
    const baseLon = 2.3522;
    
    // Ajouter une variation basée sur l'index pour simuler différentes positions
    const latOffset = (index % 10 - 5) * 0.01;
    const lonOffset = ((index * 3) % 10 - 5) * 0.01;
    
    return {
      lat: baseLat + latOffset,
      lon: baseLon + lonOffset
    };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Libre':
        return '#10B981'; // green
      case 'Occupé':
        return '#6B7280'; // gray
      default:
        return '#6B7280';
    }
  };

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Initialize the map
    const lat = 48.8566;
    const lon = 2.3522;

    mapInstanceRef.current = L.map(mapRef.current).setView([lat, lon], 12);

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
      attribution: 'données © <a href="//osm.org/copyright">OpenStreetMap</a>/ODbL - rendu <a href="//openstreetmap.fr">OSM France</a>',
      minZoom: 1,
      maxZoom: 20
    }).addTo(mapInstanceRef.current);

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current || !properties) return;

    // Clear existing markers
    markersRef.current.forEach(marker => {
      mapInstanceRef.current?.removeLayer(marker);
    });
    markersRef.current = [];

    // Add markers for each property
    properties.forEach((property, index) => {
      const coords = getPropertyCoordinates(property, index);
      
      // Create custom icon based on property status
      const customIcon = L.divIcon({
        className: 'custom-marker',
        html: `
          <div style="
            background-color: ${getStatusColor(property.status)};
            width: 30px;
            height: 30px;
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            color: white;
            font-weight: bold;
          ">
            ${property.rent || '0'}€
          </div>
        `,
        iconSize: [30, 30],
        iconAnchor: [15, 15]
      });

      const marker = L.marker([coords.lat, coords.lon], { icon: customIcon })
        .addTo(mapInstanceRef.current!);

      // Create popup content
      const popupContent = `
        <div style="min-width: 250px;">
          <div style="margin-bottom: 8px;">
            <img 
              src="${property.image && property.image !== '/placeholder.svg' ? property.image : '/placeholder.svg'}" 
              alt="${property.title}"
              style="width: 100%; height: 120px; object-fit: cover; border-radius: 6px;"
            />
          </div>
          <h4 style="margin: 0 0 8px 0; font-weight: 600; font-size: 16px;">${property.title}</h4>
          <p style="margin: 0 0 8px 0; color: #666; font-size: 14px; display: flex; align-items: center;">
            <span style="margin-right: 4px;">📍</span> ${property.address}
          </p>
          <div style="display: flex; gap: 12px; margin-bottom: 8px; font-size: 13px; color: #666;">
            <span>${property.surface}m²</span>
            <span>${property.type}</span>
            ${property.locationType ? `<span>${property.locationType}</span>` : ''}
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div style="font-size: 18px; font-weight: 600; color: #059669;">
              ${property.rent}€/mois
            </div>
            <span style="
              padding: 2px 8px; 
              border-radius: 12px; 
              font-size: 12px;
              background-color: ${property.status === 'Libre' ? '#D1FAE5' : '#F3F4F6'};
              color: ${property.status === 'Libre' ? '#065F46' : '#374151'};
            ">
              ${property.status}
            </span>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent);

      // Handle marker click
      marker.on('click', () => {
        if (onPropertySelect) {
          onPropertySelect(property);
        }
      });

      markersRef.current.push(marker);
    });

    // If there are properties, fit the map to show all markers
    if (properties.length > 0) {
      const group = new L.featureGroup(markersRef.current);
      mapInstanceRef.current.fitBounds(group.getBounds().pad(0.1));
    }

  }, [properties, onPropertySelect]);

  // Handle selected property
  useEffect(() => {
    if (!selectedProperty || !mapInstanceRef.current) return;

    const propertyIndex = properties.findIndex(p => p.id === selectedProperty.id);
    if (propertyIndex !== -1) {
      const coords = getPropertyCoordinates(selectedProperty, propertyIndex);
      mapInstanceRef.current.setView([coords.lat, coords.lon], 15);
      
      // Open the popup for the selected property
      if (markersRef.current[propertyIndex]) {
        markersRef.current[propertyIndex].openPopup();
      }
    }
  }, [selectedProperty, properties]);

  return (
    <div className="w-full h-96 rounded-lg overflow-hidden shadow-lg">
      <div ref={mapRef} className="w-full h-full" />
    </div>
  );
};
