
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

  // Log pour débugger
  console.log('Owner properties:', ownerProperties);
  console.log('Admin properties:', allAdminProperties);
  console.log('Loading:', loadingProperties);

  // Combiner toutes les propriétés disponibles (owner + admin)
  const allAvailableProperties = [
    ...(ownerProperties || []),
    ...(allAdminProperties || [])
  ];

  // Supprimer les doublons basés sur l'ID
  const uniqueProperties = allAvailableProperties.filter((property, index, self) =>
    index === self.findIndex((p) => p.id === property.id)
  );

  console.log('Unique properties:', uniqueProperties);

  // États pour gérer la visibilité et les descriptions des propriétés sur le site
  const [propertySettings, setPropertySettings] = useState<{[key: string]: {
    visible: boolean;
    description: string;
    featured: boolean;
  }}>({});

  // Charger les paramètres sauvegardés depuis le localStorage
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem('propertyWebsiteSettings');
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);
        setPropertySettings(parsedSettings);
        console.log('Loaded saved settings:', parsedSettings);
      }
    } catch (error) {
      console.error('Error loading saved settings:', error);
    }
  }, []);

  // Initialiser les paramètres des propriétés pour les nouvelles propriétés
  useEffect(() => {
    if (uniqueProperties.length > 0) {
      setPropertySettings(prevSettings => {
        const newSettings = { ...prevSettings };
        let hasNewProperties = false;
        
        uniqueProperties.forEach((property) => {
          // Initialiser seulement si la propriété n'existe pas déjà
          if (!newSettings[property.id]) {
            newSettings[property.id] = {
              visible: false,
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
    setIsSaving(true);
    try {
      // Sauvegarder dans le localStorage
      localStorage.setItem('propertyWebsiteSettings', JSON.stringify(propertySettings));
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
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
      console.log('Toggled visibility for', propertyId, 'new settings:', newSettings);
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
  const visibleProperties = uniqueProperties?.filter(p => propertySettings[p.id]?.visible) || [];

  // Afficher un état de chargement si nécessaire
  if (loadingProperties) {
    return (
      <div className="space-y-4 md:space-y-6">
        <div className="text-center py-8">
          <p>Chargement des propriétés...</p>
        </div>
      </div>
    );
  }

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
