
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Settings, Palette } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useFormButtonConfig, FormButtonConfig } from '@/hooks/useFormButtonConfig';
import { useAuth } from '@/hooks/useAuth';

interface FormButtonConfigPanelProps {
  actionIds: string[];
  title?: string;
}

const FormButtonConfigPanel: React.FC<FormButtonConfigPanelProps> = ({ 
  actionIds, 
  title = "Configuration des boutons" 
}) => {
  const { i18n } = useTranslation();
  const { userType } = useAuth();
  const { getButtonConfig, saveButtonConfig } = useFormButtonConfig();
  const [isOpen, setIsOpen] = useState(false);
  const [configs, setConfigs] = useState<Record<string, FormButtonConfig>>(() => {
    const initialConfigs: Record<string, FormButtonConfig> = {};
    actionIds.forEach(id => {
      initialConfigs[id] = getButtonConfig(id);
    });
    return initialConfigs;
  });

  const isAdmin = userType === 'admin';

  const getLocalizedText = (key: string) => {
    const currentLang = i18n.language;
    
    const texts: Record<string, Record<string, string>> = {
      configureButtons: {
        fr: 'Configurer les boutons',
        en: 'Configure Buttons'
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
      },
      property: {
        fr: 'Propriété',
        en: 'Property'
      },
      roommate: {
        fr: 'Locataire',
        en: 'Tenant'
      },
      inspection: {
        fr: 'Inspection',
        en: 'Inspection'
      },
      contract: {
        fr: 'Contrat',
        en: 'Contract'
      }
    };

    return texts[key]?.[currentLang] || texts[key]?.['fr'] || key;
  };

  const handleConfigChange = (actionId: string, field: keyof FormButtonConfig, value: any) => {
    setConfigs(prev => ({
      ...prev,
      [actionId]: {
        ...prev[actionId],
        [field]: value
      }
    }));
  };

  const handleSaveAll = async () => {
    let hasErrors = false;
    for (const [actionId, config] of Object.entries(configs)) {
      const success = await saveButtonConfig(actionId, config);
      if (!success) {
        hasErrors = true;
      }
    }
    
    if (!hasErrors) {
      setIsOpen(false);
    }
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <Card className="mb-6">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Settings className="h-5 w-5" />
              {getLocalizedText('configureButtons')}
              <Palette className="h-4 w-4 text-gray-500" />
            </CardTitle>
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="space-y-6">
            {actionIds.map((actionId) => (
              <div key={actionId} className="p-4 border rounded-lg space-y-4">
                <h4 className="font-medium text-sm text-gray-700">
                  {getLocalizedText(actionId)}
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">{getLocalizedText('variant')}</Label>
                    <RadioGroup
                      value={configs[actionId]?.variant || 'default'}
                      onValueChange={(value) => handleConfigChange(actionId, 'variant', value)}
                      className="grid grid-cols-2 gap-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="default" id={`${actionId}-default`} />
                        <Label htmlFor={`${actionId}-default`} className="text-xs">{getLocalizedText('default')}</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="outline" id={`${actionId}-outline`} />
                        <Label htmlFor={`${actionId}-outline`} className="text-xs">{getLocalizedText('outline')}</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="secondary" id={`${actionId}-secondary`} />
                        <Label htmlFor={`${actionId}-secondary`} className="text-xs">{getLocalizedText('secondary')}</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="ghost" id={`${actionId}-ghost`} />
                        <Label htmlFor={`${actionId}-ghost`} className="text-xs">{getLocalizedText('ghost')}</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">{getLocalizedText('size')}</Label>
                    <Select
                      value={configs[actionId]?.size || 'default'}
                      onValueChange={(value) => handleConfigChange(actionId, 'size', value)}
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
                </div>
              </div>
            ))}

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" size="sm" onClick={() => setIsOpen(false)}>
                {getLocalizedText('cancel')}
              </Button>
              <Button size="sm" onClick={handleSaveAll}>
                {getLocalizedText('save')}
              </Button>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default FormButtonConfigPanel;
