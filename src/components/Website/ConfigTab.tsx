
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Save } from 'lucide-react';
import { toast } from 'sonner';

const ConfigTab = () => {
  const { t } = useTranslation();
  const [seoSettings, setSeoSettings] = useState({
    title: 'NeoRent - Simplified Property Management',
    description: 'NeoRent revolutionizes the management of your real estate properties with a complete, intuitive and efficient platform.',
    keywords: 'real estate properties, rentals, shared housing'
  });

  const [features, setFeatures] = useState({
    onlineBooking: true,
    onlineQuote: true,
    liveChat: true
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSaveSEO = async () => {
    setIsSaving(true);
    try {
      // Simulation of saving
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Saving configuration settings:', {
        seoSettings,
        features
      });
      
      toast.success(t('website.contentSaved'), {
        description: t('website.contentSavedDescription')
      });
    } catch (error) {
      console.error('Error during save:', error);
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
        <h2 className="text-xl md:text-2xl font-semibold text-gray-900">⚙️ {t('website.generalConfiguration')}</h2>
        <Button 
          onClick={handleSaveSEO} 
          disabled={isSaving}
          className="flex items-center gap-2 w-full sm:w-auto"
        >
          <Save className="h-4 w-4" />
          {isSaving ? t('website.saving') : t('website.save')}
        </Button>
      </div>
      <p className="text-gray-600 text-sm md:text-base">
        {t('website.seoSettingsDescription')}
      </p>

      <Card>
        <CardHeader>
          <CardTitle className="text-base md:text-lg">{t('website.seoSettings')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm">{t('website.siteTitle')}</Label>
            <Input
              value={seoSettings.title}
              onChange={(e) => setSeoSettings({...seoSettings, title: e.target.value})}
              className="text-sm"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm">{t('common.description')}</Label>
            <Textarea
              value={seoSettings.description}
              onChange={(e) => setSeoSettings({...seoSettings, description: e.target.value})}
              rows={2}
              className="text-sm resize-none"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm">{t('website.keywords')}</Label>
            <Input
              value={seoSettings.keywords}
              onChange={(e) => setSeoSettings({...seoSettings, keywords: e.target.value})}
              className="text-sm"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base md:text-lg">{t('website.features')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div className="flex-1">
              <Label className="text-sm font-medium">✅ {t('website.onlineBooking')}</Label>
              <p className="text-xs md:text-sm text-gray-600">{t('website.allowClientsToBookAppointments')}</p>
            </div>
            <Switch
              checked={features.onlineBooking}
              onCheckedChange={(checked) => setFeatures({...features, onlineBooking: checked})}
            />
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div className="flex-1">
              <Label className="text-sm font-medium">✅ {t('website.onlineQuotes')}</Label>
              <p className="text-xs md:text-sm text-gray-600">{t('website.quoteRequestForm')}</p>
            </div>
            <Switch
              checked={features.onlineQuote}
              onCheckedChange={(checked) => setFeatures({...features, onlineQuote: checked})}
            />
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div className="flex-1">
              <Label className="text-sm font-medium">✅ {t('website.liveChat')}</Label>
              <p className="text-xs md:text-sm text-gray-600">{t('website.realTimeCustomerSupport')}</p>
            </div>
            <Switch
              checked={features.liveChat}
              onCheckedChange={(checked) => setFeatures({...features, liveChat: checked})}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base md:text-lg">{t('website.quickAccess')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Button variant="outline" className="w-full sm:w-auto text-sm">
              {t('website.clientAreaAccess')}
            </Button>
            <Button variant="outline" className="w-full sm:w-auto text-sm">
              {t('website.firebaseConnection')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConfigTab;
