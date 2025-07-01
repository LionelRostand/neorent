
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save, Eye, Monitor, Smartphone } from 'lucide-react';
import { toast } from 'sonner';

const ThemeTab = () => {
  const { t } = useTranslation();
  const [isSaving, setIsSaving] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState('modern');
  const [customColors, setCustomColors] = useState({
    primary: '#3b82f6',
    secondary: '#64748b',
    accent: '#f59e0b'
  });
  const [typography, setTypography] = useState({
    fontFamily: 'Inter',
    fontSize: '16px - Normal'
  });
  const [previewMode, setPreviewMode] = useState('desktop');

  const themes = [
    { id: 'modern', name: t('website.modern'), color: '#3b82f6' },
    { id: 'classic', name: t('website.classic'), color: '#374151' },
    { id: 'nature', name: t('website.nature'), color: '#10b981' },
    { id: 'sunset', name: t('website.sunset'), color: '#f97316' },
    { id: 'ocean', name: t('website.ocean'), color: '#0ea5e9' },
    { id: 'minimalist', name: t('website.minimalist'), color: '#6b7280' }
  ];

  const handleSaveTheme = async () => {
    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Saving theme configuration:', {
        selectedTheme,
        customColors,
        typography
      });
      
      toast.success(t('website.themeConfigurationSaved'), {
        description: t('website.visualAppearanceUpdated')
      });
    } catch (error) {
      toast.error(t('website.errorSavingTheme'), {
        description: t('website.pleaseRetry')
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-semibold text-gray-900">🎨 {t('website.themeCustomization')}</h2>
          <p className="text-gray-600 text-sm md:text-base">
            {t('website.themeCustomizationDescription')}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            {t('website.preview')}
          </Button>
          <Button 
            onClick={handleSaveTheme}
            disabled={isSaving}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            {isSaving ? t('website.saving') : t('website.save')}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base md:text-lg">🎯 {t('website.predefinedThemes')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {themes.map((theme) => (
              <div 
                key={theme.id}
                className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                  selectedTheme === theme.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`}
                onClick={() => setSelectedTheme(theme.id)}
              >
                <div 
                  className="h-20 rounded-t-lg mb-3"
                  style={{ backgroundColor: theme.color }}
                />
                <div className="bg-white rounded-b-lg p-3">
                  <h4 className="font-medium text-center">{theme.name}</h4>
                  {selectedTheme === theme.id && (
                    <p className="text-xs text-blue-600 text-center mt-1">{t('website.selected')}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base md:text-lg">{t('website.customColors')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t('website.primaryColor')}</Label>
              <div className="flex gap-2">
                <div 
                  className="w-10 h-10 rounded border"
                  style={{ backgroundColor: customColors.primary }}
                />
                <Input
                  value={customColors.primary}
                  onChange={(e) => setCustomColors({...customColors, primary: e.target.value})}
                  placeholder="#3b82f6"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>{t('website.secondaryColor')}</Label>
              <div className="flex gap-2">
                <div 
                  className="w-10 h-10 rounded border"
                  style={{ backgroundColor: customColors.secondary }}
                />
                <Input
                  value={customColors.secondary}
                  onChange={(e) => setCustomColors({...customColors, secondary: e.target.value})}
                  placeholder="#64748b"
                />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label>{t('website.accentColor')}</Label>
            <div className="flex gap-2">
              <div 
                className="w-10 h-10 rounded border"
                style={{ backgroundColor: customColors.accent }}
              />
              <Input
                value={customColors.accent}
                onChange={(e) => setCustomColors({...customColors, accent: e.target.value})}
                placeholder="#f59e0b"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base md:text-lg">{t('website.typography')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t('website.fontFamily')}</Label>
              <Select value={typography.fontFamily} onValueChange={(value) => setTypography({...typography, fontFamily: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select font" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Inter">Inter</SelectItem>
                  <SelectItem value="Roboto">Roboto</SelectItem>
                  <SelectItem value="Open Sans">Open Sans</SelectItem>
                  <SelectItem value="Lato">Lato</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{t('website.fontSize')}</Label>
              <Select value={typography.fontSize} onValueChange={(value) => setTypography({...typography, fontSize: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="14px - Small">14px - Small</SelectItem>
                  <SelectItem value="16px - Normal">16px - Normal</SelectItem>
                  <SelectItem value="18px - Large">18px - Large</SelectItem>
                  <SelectItem value="20px - Extra Large">20px - Extra Large</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base md:text-lg">{t('website.realTimePreview')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Button 
                variant={previewMode === 'desktop' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setPreviewMode('desktop')}
              >
                <Monitor className="h-4 w-4 mr-2" />
                {t('website.desktop')}
              </Button>
              <Button 
                variant={previewMode === 'mobile' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setPreviewMode('mobile')}
              >
                <Smartphone className="h-4 w-4 mr-2" />
                {t('website.mobile')}
              </Button>
            </div>
            
            <div className="border-2 border-dashed border-blue-300 rounded-lg p-8 text-center bg-gray-50">
              <h3 className="text-xl font-semibold text-blue-600 mb-2">{t('website.themePreview')}</h3>
              <p className="text-gray-600">{t('website.themePreviewDescription')}</p>
              <Button 
                className="mt-4" 
                style={{ backgroundColor: customColors.accent }}
              >
                {t('website.sampleButton')}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ThemeTab;
