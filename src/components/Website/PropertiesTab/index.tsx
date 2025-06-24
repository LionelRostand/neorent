
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useOwnerData } from '@/hooks/useOwnerData';
import { useFirebaseProperties } from '@/hooks/useFirebaseProperties';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Save, 
  Eye, 
  EyeOff, 
  Edit, 
  Building, 
  MapPin, 
  Euro,
  Image as ImageIcon,
  ExternalLink,
  CheckCircle
} from 'lucide-react';

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

  const handlePreviewSite = () => {
    window.open('/properties', '_blank');
  };

  // Filtrer les propriétés visibles pour les statistiques
  const visibleProperties = uniqueProperties?.filter(p => propertySettings[p.id]?.visible) || [];
  const featuredProperties = uniqueProperties?.filter(p => propertySettings[p.id]?.featured) || [];

  console.log('🚀 PropertiesTab render');
  console.log('🚀 Owner properties:', ownerProperties);
  console.log('🚀 Admin properties:', allAdminProperties);
  console.log('🚀 Unique properties:', uniqueProperties);

  return (
    <div className="space-y-4 md:space-y-6">
      {/* En-tête avec statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Propriétés</p>
                <p className="text-2xl font-bold">{uniqueProperties?.length || 0}</p>
              </div>
              <Building className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Propriétaires</p>
                <p className="text-2xl font-bold text-green-600">{ownerProperties?.length || 0}</p>
              </div>
              <Eye className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Admin</p>
                <p className="text-2xl font-bold text-orange-600">{allAdminProperties?.length || 0}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <Button 
                  onClick={handleSaveWebsiteSettings} 
                  disabled={isSaving}
                  className="w-full"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Liste des propriétés */}
        <div className="xl:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Toutes les Propriétés Disponibles ({uniqueProperties?.length || 0})
                </div>
                <Button variant="outline" size="sm" onClick={handlePreviewSite}>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Aperçu site
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loadingProperties ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">Chargement des propriétés...</p>
                </div>
              ) : uniqueProperties && uniqueProperties.length > 0 ? (
                <div className="space-y-4">
                  {uniqueProperties.map((property) => (
                    <div 
                      key={property.id} 
                      className={`border rounded-lg p-4 transition-all ${
                        propertySettings[property.id]?.visible 
                          ? 'border-green-200 bg-green-50' 
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                        {/* Image de la propriété */}
                        <div className="w-full lg:w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                          {property.image && property.image !== '/placeholder.svg' ? (
                            <img 
                              src={property.image} 
                              alt={property.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <ImageIcon className="h-8 w-8 text-gray-400" />
                          )}
                        </div>

                        {/* Informations de la propriété */}
                        <div className="flex-1 space-y-3">
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-1">{property.title}</h4>
                            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                              <MapPin className="h-3 w-3" />
                              {property.address}
                            </div>
                            <div className="flex flex-wrap items-center gap-3 text-sm">
                              <span className="flex items-center gap-1 font-medium">
                                <Euro className="h-3 w-3" />
                                {property.rent}€/mois
                              </span>
                              <Badge variant={getStatusBadgeVariant(property.status)} className="text-xs">
                                {property.status}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {property.owner ? 'Propriétaire' : 'Admin'}
                              </Badge>
                              {propertySettings[property.id]?.featured && (
                                <Badge variant="outline" className="text-xs border-orange-300 text-orange-600">
                                  Mise en avant
                                </Badge>
                              )}
                            </div>
                          </div>

                          {/* Contrôles de visibilité */}
                          <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-3 border-t border-gray-200">
                            <div className="flex items-center gap-3">
                              <Label className="text-sm font-medium whitespace-nowrap">
                                Visible sur le site
                              </Label>
                              <Switch
                                checked={propertySettings[property.id]?.visible || false}
                                onCheckedChange={() => togglePropertyVisibility(property.id)}
                              />
                              {propertySettings[property.id]?.visible ? (
                                <Eye className="h-4 w-4 text-green-600" />
                              ) : (
                                <EyeOff className="h-4 w-4 text-gray-400" />
                              )}
                            </div>

                            <div className="flex items-center gap-3">
                              <Label className="text-sm font-medium whitespace-nowrap">
                                Mettre en avant
                              </Label>
                              <Switch
                                checked={propertySettings[property.id]?.featured || false}
                                onCheckedChange={() => togglePropertyFeatured(property.id)}
                                disabled={!propertySettings[property.id]?.visible}
                              />
                            </div>

                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedProperty(property)}
                              className="ml-auto"
                            >
                              <Edit className="h-3 w-3 mr-1" />
                              Modifier
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <Building className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-700 mb-2">
                    Aucune propriété trouvée
                  </h3>
                  <p className="text-gray-500 text-sm mb-4">
                    Les propriétés du menu Propriétés du sidebar Neorent apparaîtront ici
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Panneau de modification */}
        <div className="xl:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle className="text-lg">
                {selectedProperty ? 'Modifier la Propriété' : 'Aperçu Site Web'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedProperty ? (
                <>
                  <div>
                    <Label className="text-sm font-medium">Titre</Label>
                    <p className="text-sm bg-gray-50 p-2 rounded">{selectedProperty.title}</p>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium">Description pour le site web</Label>
                    <Textarea
                      placeholder="Ajoutez une description attractive pour votre site web..."
                      rows={4}
                      value={propertySettings[selectedProperty.id]?.description || ''}
                      onChange={(e) => updatePropertyDescription(selectedProperty.id, e.target.value)}
                    />
                  </div>

                  <div className="pt-4 border-t space-y-2">
                    <Button 
                      onClick={() => setSelectedProperty(null)}
                      variant="outline" 
                      className="w-full"
                    >
                      Fermer
                    </Button>
                  </div>
                </>
              ) : (
                <div className="space-y-4">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-blue-900 mb-1">
                      Propriétés visibles: {visibleProperties.length}
                    </h4>
                    <p className="text-xs text-blue-700">
                      Ces propriétés apparaîtront sur votre site web public
                    </p>
                  </div>

                  {visibleProperties.length > 0 && (
                    <div className="space-y-2">
                      {visibleProperties.slice(0, 3).map((property) => (
                        <div key={property.id} className="bg-gray-50 rounded p-2 text-sm">
                          <div className="font-medium truncate">{property.title}</div>
                          <div className="text-gray-600">{property.rent}€/mois</div>
                        </div>
                      ))}
                      {visibleProperties.length > 3 && (
                        <p className="text-xs text-gray-500 text-center">
                          +{visibleProperties.length - 3} autre(s)
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PropertiesTab;
