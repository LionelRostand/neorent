import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';
import { useOwnerData } from '@/hooks/useOwnerData';
import { useFirebaseProperties } from '@/hooks/useFirebaseProperties';
import { usePropertySettings } from '@/hooks/usePropertySettings';
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

const ImmoTab = () => {
  const { t } = useTranslation();
  const { userProfile } = useAuth();
  const { properties: ownerProperties } = useOwnerData(userProfile);
  const { properties: allAdminProperties, loading: loadingProperties } = useFirebaseProperties();
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  
  const { 
    propertySettings, 
    loading: settingsLoading,
    updatePropertySetting,
    saveSettings 
  } = usePropertySettings();

  // Combiner toutes les propriétés disponibles (owner + admin)
  const allAvailableProperties = [
    ...(ownerProperties || []),
    ...(allAdminProperties || [])
  ];

  // Supprimer les doublons basés sur l'ID
  const uniqueProperties = allAvailableProperties.filter((property, index, self) =>
    index === self.findIndex((p) => p.id === property.id)
  );

  const handleSaveWebsiteSettings = async () => {
    const success = await saveSettings(propertySettings);
    if (success) {
      const visibleCount = Object.values(propertySettings).filter((s: any) => s.visible).length;
      toast.success(t('website.settingsSaved'), {
        description: `${visibleCount} ${t('website.propertiesWillBeDisplayed')}`
      });
    } else {
      toast.error(t('website.saveError'), {
        description: t('website.pleaseRetry')
      });
    }
  };

  const togglePropertyVisibility = async (propertyId: string) => {
    const currentSettings = propertySettings[propertyId] || { visible: false, description: '', featured: false };
    const success = await updatePropertySetting(propertyId, {
      visible: !currentSettings.visible
    });
    
    if (success) {
      toast.success(currentSettings.visible ? 'Propriété masquée du site web' : 'Propriété visible sur le site web');
    } else {
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const togglePropertyFeatured = async (propertyId: string) => {
    const currentSettings = propertySettings[propertyId] || { visible: false, description: '', featured: false };
    const success = await updatePropertySetting(propertyId, {
      featured: !currentSettings.featured
    });
    
    if (success) {
      toast.success(currentSettings.featured ? 'Propriété retirée de la mise en avant' : 'Propriété mise en avant');
    } else {
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const updatePropertyDescription = async (propertyId: string, description: string) => {
    await updatePropertySetting(propertyId, { description });
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

  const visibleProperties = uniqueProperties?.filter(p => propertySettings[p.id]?.visible) || [];
  const featuredProperties = uniqueProperties?.filter(p => propertySettings[p.id]?.featured) || [];

  if (loadingProperties || settingsLoading) {
    return (
      <div className="space-y-4 md:space-y-6">
        <div className="text-center py-8">
          <p>{t('common.loading')}...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* En-tête avec statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{t('website.totalProperties')}</p>
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
                <p className="text-sm text-gray-600">{t('website.visibleOnSite')}</p>
                <p className="text-2xl font-bold text-green-600">{visibleProperties.length}</p>
              </div>
              <Eye className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{t('website.featured')}</p>
                <p className="text-2xl font-bold text-orange-600">{featuredProperties.length}</p>
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
                  disabled={false}
                  className="w-full"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {false ? t('website.saving') : t('website.saveSettings')}
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
                  {t('website.propertyManagement')} ({uniqueProperties?.length || 0})
                </div>
                <Button variant="outline" size="sm" onClick={() => window.open('/properties', '_blank')}>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  {t('website.sitePreview')}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {uniqueProperties && uniqueProperties.length > 0 ? (
                <div className="space-y-4">
                  {uniqueProperties.map((property) => {
                    const settings = propertySettings[property.id] || { visible: false, description: '', featured: false };
                    
                    return (
                      <div 
                        key={property.id} 
                        className={`border rounded-lg p-4 transition-all ${
                          settings.visible 
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
                                  {property.rent}€/{t('common.month')}
                                </span>
                                <Badge variant={getStatusBadgeVariant(property.status)} className="text-xs">
                                  {property.status}
                                </Badge>
                                {settings.featured && (
                                  <Badge variant="outline" className="text-xs border-orange-300 text-orange-600">
                                    {t('website.featured')}
                                  </Badge>
                                )}
                              </div>
                            </div>

                            {/* Contrôles de visibilité */}
                            <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-3 border-t border-gray-200">
                              <div className="flex items-center gap-3">
                                <Label className="text-sm font-medium whitespace-nowrap">
                                  {t('website.websiteVisibility')}
                                </Label>
                                <Switch
                                  checked={settings.visible}
                                  onCheckedChange={() => togglePropertyVisibility(property.id)}
                                />
                                {settings.visible ? (
                                  <Eye className="h-4 w-4 text-green-600" />
                                ) : (
                                  <EyeOff className="h-4 w-4 text-gray-400" />
                                )}
                              </div>

                              <div className="flex items-center gap-3">
                                <Label className="text-sm font-medium whitespace-nowrap">
                                  {t('website.setAsFeatured')}
                                </Label>
                                <Switch
                                  checked={settings.featured}
                                  onCheckedChange={() => togglePropertyFeatured(property.id)}
                                  disabled={!settings.visible}
                                />
                              </div>

                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedProperty(property)}
                                className="ml-auto"
                              >
                                <Edit className="h-3 w-3 mr-1" />
                                {t('website.modify')}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <Building className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-700 mb-2">
                    {t('website.noPropertiesFound')}
                  </h3>
                  <p className="text-gray-500 text-sm mb-4">
                    {t('website.addPropertiesDescription')}
                  </p>
                  <Button onClick={() => window.open('/admin/properties', '_blank')}>
                    <Building className="h-4 w-4 mr-2" />
                    {t('website.goToProperties')}
                  </Button>
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
                {selectedProperty ? t('website.editProperty') : t('website.websitePreviewTitle')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedProperty ? (
                <>
                  <div>
                    <Label className="text-sm font-medium">{t('website.propertyTitle')}</Label>
                    <div className="mt-1 p-3 bg-gray-50 rounded-md text-sm">{selectedProperty.title}</div>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium">{t('website.websiteDescriptionForProperty')}</Label>
                    <Textarea
                      placeholder={t('website.websiteDescriptionPlaceholder')}
                      rows={4}
                      value={propertySettings[selectedProperty.id]?.description || ''}
                      onChange={(e) => updatePropertyDescription(selectedProperty.id, e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div className="pt-4 border-t space-y-2">
                    <Button 
                      onClick={() => setSelectedProperty(null)}
                      variant="outline" 
                      className="w-full"
                    >
                      {t('website.close')}
                    </Button>
                  </div>
                </>
              ) : (
                <div className="space-y-4">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-blue-900 mb-1">
                      {t('website.websitePreviewTitle')}
                    </h4>
                    <p className="text-xs text-blue-700">
                      {t('website.websitePreviewDescription')}
                    </p>
                  </div>

                  {visibleProperties.length > 0 ? (
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium">{t('website.visibleProperties')} ({visibleProperties.length})</h4>
                      {visibleProperties.slice(0, 3).map((property) => (
                        <div key={property.id} className="bg-gray-50 rounded-lg p-3">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center overflow-hidden">
                              {property.image && property.image !== '/placeholder.svg' ? (
                                <img 
                                  src={property.image} 
                                  alt={property.title}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <ImageIcon className="h-4 w-4 text-gray-400" />
                              )}
                            </div>
                            <div className="flex-1">
                              <h5 className="text-sm font-medium truncate">{property.title}</h5>
                              <p className="text-xs text-gray-600">{property.rent}€/{t('common.month')}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                      {visibleProperties.length > 3 && (
                        <p className="text-xs text-gray-500 text-center">
                          +{visibleProperties.length - 3} {t('website.otherProperties')}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Building className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-500 text-sm">
                        {t('website.noVisiblePropertiesDescription')}
                      </p>
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

export default ImmoTab;
