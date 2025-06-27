
import React from 'react';
import { Button } from '@/components/ui/button';
import { PropertyImageGallery } from './PropertyImageGallery';
import { PropertyInfoSection } from './PropertyInfoSection';
import { PropertyContactSection } from './PropertyContactSection';

interface PropertyDetailsContentProps {
  property: any;
  onScheduleVisit: () => void;
  onClose: () => void;
}

export const PropertyDetailsContent = ({ 
  property, 
  onScheduleVisit, 
  onClose 
}: PropertyDetailsContentProps) => {
  // Get property settings to check for custom description
  const getPropertySettings = () => {
    try {
      const savedSettings = localStorage.getItem('propertyWebsiteSettings');
      return savedSettings ? JSON.parse(savedSettings) : {};
    } catch (error) {
      console.error('Error loading property settings:', error);
      return {};
    }
  };

  const propertySettings = getPropertySettings();
  const settings = propertySettings[property.id] || {};

  return (
    <div className="space-y-6">
      {/* Image gallery */}
      <PropertyImageGallery property={property} />

      {/* Informations principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PropertyInfoSection property={property} />
        <PropertyContactSection property={property} onScheduleVisit={onScheduleVisit} />
      </div>

      {/* Description */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Description
        </h3>
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-gray-700 text-sm leading-relaxed">
            {settings.description || (
              property.locationType === 'Colocation' 
                ? `Belle ${property.type.toLowerCase()} en colocation de ${property.surface}m² située ${property.address}. ${property.totalRooms} chambres disponibles dans un environnement convivial et moderne.`
                : `Magnifique ${property.type.toLowerCase()} de ${property.surface}m² situé ${property.address}. Idéal pour une personne recherchant confort et praticité dans un quartier dynamique.`
            )}
          </p>
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t">
        <Button variant="outline" onClick={onClose}>
          Fermer
        </Button>
      </div>
    </div>
  );
};
