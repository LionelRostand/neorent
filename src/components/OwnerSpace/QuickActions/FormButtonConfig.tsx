
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useFormButtonConfig } from '@/hooks/useFormButtonConfig';
import { X, Save } from 'lucide-react';

interface FormButtonConfigProps {
  actionId: string;
  currentConfig: any;
  onConfigChange: (config: any) => void;
  onClose: () => void;
}

const FormButtonConfig: React.FC<FormButtonConfigProps> = ({
  actionId,
  currentConfig,
  onConfigChange,
  onClose
}) => {
  const { i18n } = useTranslation();
  const { saveButtonConfig } = useFormButtonConfig();
  const [config, setConfig] = useState(currentConfig || {
    title: { fr: '', en: '' },
    description: { fr: '', en: '' },
    color: 'bg-blue-500',
    enabled: true
  });
  const [saving, setSaving] = useState(false);

  const getLocalizedText = (key: string) => {
    const currentLang = i18n.language;
    
    const texts: Record<string, Record<string, string>> = {
      configureButton: {
        fr: 'Configurer le bouton',
        en: 'Configure Button'
      },
      titleFr: {
        fr: 'Titre (Français)',
        en: 'Title (French)'
      },
      titleEn: {
        fr: 'Titre (Anglais)',
        en: 'Title (English)'
      },
      descriptionFr: {
        fr: 'Description (Français)',
        en: 'Description (French)'
      },
      descriptionEn: {
        fr: 'Description (Anglais)',
        en: 'Description (English)'
      },
      buttonColor: {
        fr: 'Couleur du bouton',
        en: 'Button Color'
      },
      blue: {
        fr: 'Bleu',
        en: 'Blue'
      },
      green: {
        fr: 'Vert',
        en: 'Green'
      },
      red: {
        fr: 'Rouge',
        en: 'Red'
      },
      orange: {
        fr: 'Orange',
        en: 'Orange'
      },
      purple: {
        fr: 'Violet',
        en: 'Purple'
      },
      cancel: {
        fr: 'Annuler',
        en: 'Cancel'
      },
      save: {
        fr: 'Sauvegarder',
        en: 'Save'
      }
    };

    return texts[key]?.[currentLang] || texts[key]?.['fr'] || key;
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveButtonConfig(actionId, config);
      onConfigChange(config);
      onClose();
    } catch (error) {
      console.error('Error saving button config:', error);
    } finally {
      setSaving(false);
    }
  };

  const colorOptions = [
    { value: 'bg-blue-500', label: getLocalizedText('blue') },
    { value: 'bg-green-500', label: getLocalizedText('green') },
    { value: 'bg-red-500', label: getLocalizedText('red') },
    { value: 'bg-orange-500', label: getLocalizedText('orange') },
    { value: 'bg-purple-500', label: getLocalizedText('purple') }
  ];

  return (
    <div className="w-80 p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          {getLocalizedText('configureButton')}
        </h3>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="title-fr">{getLocalizedText('titleFr')}</Label>
          <Input
            id="title-fr"
            value={config.title?.fr || ''}
            onChange={(e) => setConfig(prev => ({
              ...prev,
              title: { ...prev.title, fr: e.target.value }
            }))}
            placeholder="Titre en français"
          />
        </div>

        <div>
          <Label htmlFor="title-en">{getLocalizedText('titleEn')}</Label>
          <Input
            id="title-en"
            value={config.title?.en || ''}
            onChange={(e) => setConfig(prev => ({
              ...prev,
              title: { ...prev.title, en: e.target.value }
            }))}
            placeholder="Title in English"
          />
        </div>

        <div>
          <Label htmlFor="desc-fr">{getLocalizedText('descriptionFr')}</Label>
          <Textarea
            id="desc-fr"
            value={config.description?.fr || ''}
            onChange={(e) => setConfig(prev => ({
              ...prev,
              description: { ...prev.description, fr: e.target.value }
            }))}
            placeholder="Description en français"
            rows={2}
          />
        </div>

        <div>
          <Label htmlFor="desc-en">{getLocalizedText('descriptionEn')}</Label>
          <Textarea
            id="desc-en"
            value={config.description?.en || ''}
            onChange={(e) => setConfig(prev => ({
              ...prev,
              description: { ...prev.description, en: e.target.value }
            }))}
            placeholder="Description in English"
            rows={2}
          />
        </div>

        <div>
          <Label>{getLocalizedText('buttonColor')}</Label>
          <Select
            value={config.color || 'bg-blue-500'}
            onValueChange={(value) => setConfig(prev => ({ ...prev, color: value }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {colorOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded ${option.value}`} />
                    {option.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button variant="outline" onClick={onClose} disabled={saving}>
          {getLocalizedText('cancel')}
        </Button>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              {getLocalizedText('save')}
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              {getLocalizedText('save')}
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default FormButtonConfig;
