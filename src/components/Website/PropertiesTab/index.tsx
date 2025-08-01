
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useFirebaseProperties } from '@/hooks/useFirebaseProperties';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PropertiesList } from './PropertiesList';
import { PropertyStatsCards } from './PropertyStatsCards';
import { PropertyEditPanel } from './PropertyEditPanel';
import { RoommatePropertyAssociation } from '@/components/RoommatePropertyAssociation';

const PropertiesTab = () => {
  const { userProfile } = useAuth();
  const { properties: allProperties, loading: loadingProperties } = useFirebaseProperties();
  
  const [selectedProperty, setSelectedProperty] = useState<any>(null);

  // Pour Firebase, utiliser toutes les propriétés (pas de séparation owner/admin)
  const uniqueProperties = allProperties || [];

  // Supprimer les doublons basés sur l'ID Firebase (id)
  const deduplicatedProperties = uniqueProperties.filter((property, index, self) =>
    index === self.findIndex((p) => p.id === property.id)
  );

  // États pour gérer la visibilité et les descriptions des propriétés sur le site
  const [propertySettings, setPropertySettings] = useState<{[key: string]: {
    visible: boolean;
    description: string;
    featured: boolean;
  }}>({});

  // Charger les paramètres depuis localStorage au démarrage
  useEffect(() => {
    const savedSettings = localStorage.getItem('propertySettings');
    if (savedSettings) {
      try {
        setPropertySettings(JSON.parse(savedSettings));
      } catch (error) {
        console.error('Error loading settings from localStorage:', error);
      }
    }
  }, []);

  // Initialiser les paramètres des propriétés avec visibilité activée par défaut
  useEffect(() => {
    if (deduplicatedProperties.length > 0) {
      setPropertySettings(prevSettings => {
        const newSettings = { ...prevSettings };
        let hasNewProperties = false;
        
        deduplicatedProperties.forEach((property) => {
          // Utiliser id pour Firebase
          if (!newSettings[property.id]) {
            newSettings[property.id] = {
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
  }, [deduplicatedProperties.length]);

  const handleSaveWebsiteSettings = async () => {
    try {
      // Pour Firebase, sauvegarder dans localStorage temporairement
      localStorage.setItem('propertySettings', JSON.stringify(propertySettings));
      
      const visibleCount = Object.values(propertySettings).filter(s => s.visible).length;
      
      toast.success('Paramètres du site web sauvegardés', {
        description: `${visibleCount} propriété(s) sera(ont) affichée(s) sur votre site web public`
      });
      
      console.log('Settings saved to localStorage:', propertySettings);
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
  const visibleProperties = deduplicatedProperties?.filter(p => propertySettings[p.id]?.visible) || [];
  const featuredProperties = deduplicatedProperties?.filter(p => propertySettings[p.id]?.featured) || [];

  // Afficher un état de chargement si nécessaire
  const isLoading = loadingProperties;
  
  if (isLoading) {
    return (
      <div className="space-y-4 md:space-y-6">
        <div className="text-center py-8">
          <p>Chargement des propriétés depuis Firebase...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* En-tête avec statistiques */}
      <PropertyStatsCards
        uniqueProperties={deduplicatedProperties}
        ownerProperties={deduplicatedProperties}
        allAdminProperties={deduplicatedProperties}
        visibleProperties={visibleProperties}
        featuredProperties={featuredProperties}
        isSaving={false}
        onSave={handleSaveWebsiteSettings}
      />

      <Tabs defaultValue="properties" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="properties">Gestion des propriétés</TabsTrigger>
          <TabsTrigger value="roommates">Association colocataires</TabsTrigger>
        </TabsList>

        <TabsContent value="properties" className="space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Liste des propriétés */}
            <div className="xl:col-span-2">
              <PropertiesList
                properties={deduplicatedProperties}
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
        </TabsContent>

        <TabsContent value="roommates">
          <RoommatePropertyAssociation />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PropertiesTab;
