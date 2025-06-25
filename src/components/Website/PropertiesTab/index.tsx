
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useOwnerData } from '@/hooks/useOwnerData';
import { useFirebaseProperties } from '@/hooks/useFirebaseProperties';
import { toast } from 'sonner';
import { PropertiesList } from './PropertiesList';
import { PropertyStatsCards } from './PropertyStatsCards';
import { PropertyEditPanel } from './PropertyEditPanel';

const PropertiesTab = () => {
  const { userProfile } = useAuth();
  const { properties: ownerProperties } = useOwnerData(userProfile);
  const { properties: allAdminProperties, loading: loadingProperties } = useFirebaseProperties();
  const [isSaving, setIsSaving] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<any>(null);

  // Combiner toutes les propriétés disponibles (owner + admin)
  const allAvailableProperties = [
    ...(ownerProperties || []),
    ...(allAdminProperties || [])
  ];

  // Supprimer les doublons basés sur l'ID
  const uniqueProperties = allAvailableProperties.filter((property, index, self) =>
    index === self.findIndex((p) => p.id === property.id)
  );

  // États pour gérer la visibilité et les descriptions des propriétés sur le site
  const [propertySettings, setPropertySettings] = useState<{[key: string]: {
    visible: boolean;
    description: string;
    featured: boolean;
  }}>({});

  // Initialiser les paramètres des propriétés pour toutes les propriétés disponibles
  useEffect(() => {
    if (uniqueProperties.length > 0) {
      const initialSettings: any = {};
      uniqueProperties.forEach((property) => {
        // Initialiser avec visible: false par défaut
        initialSettings[property.id] = {
          visible: false,
          description: '',
          featured: false
        };
      });
      setPropertySettings(initialSettings);
    }
  }, [uniqueProperties.length]);

  const handleSaveWebsiteSettings = async () => {
    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const visibleCount = Object.values(propertySettings).filter(s => s.visible).length;
      
      toast.success('Paramètres du site web sauvegardés', {
        description: `${visibleCount} propriété(s) sera(ont) affichée(s) sur votre site web public`
      });
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde', {
        description: 'Veuillez réessayer'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const togglePropertyVisibility = (propertyId: string) => {
    setPropertySettings(prev => {
      const newSettings = {
        ...prev,
        [propertyId]: {
          ...prev[propertyId],
          visible: !prev[propertyId]?.visible
        }
      };
      return newSettings;
    });
  };

  const togglePropertyFeatured = (propertyId: string) => {
    setPropertySettings(prev => ({
      ...prev,
      [propertyId]: {
        ...prev[propertyId],
        featured: !prev[propertyId]?.featured
      }
    }));
  };

  const updatePropertyDescription = (propertyId: string, description: string) => {
    setPropertySettings(prev => ({
      ...prev,
      [propertyId]: {
        ...prev[propertyId],
        description
      }
    }));
  };

  const getStatusBadgeVariant = (status: string): "default" | "destructive" | "outline" | "secondary" | "success" => {
    switch (status) {
      case 'Libre':
        return 'secondary';
      case 'Occupé':
        return 'default';
      case 'En maintenance':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  // Filtrer les propriétés visibles pour les statistiques
  const visibleProperties = uniqueProperties?.filter(p => propertySettings[p.id]?.visible) || [];

  return (
    <div className="space-y-4 md:space-y-6">
      {/* En-tête avec statistiques */}
      <PropertyStatsCards
        uniqueProperties={uniqueProperties}
        ownerProperties={ownerProperties || []}
        allAdminProperties={allAdminProperties || []}
        visibleProperties={visibleProperties}
        isSaving={isSaving}
        onSave={handleSaveWebsiteSettings}
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Liste des propriétés - Maintenant on passe toutes les propriétés, pas seulement les visibles */}
        <div className="xl:col-span-2">
          <PropertiesList
            properties={uniqueProperties}
            propertySettings={propertySettings}
            onToggleVisibility={togglePropertyVisibility}
            onToggleFeatured={togglePropertyFeatured}
            onEditProperty={setSelectedProperty}
            getStatusBadgeVariant={getStatusBadgeVariant}
          />
        </div>

        {/* Panneau de modification */}
        <div className="xl:col-span-1">
          <PropertyEditPanel
            selectedProperty={selectedProperty}
            propertySettings={propertySettings}
            visibleProperties={visibleProperties}
            onCloseEdit={() => setSelectedProperty(null)}
            onUpdateDescription={updatePropertyDescription}
          />
        </div>
      </div>
    </div>
  );
};

export default PropertiesTab;
