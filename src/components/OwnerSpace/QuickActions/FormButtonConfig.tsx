
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings, Palette } from 'lucide-react';

interface FormButtonConfigProps {
  actionId: string;
  currentConfig: {
    variant: 'default' | 'outline' | 'destructive' | 'secondary' | 'ghost' | 'link';
    size: 'default' | 'sm' | 'lg' | 'icon';
    className?: string;
  };
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

  const getLocalizedText = (key: string) => {
    const currentLang = i18n.language;
    
    const texts: Record<string, Record<string, string>> = {
      configureButton: {
        fr: 'Configurer le bouton',
        en: 'Configure Button'
      },
      variant: {
        fr: 'Variante',
        en: 'Variant'
      },
      size: {
        fr: 'Taille',
        en: 'Size'
      },
      default: {
        fr: 'Par défaut',
        en: 'Default'
      },
      outline: {
        fr: 'Contour',
        en: 'Outline'
      },
      destructive: {
        fr: 'Destructeur',
        en: 'Destructive'
      },
      secondary: {
        fr: 'Secondaire',
        en: 'Secondary'
      },
      ghost: {
        fr: 'Fantôme',
        en: 'Ghost'
      },
      link: {
        fr: 'Lien',
        en: 'Link'
      },
      small: {
        fr: 'Petit',
        en: 'Small'
      },
      large: {
        fr: 'Grand',
        en: 'Large'
      },
      save: {
        fr: 'Sauvegarder',
        en: 'Save'
      },
      cancel: {
        fr: 'Annuler',
        en: 'Cancel'
      }
    };

    return texts[key]?.[currentLang] || texts[key]?.['fr'] || key;
  };

  const handleSave = () => {
    onConfigChange(currentConfig);
    onClose();
  };

  return (
    <Card className="w-80">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Settings className="h-4 w-4" />
          {getLocalizedText('configureButton')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium">{getLocalizedText('variant')}</Label>
          <RadioGroup
            value={currentConfig.variant}
            onValueChange={(value) => 
              onConfigChange({ ...currentConfig, variant: value as any })
            }
            className="grid grid-cols-2 gap-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="default" id="default" />
              <Label htmlFor="default" className="text-xs">{getLocalizedText('default')}</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="outline" id="outline" />
              <Label htmlFor="outline" className="text-xs">{getLocalizedText('outline')}</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="secondary" id="secondary" />
              <Label htmlFor="secondary" className="text-xs">{getLocalizedText('secondary')}</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="ghost" id="ghost" />
              <Label htmlFor="ghost" className="text-xs">{getLocalizedText('ghost')}</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">{getLocalizedText('size')}</Label>
          <Select
            value={currentConfig.size}
            onValueChange={(value) => 
              onConfigChange({ ...currentConfig, size: value as any })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sm">{getLocalizedText('small')}</SelectItem>
              <SelectItem value="default">{getLocalizedText('default')}</SelectItem>
              <SelectItem value="lg">{getLocalizedText('large')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" size="sm" onClick={onClose}>
            {getLocalizedText('cancel')}
          </Button>
          <Button size="sm" onClick={handleSave}>
            {getLocalizedText('save')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FormButtonConfig;
