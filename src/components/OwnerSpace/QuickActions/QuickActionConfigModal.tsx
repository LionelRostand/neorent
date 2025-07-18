
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { QuickActionConfig } from '@/hooks/useQuickActionsManager';

interface QuickActionConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  action: QuickActionConfig | null;
  onSave: (updatedAction: QuickActionConfig) => Promise<boolean>;
}

const colorOptions = [
  { value: 'bg-slate-500', label: 'Gris', color: 'bg-slate-500' },
  { value: 'bg-blue-500', label: 'Bleu', color: 'bg-blue-500' },
  { value: 'bg-purple-500', label: 'Violet', color: 'bg-purple-500' },
  { value: 'bg-pink-500', label: 'Rose', color: 'bg-pink-500' },
  { value: 'bg-yellow-500', label: 'Jaune', color: 'bg-yellow-500' },
  { value: 'bg-orange-500', label: 'Orange', color: 'bg-orange-500' },
  { value: 'bg-green-500', label: 'Vert', color: 'bg-green-500' },
  { value: 'bg-teal-500', label: 'Sarcelle', color: 'bg-teal-500' },
  { value: 'bg-emerald-500', label: 'Émeraude', color: 'bg-emerald-500' },
  { value: 'bg-red-500', label: 'Rouge', color: 'bg-red-500' },
  { value: 'bg-indigo-500', label: 'Indigo', color: 'bg-indigo-500' },
  { value: 'bg-cyan-500', label: 'Cyan', color: 'bg-cyan-500' },
  { value: 'bg-violet-500', label: 'Violet foncé', color: 'bg-violet-500' },
  { value: 'bg-gray-500', label: 'Gris foncé', color: 'bg-gray-500' },
  { value: 'bg-amber-500', label: 'Ambre', color: 'bg-amber-500' },
];

const QuickActionConfigModal: React.FC<QuickActionConfigModalProps> = ({
  isOpen,
  onClose,
  action,
  onSave
}) => {
  const { i18n, t } = useTranslation();
  const [formData, setFormData] = useState<QuickActionConfig | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (action) {
      setFormData({ ...action });
    }
  }, [action]);

  const getLocalizedText = (key: string) => {
    const currentLang = i18n.language;
    
    const texts: Record<string, Record<string, string>> = {
      configureAction: {
        fr: 'Configurer l\'action rapide',
        en: 'Configure Quick Action'
      },
      titleKey: {
        fr: 'Clé de titre',
        en: 'Title Key'
      },
      descriptionKey: {
        fr: 'Clé de description',
        en: 'Description Key'
      },
      color: {
        fr: 'Couleur',
        en: 'Color'
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

  const handleSave = async () => {
    if (!formData) return;

    setSaving(true);
    try {
      const success = await onSave(formData);
      if (success) {
        onClose();
      }
    } finally {
      setSaving(false);
    }
  };

  if (!formData) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{getLocalizedText('configureAction')}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="title-key">{getLocalizedText('titleKey')}</Label>
            <Input
              id="title-key"
              value={formData.titleKey}
              onChange={(e) => setFormData({
                ...formData,
                titleKey: e.target.value
              })}
              placeholder="quickActions.dashboard.title"
            />
            <p className="text-xs text-gray-500 mt-1">
              Clé de traduction pour le titre (ex: quickActions.dashboard.title)
            </p>
          </div>

          <div>
            <Label htmlFor="description-key">{getLocalizedText('descriptionKey')}</Label>
            <Input
              id="description-key"
              value={formData.descriptionKey}
              onChange={(e) => setFormData({
                ...formData,
                descriptionKey: e.target.value
              })}
              placeholder="quickActions.dashboard.description"
            />
            <p className="text-xs text-gray-500 mt-1">
              Clé de traduction pour la description (ex: quickActions.dashboard.description)
            </p>
          </div>

          <div>
            <Label>{getLocalizedText('color')}</Label>
            <Select
              value={formData.color}
              onValueChange={(value) => setFormData({ ...formData, color: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une couleur" />
              </SelectTrigger>
              <SelectContent>
                {colorOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded ${option.color}`} />
                      <span>{option.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              {getLocalizedText('cancel')}
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? 'Sauvegarde...' : getLocalizedText('save')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuickActionConfigModal;
