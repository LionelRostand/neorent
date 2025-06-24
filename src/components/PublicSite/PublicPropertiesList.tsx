
import React, { useState, useMemo } from 'react';
import { useFirebaseProperties } from '@/hooks/useFirebaseProperties';
import { PropertyMap } from './PropertyMap';
import { PropertyDetailsModal } from './PropertyDetailsModal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Building, MapPin, Euro, Square, Eye, LayoutGrid, Map } from 'lucide-react';

interface PublicPropertiesListProps {
  searchFilter?: string;
}

export const PublicPropertiesList: React.FC<PublicPropertiesListProps> = ({ searchFilter = '' }) => {
  const { properties, loading } = useFirebaseProperties();
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');

  // Filtrer les propriétés selon la recherche
  const filteredProperties = useMemo(() => {
    if (!properties) return [];
    
    // Afficher toutes les propriétés du backend, pas seulement celles libres
    const availableProperties = properties;
    
    if (!searchFilter.trim()) {
      return availableProperties;
    }
    
    return availableProperties.filter(property => 
      property.address?.toLowerCase().includes(searchFilter.toLowerCase()) ||
      property.title?.toLowerCase().includes(searchFilter.toLowerCase()) ||
      property.type?.toLowerCase().includes(searchFilter.toLowerCase())
    );
  }, [properties, searchFilter]);

  const handlePropertyClick = (property: any) => {
    setSelectedProperty(property);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProperty(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Libre':
        return 'bg-green-100 text-green-700';
      case 'Occupé':
        return 'bg-red-100 text-red-700';
      case 'En maintenance':
        return 'bg-orange-100 text-orange-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <Building className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-700 mb-2">
            Chargement des propriétés...
          </h3>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {searchFilter ? `Résultats pour "${searchFilter}"` : 'Nos Propriétés'}
          </h2>
          <p className="text-gray-600">
            {filteredProperties.length} propriété{filteredProperties.length > 1 ? 's' : ''} disponible{filteredProperties.length > 1 ? 's' : ''}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <LayoutGrid className="h-4 w-4 mr-1" />
            Grille
          </Button>
          <Button
            variant={viewMode === 'map' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('map')}
          >
            <Map className="h-4 w-4 mr-1" />
            Carte
          </Button>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <>
          {filteredProperties.length === 0 ? (
            <div className="text-center py-12">
              <Building className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                Aucune propriété trouvée
              </h3>
              <p className="text-gray-500">
                {searchFilter ? 'Essayez avec des termes de recherche différents.' : 'Aucune propriété n\'est actuellement disponible.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProperties.map((property) => (
                <Card key={property.id} className="hover:shadow-lg transition-shadow duration-200">
                  <CardContent className="p-4">
                    <div className="relative">
                      <img
                        src={property.image && property.image !== '/placeholder.svg' ? property.image : '/placeholder.svg'}
                        alt={property.title}
                        className="w-full h-48 object-cover rounded-md mb-4 cursor-pointer"
                        onClick={() => handlePropertyClick(property)}
                      />
                      <Badge className={`absolute top-2 right-2 ${getStatusColor(property.status)}`}>
                        {property.status}
                      </Badge>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-1 cursor-pointer" onClick={() => handlePropertyClick(property)}>
                      {property.title}
                    </h3>
                    <div className="flex items-center text-gray-600 mb-2">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span className="line-clamp-1">{property.address}</span>
                    </div>
                    <div className="flex items-center text-gray-600 mb-2">
                      <Building className="h-4 w-4 mr-2" />
                      <span>{property.type}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Euro className="h-4 w-4 mr-2" />
                        <span className="text-lg font-bold text-green-600">{property.rent}€/mois</span>
                      </div>
                      <div className="flex items-center">
                        <Square className="h-4 w-4 mr-2" />
                        <span>{property.surface} m²</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      ) : (
        <PropertyMap 
          properties={filteredProperties} 
          selectedProperty={selectedProperty}
          onPropertySelect={handlePropertyClick}
        />
      )}

      <PropertyDetailsModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        property={selectedProperty}
      />
    </section>
  );
};
