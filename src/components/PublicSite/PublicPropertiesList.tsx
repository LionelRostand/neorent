
import React, { useState } from 'react';
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
  Building
} from 'lucide-react';
import { useFirebaseProperties } from '@/hooks/useFirebaseProperties';

export const PublicPropertiesList = () => {
  const { t } = useTranslation();
  const [favorites, setFavorites] = useState<string[]>([]);
  const { properties: allProperties, loading } = useFirebaseProperties();

  // Pour l'instant, afficher toutes les propriétés jusqu'à ce que le système de visibilité soit implémenté
  // Dans une vraie implémentation, on filtrerait selon les propriétés marquées comme visibles
  const visibleProperties = allProperties || [];

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
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Propriétés Disponibles ({visibleProperties.length})
          </h2>
          <p className="text-gray-600">
            Découvrez nos propriétés sélectionnées avec soin
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleProperties.map((property) => {
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
                        <Button variant="outline" size="sm">
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

        {visibleProperties.length === 0 && (
          <div className="text-center py-12">
            <Building className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              Aucune propriété disponible pour le moment
            </h3>
            <p className="text-gray-500">
              Revenez bientôt pour découvrir nos nouvelles offres !
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
