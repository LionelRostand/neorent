
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Settings, Trash2, GripVertical } from 'lucide-react';
import { useQuickActionsManager, QuickActionConfig } from '@/hooks/useQuickActionsManager';

const QuickActionsManager: React.FC = () => {
  const { i18n } = useTranslation();
  const { quickActions, isAdmin, toggleAction, removeAction, addCustomAction, saving } = useQuickActionsManager();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newAction, setNewAction] = useState<Partial<QuickActionConfig>>({
    enabled: true,
    action: 'navigate',
    color: 'bg-blue-500'
  });

  const getLocalizedText = (key: string) => {
    const currentLang = i18n.language;
    
    const texts: Record<string, Record<string, string>> = {
      manageActions: {
        fr: 'Gérer les actions rapides',
        en: 'Manage Quick Actions'
      },
      addAction: {
        fr: 'Ajouter une action',
        en: 'Add Action'
      },
      title: {
        fr: 'Titre',
        en: 'Title'
      },
      description: {
        fr: 'Description',
        en: 'Description'
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
      actionType: {
        fr: 'Type d\'action',
        en: 'Action Type'
      },
      actionValue: {
        fr: 'Valeur de l\'action',
        en: 'Action Value'
      },
      navigate: {
        fr: 'Navigation',
        en: 'Navigate'
      },
      dialog: {
        fr: 'Dialogue',
        en: 'Dialog'
      },
      color: {
        fr: 'Couleur',
        en: 'Color'
      },
      enabled: {
        fr: 'Activé',
        en: 'Enabled'
      },
      save: {
        fr: 'Sauvegarder',
        en: 'Save'
      },
      cancel: {
        fr: 'Annuler',
        en: 'Cancel'
      },
      delete: {
        fr: 'Supprimer',
        en: 'Delete'
      },
      adminOnly: {
        fr: 'Seuls les administrateurs peuvent gérer les actions rapides',
        en: 'Only administrators can manage quick actions'
      }
    };

    return texts[key]?.[currentLang] || texts[key]?.['fr'] || key;
  };

  const colorOptions = [
    { value: 'bg-slate-500', label: 'Slate' },
    { value: 'bg-blue-500', label: 'Blue' },
    { value: 'bg-yellow-500', label: 'Yellow' },
    { value: 'bg-purple-500', label: 'Purple' },
    { value: 'bg-orange-500', label: 'Orange' },
    { value: 'bg-emerald-500', label: 'Emerald' },
    { value: 'bg-red-500', label: 'Red' },
    { value: 'bg-indigo-500', label: 'Indigo' },
    { value: 'bg-cyan-500', label: 'Cyan' },
    { value: 'bg-teal-500', label: 'Teal' }
  ];

  const handleAddAction = async () => {
    if (newAction.title?.fr && newAction.title?.en && newAction.description?.fr && newAction.description?.en) {
      await addCustomAction({
        id: `custom_${Date.now()}`,
        title: newAction.title,
        description: newAction.description,
        icon: newAction.icon || 'Plus',
        color: newAction.color || 'bg-blue-500',
        enabled: newAction.enabled || true,
        action: newAction.action || 'navigate',
        actionValue: newAction.actionValue || '#'
      });
      setNewAction({
        enabled: true,
        action: 'navigate',
        color: 'bg-blue-500'
      });
      setIsAddDialogOpen(false);
    }
  };

  if (!isAdmin) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-gray-600 text-center">{getLocalizedText('adminOnly')}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            {getLocalizedText('manageActions')}
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                {getLocalizedText('addAction')}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{getLocalizedText('addAction')}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>{getLocalizedText('titleFr')}</Label>
                  <Input
                    value={newAction.title?.fr || ''}
                    onChange={(e) => setNewAction({
                      ...newAction,
                      title: { ...newAction.title, fr: e.target.value, en: newAction.title?.en || '' }
                    })}
                  />
                </div>
                <div>
                  <Label>{getLocalizedText('titleEn')}</Label>
                  <Input
                    value={newAction.title?.en || ''}
                    onChange={(e) => setNewAction({
                      ...newAction,
                      title: { ...newAction.title, en: e.target.value, fr: newAction.title?.fr || '' }
                    })}
                  />
                </div>
                <div>
                  <Label>{getLocalizedText('descriptionFr')}</Label>
                  <Input
                    value={newAction.description?.fr || ''}
                    onChange={(e) => setNewAction({
                      ...newAction,
                      description: { ...newAction.description, fr: e.target.value, en: newAction.description?.en || '' }
                    })}
                  />
                </div>
                <div>
                  <Label>{getLocalizedText('descriptionEn')}</Label>
                  <Input
                    value={newAction.description?.en || ''}
                    onChange={(e) => setNewAction({
                      ...newAction,
                      description: { ...newAction.description, en: e.target.value, fr: newAction.description?.fr || '' }
                    })}
                  />
                </div>
                <div>
                  <Label>{getLocalizedText('actionType')}</Label>
                  <Select value={newAction.action} onValueChange={(value) => setNewAction({ ...newAction, action: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="navigate">{getLocalizedText('navigate')}</SelectItem>
                      <SelectItem value="dialog">{getLocalizedText('dialog')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>{getLocalizedText('actionValue')}</Label>
                  <Input
                    value={newAction.actionValue || ''}
                    onChange={(e) => setNewAction({ ...newAction, actionValue: e.target.value })}
                    placeholder={newAction.action === 'navigate' ? '/admin/example' : 'dialogName'}
                  />
                </div>
                <div>
                  <Label>{getLocalizedText('color')}</Label>
                  <Select value={newAction.color} onValueChange={(value) => setNewAction({ ...newAction, color: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {colorOptions.map((color) => (
                        <SelectItem key={color.value} value={color.value}>
                          <div className="flex items-center gap-2">
                            <div className={`w-4 h-4 rounded ${color.value}`} />
                            {color.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    {getLocalizedText('cancel')}
                  </Button>
                  <Button onClick={handleAddAction} disabled={saving}>
                    {getLocalizedText('save')}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {quickActions.map((action) => (
            <div key={action.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <GripVertical className="h-4 w-4 text-gray-400" />
                <div className={`p-2 rounded ${action.color}`}>
                  <div className="w-4 h-4 bg-white rounded-sm" />
                </div>
                <div>
                  <div className="font-medium">
                    {action.title[i18n.language as 'fr' | 'en'] || action.title.fr}
                  </div>
                  <div className="text-sm text-gray-500">
                    {action.description[i18n.language as 'fr' | 'en'] || action.description.fr}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={action.enabled}
                  onCheckedChange={() => toggleAction(action.id)}
                />
                {action.id.startsWith('custom_') && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeAction(action.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActionsManager;
