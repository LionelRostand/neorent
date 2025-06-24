
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
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
  Upload
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useOwnerData } from '@/hooks/useOwnerData';
import { toast } from 'sonner';

const PropertiesTab = () => {
  const { t } = useTranslation();
  const { userProfile } = useAuth();
  const { properties } = useOwnerData(userProfile);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const [editMode, setEditMode] = useState(false);

  // État pour gérer la visibilité des propriétés sur le site
  const [propertyVisibility, setPropertyVisibility] = useState<{[key: string]: boolean}>({});
  const [propertyDescriptions, setPropertyDescriptions] = useState<{[key: string]: string}>({});

  const handleSaveWebsiteSettings = async () => {
    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Saving website property settings:', { 
        visibility: propertyVisibility,
        descriptions: propertyDescriptions 
      });
      
      toast.success('Paramètres du site web sauvegardés', {
        description: 'Les propriétés seront affichées selon vos préférences'
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
    setPropertyVisibility(prev => ({
      ...prev,
      [propertyId]: !prev[propertyId]
    }));
  };

  const updatePropertyDescription = (propertyId: string, description: string) => {
    setPropertyDescriptions(prev => ({
      ...prev,
      [propertyId]: description
    }));
  };

  const getStatusBadgeVariant = (status: string) => {
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

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-semibold text-gray-900 flex items-center gap-2">
            <Building className="h-6 w-6" />
            Propriétés du Site Web
          </h2>
          <p className="text-gray-600 text-sm md:text-base mt-1">
            Gérez l'affichage de vos propriétés sur votre site web public
          </p>
        </div>
        <Button 
          onClick={handleSaveWebsiteSettings} 
          disabled={isSaving}
          className="flex items-center gap-2 w-full sm:w-auto"
        >
          <Save className="h-4 w-4" />
          {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Liste des propriétés */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Building className="h-5 w-5" />
                Mes Propriétés ({properties?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {properties && properties.length > 0 ? (
                <div className="space-y-4">
                  {properties.map((property) => (
                    <div 
                      key={property.id} 
                      className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                              {property.image && property.image !== '/placeholder.svg' ? (
                                <img 
                                  src={property.image} 
                                  alt={property.title}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <ImageIcon className="h-6 w-6 text-gray-400" />
                              )}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900">{property.title}</h4>
                              <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                                <MapPin className="h-3 w-3" />
                                {property.address}
                              </div>
                              <div className="flex items-center gap-4 text-sm">
                                <span className="flex items-center gap-1">
                                  <Euro className="h-3 w-3" />
                                  {property.rent}€
                                </span>
                                <Badge variant={getStatusBadgeVariant(property.status)} className="text-xs">
                                  {property.status}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Label className="text-sm font-medium">
                                Visible sur le site
                              </Label>
                              <Switch
                                checked={propertyVisibility[property.id] || false}
                                onCheckedChange={() => togglePropertyVisibility(property.id)}
                              />
                              {propertyVisibility[property.id] ? (
                                <Eye className="h-4 w-4 text-green-600" />
                              ) : (
                                <EyeOff className="h-4 w-4 text-gray-400" />
                              )}
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedProperty(property)}
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
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <Building className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-gray-700 mb-2">
                    Aucune propriété
                  </h3>
                  <p className="text-gray-500 text-sm">
                    Ajoutez des propriétés depuis la section Propriétés pour les afficher sur votre site web
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Panneau de modification */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle className="text-lg">
                {selectedProperty ? 'Modifier la Propriété' : 'Paramètres Web'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedProperty ? (
                <>
                  <div>
                    <Label className="text-sm font-medium">Titre</Label>
                    <Input value={selectedProperty.title} readOnly className="bg-gray-50" />
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium">Description pour le site web</Label>
                    <Textarea
                      placeholder="Ajoutez une description attractive pour votre site web..."
                      rows={4}
                      value={propertyDescriptions[selectedProperty.id] || ''}
                      onChange={(e) => updatePropertyDescription(selectedProperty.id, e.target.value)}
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Photo actuelle</Label>
                    <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-300">
                      {selectedProperty.image && selectedProperty.image !== '/placeholder.svg' ? (
                        <img 
                          src={selectedProperty.image} 
                          alt={selectedProperty.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-center">
                          <ImageIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-500">Aucune photo</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <Button variant="outline" className="w-full">
                    <Upload className="h-4 w-4 mr-2" />
                    Changer la photo
                  </Button>

                  <div className="pt-4 border-t">
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
                <div className="text-center py-8">
                  <Building className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">
                    Sélectionnez une propriété pour la modifier
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Aperçu du site web */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Aperçu Site Web
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 rounded-lg p-6 min-h-[200px]">
            <h3 className="text-lg font-semibold mb-4">Nos Propriétés Disponibles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {properties?.filter(p => propertyVisibility[p.id]).map((property) => (
                <div key={property.id} className="bg-white rounded-lg shadow-sm border p-4">
                  <div className="w-full h-32 bg-gray-200 rounded-lg mb-3 overflow-hidden">
                    {property.image && property.image !== '/placeholder.svg' ? (
                      <img 
                        src={property.image} 
                        alt={property.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <h4 className="font-semibold text-sm">{property.title}</h4>
                  <p className="text-xs text-gray-600 mb-2">{property.address}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold text-blue-600">
                      {property.rent}€/mois
                    </span>
                    <Badge variant={getStatusBadgeVariant(property.status)} className="text-xs">
                      {property.status}
                    </Badge>
                  </div>
                </div>
              )) || []}
            </div>
            {!properties?.some(p => propertyVisibility[p.id]) && (
              <p className="text-gray-500 text-center py-8">
                Aucune propriété visible. Activez la visibilité pour voir l'aperçu.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PropertiesTab;
