
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Save, MapPin } from 'lucide-react';
import { toast } from 'sonner';

const MapTab = () => {
  const { t } = useTranslation();
  const [isSaving, setIsSaving] = useState(false);
  const [mapConfig, setMapConfig] = useState({
    enabled: true,
    address: '123 Peace Street, 75001 Paris',
    latitude: '48.8566',
    longitude: '2.3522',
    zoom: '15',
    showMarker: true,
    markerTitle: 'NeoRent - Property Management',
    apiKey: ''
  });

  const handleSaveMap = async () => {
    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Saving map configuration:', mapConfig);
      
      toast.success(t('website.contentSaved'), {
        description: t('website.contentSavedDescription')
      });
    } catch (error) {
      toast.error(t('website.contentSaveError'), {
        description: t('website.contentSaveErrorDescription')
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-900">🗺️ {t('website.mapConfiguration')}</h2>
        <Button 
          onClick={handleSaveMap} 
          disabled={isSaving}
          className="flex items-center gap-2 w-full sm:w-auto"
        >
          <Save className="h-4 w-4" />
          {isSaving ? t('website.saving') : t('website.save')}
        </Button>
      </div>
      <p className="text-gray-600 text-sm md:text-base">
        {t('website.mapConfigurationDescription')}
      </p>

      <Card>
        <CardHeader>
          <CardTitle className="text-base md:text-lg">{t('website.mapSettings')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">{t('website.showMap')}</Label>
              <p className="text-xs text-gray-600">{t('website.enableDisableMap')}</p>
            </div>
            <Switch
              checked={mapConfig.enabled}
              onCheckedChange={(checked) => setMapConfig({...mapConfig, enabled: checked})}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t('common.address')}</Label>
              <Input
                value={mapConfig.address}
                onChange={(e) => setMapConfig({...mapConfig, address: e.target.value})}
                placeholder={t('website.completeAddress')}
              />
            </div>
            <div className="space-y-2">
              <Label>{t('website.markerTitle')}</Label>
              <Input
                value={mapConfig.markerTitle}
                onChange={(e) => setMapConfig({...mapConfig, markerTitle: e.target.value})}
                placeholder={t('website.nameDisplayedOnMarker')}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>{t('website.latitude')}</Label>
              <Input
                value={mapConfig.latitude}
                onChange={(e) => setMapConfig({...mapConfig, latitude: e.target.value})}
                placeholder="48.8566"
              />
            </div>
            <div className="space-y-2">
              <Label>{t('website.longitude')}</Label>
              <Input
                value={mapConfig.longitude}
                onChange={(e) => setMapConfig({...mapConfig, longitude: e.target.value})}
                placeholder="2.3522"
              />
            </div>
            <div className="space-y-2">
              <Label>{t('website.zoomLevel')}</Label>
              <Input
                value={mapConfig.zoom}
                onChange={(e) => setMapConfig({...mapConfig, zoom: e.target.value})}
                placeholder="15"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">{t('website.showMarker')}</Label>
              <p className="text-xs text-gray-600">{t('website.markPositionOnMap')}</p>
            </div>
            <Switch
              checked={mapConfig.showMarker}
              onCheckedChange={(checked) => setMapConfig({...mapConfig, showMarker: checked})}
            />
          </div>

          <div className="space-y-2">
            <Label>{t('website.googleMapsApiKey')}</Label>
            <Input
              type="password"
              value={mapConfig.apiKey}
              onChange={(e) => setMapConfig({...mapConfig, apiKey: e.target.value})}
              placeholder={t('website.yourGoogleMapsApiKey')}
            />
            <p className="text-xs text-gray-500">
              {t('website.leaveEmptyForDefaultMap')}
            </p>
          </div>
        </CardContent>
      </Card>

      {mapConfig.enabled && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base md:text-lg">{t('website.preview')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-500">
                <MapPin className="h-8 w-8 mx-auto mb-2" />
                <p>{t('website.mapPreview')}</p>
                <p className="text-sm">{mapConfig.address}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MapTab;
