import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  MapPin, 
  Euro, 
  Bed, 
  Bath, 
  Square, 
  Eye,
  Heart,
  Star,
  Image as ImageIcon,
  Building,
  Map,
  X
} from 'lucide-react';
import { useFirebaseProperties } from '@/hooks/useFirebaseProperties';
import { PropertyMap } from './PropertyMap';
import { PropertyDetailsModal } from './PropertyDetailsModal';

interface PublicPropertiesListProps {
  searchTerm?: string;
}

export const PublicPropertiesList = ({ searchTerm }: PublicPropertiesListProps) => {
  const { t } = useTranslation();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const [showPropertyDetails, setShowPropertyDetails] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const { properties: allProperties, loading } = useFirebaseProperties();

  // Filtrer les propriétés selon le terme de recherche
  const filteredProperties = useMemo(() => {
    if (!allProperties) return [];
    
    const visibleProperties = allProperties || [];
    
    if (!searchTerm || searchTerm.trim() === '') {
      return visibleProperties;
    }

    const searchLower = searchTerm.toLowerCase();
    return visibleProperties.filter(property => 
      property.title?.toLowerCase().includes(searchLower) ||
      property.address?.toLowerCase().includes(searchLower) ||
      property.type?.toLowerCase().includes(searchLower) ||
      property.locationType?.toLowerCase().includes(searchLower)
    );
  }, [allProperties, searchTerm]);

  // Pour l'instant, afficher toutes les propriétés jusqu'à ce que le système de visibilité soit implémenté
  // Dans une vraie implémentation, on filtrerait selon les propriétés marquées comme visibles
  

  const toggleFavorite = (propertyId: string) => {
    setFavorites(prev => 
      prev.includes(propertyId) 
        ? prev.filter(id => id !== propertyId)
        : [...prev, propertyId]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Libre':
        return 'bg-green-100 text-green-800';
      case 'Occupé':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Calculer le nombre de chambres et salles de bain depuis les données existantes
  const getRoomInfo = (property: any) => {
    // Si c'est une colocation, utiliser totalRooms, sinon estimer selon le type
    const rooms = property.locationType === 'Colocation' 
      ? property.totalRooms || 1
      : property.type === 'Studio' ? 1 : 2; // estimation simple
    
    const bathrooms = 1; // estimation par défaut
    
    return { rooms, bathrooms };
  };

  const handlePropertySelect = (property: any) => {
    setSelectedProperty(property);
    setShowPropertyDetails(true);
  };

  const handleViewDetails = (property: any) => {
    setSelectedProperty(property);
    setShowPropertyDetails(true);
  };

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Building className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Chargement des propriétés...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Propriétés Disponibles ({filteredProperties.length})
              </h2>
              {searchTerm && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>Résultats pour: "{searchTerm}"</span>
                  <Badge variant="outline" className="bg-blue-50">
                    {filteredProperties.length} résultat(s)
                  </Badge>
                </div>
              )}
            </div>
            <div className="flex gap-2 mt-4 sm:mt-0">
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                onClick={() => setViewMode('list')}
                className="flex items-center gap-2"
              >
                <Building className="h-4 w-4" />
                Liste
              </Button>
              <Button
                variant={viewMode === 'map' ? 'default' : 'outline'}
                onClick={() => setViewMode('map')}
                className="flex items-center gap-2"
              >
                <Map className="h-4 w-4" />
                Carte
              </Button>
            </div>
          </div>
          <p className="text-gray-600">
            Découvrez nos propriétés sélectionnées avec soin
          </p>
        </div>

        {viewMode === 'map' ? (
          <div className="space-y-6">
            <PropertyMap
              properties={filteredProperties}
              selectedProperty={selectedProperty}
              onPropertySelect={handlePropertySelect}
            />
            {selectedProperty && (
              <Card className="border-green-200 bg-green-50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">{selectedProperty.title}</h3>
                      <p className="text-gray-600 flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {selectedProperty.address}
                      </p>
                    </div>
                    <Button onClick={() => handleViewDetails(selectedProperty)}>
                      <Eye className="h-4 w-4 mr-2" />
                      Voir détails
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property) => {
              const roomInfo = getRoomInfo(property);
              
              return (
                <Card key={property.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative">
                    {/* Property Image */}
                    <div className="h-48 bg-gray-200 relative overflow-hidden">
                      {property.image && property.image !== '/placeholder.svg' ? (
                        <img 
                          src={property.image} 
                          alt={property.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon className="h-12 w-12 text-gray-400" />
                        </div>
                      )}
                      
                      {/* Favorite Button */}
                      <button
                        onClick={() => toggleFavorite(property.id)}
                        className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
                      >
                        <Heart 
                          className={`h-4 w-4 ${
                            favorites.includes(property.id) 
                              ? 'text-red-500 fill-current' 
                              : 'text-gray-400'
                          }`} 
                        />
                      </button>
                      
                      {/* Status Badge */}
                      <div className="absolute bottom-3 left-3">
                        <Badge className={getStatusColor(property.status)}>
                          {property.status}
                        </Badge>
                      </div>
                    </div>

                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div>
                          <h3 className="font-semibold text-lg text-gray-900 mb-1">
                            {property.title}
                          </h3>
                          <div className="flex items-center text-gray-600 text-sm">
                            <MapPin className="h-4 w-4 mr-1" />
                            {property.address}
                          </div>
                        </div>

                        {/* Property Details */}
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

                        {/* Property Type */}
                        <div className="text-sm">
                          <span className="text-blue-600 font-medium">{property.type}</span>
                          {property.locationType && (
                            <span className="text-gray-500 ml-2">• {property.locationType}</span>
                          )}
                        </div>

                        {/* Price and Action */}
                        <div className="flex items-center justify-between pt-3 border-t">
                          <div className="flex items-center font-semibold text-lg text-green-600">
                            <Euro className="h-4 w-4 mr-1" />
                            {property.rent}€/mois
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleViewDetails(property)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Voir détails
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {filteredProperties.length === 0 && (
          <div className="text-center py-12">
            <Building className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              {searchTerm ? 'Aucun résultat trouvé' : 'Aucune propriété disponible pour le moment'}
            </h3>
            <p className="text-gray-500">
              {searchTerm 
                ? 'Essayez de modifier vos critères de recherche'
                : 'Revenez bientôt pour découvrir nos nouvelles offres !'
              }
            </p>
          </div>
        )}

        {/* Modal des détails de propriété */}
        <PropertyDetailsModal
          isOpen={showPropertyDetails}
          onClose={() => setShowPropertyDetails(false)}
          property={selectedProperty}
        />
      </div>
    </section>
  );
};
