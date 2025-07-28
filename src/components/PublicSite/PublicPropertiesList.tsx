
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PropertyDetailsModal } from './PropertyDetailsModal';
import { PropertyMap } from './PropertyMap';
import { useFirebaseProperties } from '@/hooks/useFirebaseProperties';
import { useFirebaseRoommates } from '@/hooks/useFirebaseRoommates';
import { useWebsiteSettings } from '@/hooks/useMongoProperties';
import { Property } from '@/types/property';
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
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showMap, setShowMap] = useState(false);
  
  // Utiliser les vraies propriétés depuis Firebase
  const { properties: allProperties, loading } = useFirebaseProperties();
  
  // Utiliser uniquement les vraies propriétés Firebase
  const finalProperties = allProperties || [];
  
  // Debug: log des propriétés récupérées
  React.useEffect(() => {
    console.log('🔥 Firebase Properties loaded:', allProperties?.length || 0, allProperties);
    console.log('📋 Final properties used:', finalProperties?.length || 0, finalProperties);
    console.log('🎯 Using only Firebase data (no test data)');
  }, [allProperties, finalProperties]);
  
  // Récupérer les colocataires pour calculer l'occupation
  const { roommates } = useFirebaseRoommates();
  
  // Récupérer les paramètres de visibilité depuis MongoDB
  const { data: websiteSettings, isLoading: settingsLoading, error: settingsError } = useWebsiteSettings();
  
  // Convertir les paramètres en format objet pour faciliter l'accès
  const propertySettings = websiteSettings?.reduce((acc, setting) => {
    acc[setting.propertyId] = setting;
    return acc;
  }, {} as Record<string, any>) || {};

  // Log des erreurs pour déboguer
  React.useEffect(() => {
    if (settingsError) {
      console.log('🔧 Erreur MongoDB détectée, mode fallback activé:', settingsError);
    }
  }, [settingsError]);

  // Calculer le statut réel et les chambres disponibles pour chaque propriété
  const getRealStatus = (property: Property) => {
    if (property.locationType === 'Colocation') {
      const activeRoommates = roommates.filter(
        roommate => roommate.property === property.id && roommate.status === 'Actif'
      ).length;
      
      const totalRooms = property.totalRooms || 1;
      const availableRooms = totalRooms - activeRoommates;
      
      console.log(`🏠 ${property.title}: ${activeRoommates} colocataires actifs / ${totalRooms} chambres = ${availableRooms} disponibles`);
      
      // Logique corrigée : si toutes les chambres sont libres = Libre
      if (availableRooms === totalRooms) {
        console.log(`✅ Statut: Libre (${availableRooms}/${totalRooms})`);
        return { status: 'Libre', color: 'bg-green-100 text-green-800 border-green-200' };
      } else if (availableRooms > 0) {
        console.log(`⚠️ Statut: Partiellement occupé (${availableRooms}/${totalRooms})`);
        return { status: 'Partiellement occupé', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' };
      } else {
        console.log(`❌ Statut: Occupé (${availableRooms}/${totalRooms})`);
        return { status: 'Occupé', color: 'bg-red-100 text-red-800 border-red-200' };
      }
    } else {
      // Pour les appartements/maisons classiques
      return { 
        status: property.status, 
        color: getStatusColor(property.status) 
      };
    }
  };

  const getAvailableRoomsCount = (property: Property) => {
    if (property.locationType === 'Colocation') {
      const activeRoommates = roommates.filter(
        roommate => roommate.property === property.id && roommate.status === 'Actif'
      ).length;
      
      const totalRooms = property.totalRooms || 1;
      const availableRooms = totalRooms - activeRoommates;
      
      return Math.max(0, availableRooms); // S'assurer que ce n'est jamais négatif
    }
    return property.status === 'Libre' ? 1 : 0;
  };

  // Filtrer les propriétés selon le terme de recherche
  const filteredProperties = finalProperties.filter(property => {
    if (!searchFilter.trim()) return true;
    
    const searchLower = searchFilter.toLowerCase();
    
    return (
      property.title?.toLowerCase().includes(searchLower) ||
      property.address?.toLowerCase().includes(searchLower) ||
      property.type?.toLowerCase().includes(searchLower)
    );
  });
  
  // Trier par statut (Libre en premier) puis par titre
  const sortedProperties = filteredProperties.sort((a, b) => {
    const statusA = getRealStatus(a);
    const statusB = getRealStatus(b);
    
    // Libre en premier, puis par ordre alphabétique
    if (statusA.status === 'Libre' && statusB.status !== 'Libre') return -1;
    if (statusA.status !== 'Libre' && statusB.status === 'Libre') return 1;
    
    return a.title.localeCompare(b.title);
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

  const getRoomInfo = (property: Property) => {
    const rooms = property.locationType === 'Colocation' 
      ? property.totalRooms || 1
      : property.type === 'Studio' ? 1 : 2;
    const bathrooms = 1;
    return { rooms, bathrooms };
  };

  const getPropertyMainImage = (property: Property) => {
    // Get the first available image from either the legacy 'image' field or new 'images' array
    if (property.image && property.image !== '/placeholder.svg') {
      return property.image;
    }
    if (property.images && Array.isArray(property.images) && property.images.length > 0) {
      return property.images[0];
    }
    return null;
  };

  const handlePropertyClick = (property: Property) => {
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
    console.log('❌ Aucune propriété à afficher:', {
      allProperties: allProperties?.length || 0,
      filteredProperties: filteredProperties.length,
      loading,
      settingsError: !!settingsError,
      websiteSettings: !!websiteSettings
    });
    
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
            <div className="mt-4 text-xs text-gray-500">
              Debug: {allProperties?.length || 0} propriétés Firebase récupérées
            </div>
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
              const mainImage = getPropertyMainImage(property);
              const realStatus = getRealStatus(property);
              const availableRooms = getAvailableRoomsCount(property);
              
              return (
                <Card 
                  key={property.id}
                  className="group hover:shadow-lg transition-all duration-300 cursor-pointer bg-white border-0 shadow-sm"
                  onClick={() => handlePropertyClick(property)}
                >
                  <div className="relative">
                    {/* Image de la propriété */}
                    <div className="w-full h-48 bg-gray-200 rounded-t-lg overflow-hidden">
                      {mainImage ? (
                        <img 
                          src={mainImage} 
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
                      <Badge className={`${realStatus.color} border font-medium`}>
                        {realStatus.status}
                      </Badge>
                      {settings.featured && (
                        <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 font-medium">
                          <Star className="h-3 w-3 mr-1" />
                          Coup de cœur
                        </Badge>
                      )}
                    </div>

                    {/* Image count indicator */}
                    {property.images && Array.isArray(property.images) && property.images.length > 1 && (
                      <div className="absolute top-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded">
                        {property.images.length} photos
                      </div>
                    )}
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
                      
                      {/* Affichage des chambres disponibles pour les colocations */}
                      {property.locationType === 'Colocation' && (
                        <div className="text-sm text-gray-600 font-medium">
                          {availableRooms}/{property.totalRooms || 1} chambres disponibles
                        </div>
                      )}
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
