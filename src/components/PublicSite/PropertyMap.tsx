
import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { geocodeAddress, getDefaultCoordinates, type Coordinates } from '@/services/geocodingService';

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
  const [propertyCoordinates, setPropertyCoordinates] = useState<Map<string, Coordinates>>(new Map());

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

  // Géocoder les adresses des propriétés
  useEffect(() => {
    const geocodeProperties = async () => {
      const coordinates = new Map<string, Coordinates>();
      
      for (const property of properties) {
        if (property.address && !propertyCoordinates.has(property.id)) {
          try {
            const coords = await geocodeAddress(property.address);
            if (coords) {
              coordinates.set(property.id, coords);
            } else {
              // Utiliser des coordonnées par défaut avec un léger décalage
              const defaultCoords = getDefaultCoordinates();
              const offset = (Math.random() - 0.5) * 0.01; // Décalage aléatoire léger
              coordinates.set(property.id, {
                lat: defaultCoords.lat + offset,
                lon: defaultCoords.lon + offset
              });
            }
          } catch (error) {
            console.error('Erreur lors du géocodage pour', property.address, error);
          }
          
          // Petit délai pour éviter de surcharger l'API
          await new Promise(resolve => setTimeout(resolve, 200));
        }
      }
      
      if (coordinates.size > 0) {
        setPropertyCoordinates(prev => new Map([...prev, ...coordinates]));
      }
    };

    if (properties.length > 0) {
      geocodeProperties();
    }
  }, [properties]);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Initialize the map
    const defaultCoords = getDefaultCoordinates();
    mapInstanceRef.current = L.map(mapRef.current).setView([defaultCoords.lat, defaultCoords.lon], 12);

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
    if (!mapInstanceRef.current || !properties || properties.length === 0) return;

    // Clear existing markers
    markersRef.current.forEach(marker => {
      mapInstanceRef.current?.removeLayer(marker);
    });
    markersRef.current = [];

    // Add markers for each property
    properties.forEach((property) => {
      const coords = propertyCoordinates.get(property.id);
      if (!coords) return; // Skip if no coordinates available yet
      
      // Create custom icon based on property status
      const customIcon = L.divIcon({
        className: 'custom-marker',
        html: `
          <div style="
            background-color: ${getStatusColor(property.status)};
            width: 35px;
            height: 35px;
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 11px;
            color: white;
            font-weight: bold;
            cursor: pointer;
          ">
            ${property.rent}€
          </div>
        `,
        iconSize: [35, 35],
        iconAnchor: [17.5, 17.5]
      });

      const marker = L.marker([coords.lat, coords.lon], { icon: customIcon })
        .addTo(mapInstanceRef.current!);

      // Create popup content
      const popupContent = `
        <div style="min-width: 280px; max-width: 320px;">
          <div style="margin-bottom: 8px;">
            <img 
              src="${property.image && property.image !== '/placeholder.svg' ? property.image : '/placeholder.svg'}" 
              alt="${property.title}"
              style="width: 100%; height: 140px; object-fit: cover; border-radius: 6px;"
              onerror="this.style.display='none'"
            />
          </div>
          <h4 style="margin: 0 0 8px 0; font-weight: 600; font-size: 16px; color: #1f2937;">${property.title}</h4>
          <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px; display: flex; align-items: center;">
            <span style="margin-right: 4px;">📍</span> ${property.address}
          </p>
          <div style="display: flex; gap: 12px; margin-bottom: 8px; font-size: 13px; color: #6b7280;">
            <span>📐 ${property.surface}m²</span>
            <span>🏠 ${property.type}</span>
            ${property.locationType ? `<span>• ${property.locationType}</span>` : ''}
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 12px;">
            <div style="font-size: 18px; font-weight: 600; color: #059669;">
              💰 ${property.rent}€/mois
            </div>
            <span style="
              padding: 4px 12px; 
              border-radius: 16px; 
              font-size: 12px;
              font-weight: 500;
              background-color: ${property.status === 'Libre' ? '#D1FAE5' : '#F3F4F6'};
              color: ${property.status === 'Libre' ? '#065F46' : '#374151'};
            ">
              ${property.status}
            </span>
          </div>
          <div style="margin-top: 12px; text-align: center;">
            <button 
              onclick="window.selectProperty && window.selectProperty('${property.id}')"
              style="
                background-color: #2563eb;
                color: white;
                border: none;
                padding: 8px 16px;
                border-radius: 6px;
                font-size: 14px;
                font-weight: 500;
                cursor: pointer;
                transition: background-color 0.2s;
              "
              onmouseover="this.style.backgroundColor='#1d4ed8'"
              onmouseout="this.style.backgroundColor='#2563eb'"
            >
              Voir les détails
            </button>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent, {
        maxWidth: 320,
        className: 'property-popup'
      });

      // Handle marker click
      marker.on('click', () => {
        if (onPropertySelect) {
          onPropertySelect(property);
        }
      });

      markersRef.current.push(marker);
    });

    // Set up global function for popup button clicks
    (window as any).selectProperty = (propertyId: string) => {
      const property = properties.find(p => p.id === propertyId);
      if (property && onPropertySelect) {
        onPropertySelect(property);
      }
    };

    // If there are properties with coordinates, fit the map to show all markers
    const validCoordinates = properties
      .map(p => propertyCoordinates.get(p.id))
      .filter(coords => coords !== undefined);
    
    if (validCoordinates.length > 0) {
      const group = new L.featureGroup(markersRef.current);
      const bounds = group.getBounds();
      if (bounds.isValid()) {
        mapInstanceRef.current.fitBounds(bounds.pad(0.1));
      }
    }

  }, [properties, propertyCoordinates, onPropertySelect]);

  // Handle selected property
  useEffect(() => {
    if (!selectedProperty || !mapInstanceRef.current) return;

    const coords = propertyCoordinates.get(selectedProperty.id);
    if (coords) {
      mapInstanceRef.current.setView([coords.lat, coords.lon], 15);
      
      // Find and open the popup for the selected property
      const propertyIndex = properties.findIndex(p => p.id === selectedProperty.id);
      if (propertyIndex !== -1 && markersRef.current[propertyIndex]) {
        markersRef.current[propertyIndex].openPopup();
      }
    }
  }, [selectedProperty, properties, propertyCoordinates]);

  return (
    <div className="w-full h-96 rounded-lg overflow-hidden shadow-lg">
      <div ref={mapRef} className="w-full h-full" />
      <style>{`
        .property-popup .leaflet-popup-content-wrapper {
          border-radius: 8px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        .property-popup .leaflet-popup-tip {
          background: white;
        }
      `}</style>
    </div>
  );
};
