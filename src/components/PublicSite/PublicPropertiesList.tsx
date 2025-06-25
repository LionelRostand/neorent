
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PropertyDetailsModal } from './PropertyDetailsModal';
import { PropertyMap } from './PropertyMap';
import { useFirebaseProperties } from '@/hooks/useFirebaseProperties';
import { 
  MapPin, 
  Euro, 
  Bed, 
  Bath, 
  Square, 
  Building,
  Star,
  Image as ImageIcon,
  Map as MapIcon
} from 'lucide-react';

interface PublicPropertiesListProps {
  searchFilter: string;
}

export const PublicPropertiesList = ({ searchFilter }: PublicPropertiesListProps) => {
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showMap, setShowMap] = useState(false);
  
  // Utiliser les vraies propriétés depuis Firebase
  const { properties: allProperties, loading } = useFirebaseProperties();

  // Récupérer les paramètres de visibilité depuis le localStorage ou une API
  const getPropertySettings = () => {
    try {
      const savedSettings = localStorage.getItem('propertyWebsiteSettings');
      return savedSettings ? JSON.parse(savedSettings) : {};
    } catch (error) {
      return {};
    }
  };

  const propertySettings = getPropertySettings();

  // Filtrer les propriétés visibles et selon le terme de recherche
  const filteredProperties = allProperties?.filter(property => {
    // Vérifier si la propriété est visible sur le site web
    const settings = propertySettings[property.id];
    if (!settings?.visible) return false;
    
    if (!searchFilter) return true;
    
    const searchTerm = searchFilter.toLowerCase();
    return (
      property.title.toLowerCase().includes(searchTerm) ||
      property.address.toLowerCase().includes(searchTerm) ||
      property.type.toLowerCase().includes(searchTerm)
    );
  }) || [];

  // Trier les propriétés pour mettre en avant celles qui sont featured
  const sortedProperties = [...filteredProperties].sort((a, b) => {
    const aSettings = propertySettings[a.id];
    const bSettings = propertySettings[b.id];
    
    if (aSettings?.featured && !bSettings?.featured) return -1;
    if (!aSettings?.featured && bSettings?.featured) return 1;
    return 0;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Libre':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Occupé':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'En maintenance':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRoomInfo = (property: any) => {
    const rooms = property.locationType === 'Colocation' 
      ? property.totalRooms || 1
      : property.type === 'Studio' ? 1 : 2;
    const bathrooms = 1;
    return { rooms, bathrooms };
  };

  const handlePropertyClick = (property: any) => {
    setSelectedProperty(property);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProperty(null);
  };

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Chargement des propriétés...
            </h3>
          </div>
        </div>
      </section>
    );
  }

  if (sortedProperties.length === 0) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucune propriété trouvée
            </h3>
            <p className="text-gray-600">
              {searchFilter 
                ? "Aucune propriété ne correspond à votre recherche." 
                : "Aucune propriété n'est actuellement disponible."
              }
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Nos Propriétés Disponibles
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
              Découvrez notre sélection de logements de qualité, 
              soigneusement sélectionnés pour répondre à vos besoins
            </p>
            
            {/* Toggle pour afficher la carte */}
            <div className="flex justify-center">
              <Button
                variant={showMap ? "default" : "outline"}
                onClick={() => setShowMap(!showMap)}
                className="mb-8"
              >
                <MapIcon className="h-4 w-4 mr-2" />
                {showMap ? "Masquer la carte" : "Voir sur la carte"}
              </Button>
            </div>
          </div>

          {/* Carte des propriétés */}
          {showMap && (
            <div className="mb-12">
              <PropertyMap 
                properties={sortedProperties}
                selectedProperty={selectedProperty}
                onPropertySelect={handlePropertyClick}
              />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedProperties.map((property) => {
              const roomInfo = getRoomInfo(property);
              const settings = propertySettings[property.id] || {};
              
              return (
                <Card 
                  key={property.id}
                  className="group hover:shadow-lg transition-all duration-300 cursor-pointer bg-white border-0 shadow-sm"
                  onClick={() => handlePropertyClick(property)}
                >
                  <div className="relative">
                    {/* Image de la propriété */}
                    <div className="w-full h-48 bg-gray-200 rounded-t-lg overflow-hidden">
                      {property.image && property.image !== '/placeholder.svg' ? (
                        <img 
                          src={property.image} 
                          alt={property.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon className="h-12 w-12 text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* Badges de statut et mise en avant */}
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                      <Badge className={`${getStatusColor(property.status)} border font-medium`}>
                        {property.status}
                      </Badge>
                      {settings.featured && (
                        <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 font-medium">
                          <Star className="h-3 w-3 mr-1" />
                          Coup de cœur
                        </Badge>
                      )}
                    </div>
                  </div>

                  <CardContent className="p-6">
                    <div className="mb-4">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {property.title}
                      </h3>
                      <div className="flex items-start text-gray-600 mb-3">
                        <MapPin className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{property.address}</span>
                      </div>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Bed className="h-4 w-4 mr-1" />
                          {roomInfo.rooms} {property.locationType === 'Colocation' ? 'chambres' : 'pièces'}
                        </div>
                        <div className="flex items-center">
                          <Bath className="h-4 w-4 mr-1" />
                          {roomInfo.bathrooms} SDB
                        </div>
                        <div className="flex items-center">
                          <Square className="h-4 w-4 mr-1" />
                          {property.surface}m²
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4 text-gray-400" />
                        <span className="text-sm font-medium text-blue-600">{property.type}</span>
                        {property.locationType && (
                          <span className="text-sm text-gray-500">• {property.locationType}</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center font-semibold text-lg text-green-600">
                        <Euro className="h-5 w-5 mr-1" />
                        {property.rent}€/mois
                      </div>
                      <Button 
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePropertyClick(property);
                        }}
                      >
                        Voir détails
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <PropertyDetailsModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        property={selectedProperty}
      />
    </>
  );
};
