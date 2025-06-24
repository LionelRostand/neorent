
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useOwnerData } from '@/hooks/useOwnerData';
import { toast } from 'sonner';
import { PropertyStatsCards } from './PropertyStatsCards';
import { PropertiesList } from './PropertiesList';
import { PropertyEditPanel } from './PropertyEditPanel';

const PropertiesTab = () => {
  const { userProfile } = useAuth();
  const { properties } = useOwnerData(userProfile);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<any>(null);

  // États pour gérer la visibilité et les descriptions des propriétés sur le site
  const [propertySettings, setPropertySettings] = useState<{[key: string]: {
    visible: boolean;
    description: string;
    featured: boolean;
  }}>({});

  // Initialiser les paramètres des propriétés
  useEffect(() => {
    if (properties) {
      const initialSettings: any = {};
      properties.forEach((property) => {
        initialSettings[property.id] = {
          visible: false,
          description: '',
          featured: false
        };
      });
      setPropertySettings(initialSettings);
    }
  }, [properties]);

  const handleSaveWebsiteSettings = async () => {
    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Saving website property settings:', propertySettings);
      
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
    setPropertySettings(prev => ({
      ...prev,
      [propertyId]: {
        ...prev[propertyId],
        visible: !prev[propertyId]?.visible
      }
    }));
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

  const visibleProperties = properties?.filter(p => propertySettings[p.id]?.visible) || [];
  const featuredProperties = properties?.filter(p => propertySettings[p.id]?.featured) || [];

  return (
    <div className="space-y-4 md:space-y-6">
      <PropertyStatsCards
        totalProperties={properties?.length || 0}
        visibleProperties={visibleProperties.length}
        featuredProperties={featuredProperties.length}
        onSave={handleSaveWebsiteSettings}
        isSaving={isSaving}
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <PropertiesList
            properties={properties}
            propertySettings={propertySettings}
            onToggleVisibility={togglePropertyVisibility}
            onToggleFeatured={togglePropertyFeatured}
            onEditProperty={setSelectedProperty}
            getStatusBadgeVariant={getStatusBadgeVariant}
          />
        </div>

        <div className="xl:col-span-1">
          <PropertyEditPanel
            selectedProperty={selectedProperty}
            propertySettings={propertySettings}
            visibleProperties={visibleProperties}
            onUpdateDescription={updatePropertyDescription}
            onClose={() => setSelectedProperty(null)}
          />
        </div>
      </div>
    </div>
  );
};

export default PropertiesTab;
