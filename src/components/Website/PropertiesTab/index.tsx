
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useMongoProperties, useMongoOwnerProperties, useWebsiteSettings, useSaveWebsiteSettings } from '@/hooks/useMongoProperties';
import { toast } from 'sonner';
import { PropertiesList } from './PropertiesList';
import { PropertyStatsCards } from './PropertyStatsCards';
import { PropertyEditPanel } from './PropertyEditPanel';

const PropertiesTab = () => {
  const { userProfile } = useAuth();
  const { data: ownerProperties = [], isLoading: loadingOwnerProperties } = useMongoOwnerProperties(userProfile?.id);
  const { data: allProperties = [], isLoading: loadingAllProperties } = useMongoProperties();
  const { data: websiteSettings = [], isLoading: loadingSettings } = useWebsiteSettings();
  const saveWebsiteSettingsMutation = useSaveWebsiteSettings();
  
  const [selectedProperty, setSelectedProperty] = useState<any>(null);

  // Combiner toutes les propriétés disponibles (owner + admin)
  const allAvailableProperties = [
    ...ownerProperties,
    ...allProperties
  ];

  // Supprimer les doublons basés sur l'ID MongoDB (_id)
  const uniqueProperties = allAvailableProperties.filter((property, index, self) =>
    index === self.findIndex((p) => p._id === property._id)
  );

  // États pour gérer la visibilité et les descriptions des propriétés sur le site
  const [propertySettings, setPropertySettings] = useState<{[key: string]: {
    visible: boolean;
    description: string;
    featured: boolean;
  }}>({});

  // Charger les paramètres depuis l'API MongoDB
  useEffect(() => {
    if (websiteSettings.length > 0) {
      const settingsMap: any = {};
      websiteSettings.forEach((setting) => {
        settingsMap[setting.propertyId] = {
          visible: setting.visible,
          description: setting.description,
          featured: setting.featured
        };
      });
      setPropertySettings(settingsMap);
    }
  }, [websiteSettings]);

  // Initialiser les paramètres des propriétés avec visibilité activée par défaut
  useEffect(() => {
    if (uniqueProperties.length > 0) {
      setPropertySettings(prevSettings => {
        const newSettings = { ...prevSettings };
        let hasNewProperties = false;
        
        uniqueProperties.forEach((property) => {
          // Utiliser _id au lieu de id pour MongoDB
          if (!newSettings[property._id]) {
            newSettings[property._id] = {
              visible: true,
              description: '',
              featured: false
            };
            hasNewProperties = true;
          }
        });
        
        if (hasNewProperties) {
          console.log('Initialized new properties:', newSettings);
        }
        
        return newSettings;
      });
    }
  }, [uniqueProperties.length]);

  const handleSaveWebsiteSettings = async () => {
    try {
      // Convertir les paramètres en format pour l'API
      const settingsArray = Object.entries(propertySettings).map(([propertyId, settings]) => ({
        propertyId,
        visible: settings.visible,
        description: settings.description,
        featured: settings.featured
      }));

      await saveWebsiteSettingsMutation.mutateAsync(settingsArray);
      
      const visibleCount = Object.values(propertySettings).filter(s => s.visible).length;
      
      toast.success('Paramètres du site web sauvegardés', {
        description: `${visibleCount} propriété(s) sera(ont) affichée(s) sur votre site web public`
      });
      
      console.log('Settings saved to MongoDB:', propertySettings);
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Erreur lors de la sauvegarde', {
        description: 'Veuillez réessayer'
      });
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
        return 'success';
      case 'Occupé':
        return 'default';
      case 'En maintenance':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  // Filtrer les propriétés visibles pour les statistiques
  const visibleProperties = uniqueProperties?.filter(p => propertySettings[p._id]?.visible) || [];
  const featuredProperties = uniqueProperties?.filter(p => propertySettings[p._id]?.featured) || [];

  // Afficher un état de chargement si nécessaire
  const isLoading = loadingOwnerProperties || loadingAllProperties || loadingSettings;
  
  if (isLoading) {
    return (
      <div className="space-y-4 md:space-y-6">
        <div className="text-center py-8">
          <p>Chargement des propriétés depuis MongoDB...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* En-tête avec statistiques */}
      <PropertyStatsCards
        uniqueProperties={uniqueProperties}
        ownerProperties={ownerProperties}
        allAdminProperties={allProperties}
        visibleProperties={visibleProperties}
        featuredProperties={featuredProperties}
        isSaving={saveWebsiteSettingsMutation.isPending}
        onSave={handleSaveWebsiteSettings}
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Liste des propriétés */}
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
