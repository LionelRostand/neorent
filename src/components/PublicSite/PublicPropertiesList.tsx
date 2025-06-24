
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
  Image as ImageIcon
} from 'lucide-react';

// Mock data for demonstration - in real app this would come from the website management
const mockVisibleProperties = [
  {
    id: '1',
    title: 'Appartement moderne centre-ville',
    address: '123 Rue de la Paix, Paris',
    rent: '1200',
    status: 'Libre',
    image: '/placeholder.svg',
    description: 'Magnifique appartement rénové avec tout le confort moderne',
    rooms: 3,
    bathrooms: 1,
    surface: '65',
    featured: true
  },
  {
    id: '2',
    title: 'Studio lumineux',
    address: '45 Avenue des Champs, Lyon',
    rent: '800',
    status: 'Libre',
    image: '/placeholder.svg',
    description: 'Studio parfait pour étudiant ou jeune professionnel',
    rooms: 1,
    bathrooms: 1,
    surface: '25',
    featured: false
  }
];

export const PublicPropertiesList = () => {
  const { t } = useTranslation();
  const [favorites, setFavorites] = useState<string[]>([]);

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

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Propriétés Disponibles ({mockVisibleProperties.length})
          </h2>
          <p className="text-gray-600">
            Découvrez nos propriétés sélectionnées avec soin
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockVisibleProperties.map((property) => (
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
                  
                  {/* Featured Badge */}
                  {property.featured && (
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-orange-500 text-white">
                        <Star className="h-3 w-3 mr-1" />
                        Coup de cœur
                      </Badge>
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

                    {property.description && (
                      <p className="text-gray-600 text-sm line-clamp-2">
                        {property.description}
                      </p>
                    )}

                    {/* Property Details */}
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Bed className="h-4 w-4 mr-1" />
                        {property.rooms} pièces
                      </div>
                      <div className="flex items-center">
                        <Bath className="h-4 w-4 mr-1" />
                        {property.bathrooms} SDB
                      </div>
                      <div className="flex items-center">
                        <Square className="h-4 w-4 mr-1" />
                        {property.surface}m²
                      </div>
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
          ))}
        </div>

        {mockVisibleProperties.length === 0 && (
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
