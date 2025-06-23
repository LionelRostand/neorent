import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Settings, Trash2, GripVertical, Loader2, Shield, User } from 'lucide-react';
import { useQuickActionsManager, QuickActionConfig } from '@/hooks/useQuickActionsManager';
import { useAuth } from '@/hooks/useAuth';

const QuickActionsManager: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { userType, userProfile } = useAuth();
  const { quickActions, isAdmin, toggleAction, removeAction, addCustomAction, saving } = useQuickActionsManager();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [toggleStates, setToggleStates] = useState<Record<string, boolean>>({});
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
    { value: 'bg-teal-500', label: 'Teal' },
    { value: 'bg-pink-500', label: 'Pink' },
    { value: 'bg-gray-500', label: 'Gray' }
  ];

  const handleToggleAction = async (actionId: string) => {
    // Set loading state for this specific toggle
    setToggleStates(prev => ({ ...prev, [actionId]: true }));
    
    try {
      await toggleAction(actionId);
    } finally {
      // Clear loading state
      setToggleStates(prev => ({ ...prev, [actionId]: false }));
    }
  };

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
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="h-5 w-5 text-orange-500" />
            <h3 className="text-lg font-semibold">Permissions insuffisantes</h3>
          </div>
          
          <div className="space-y-3">
            <p className="text-gray-600 text-sm sm:text-base">{getLocalizedText('adminOnly')}</p>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <User className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">Informations utilisateur :</span>
              </div>
              <div className="space-y-1 text-xs text-gray-600">
                <p><strong>Type :</strong> {userType || 'Non défini'}</p>
                <p><strong>Email :</strong> {userProfile?.email || 'Non disponible'}</p>
                <p><strong>Nom :</strong> {userProfile?.name || 'Non disponible'}</p>
                {userProfile?.permissions && (
                  <div>
                    <strong>Permissions :</strong>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {Array.isArray(userProfile.permissions) ? (
                        userProfile.permissions.map((permission: string) => (
                          <Badge key={permission} variant="outline" className="text-xs">
                            {permission}
                          </Badge>
                        ))
                      ) : (
                        <Badge variant="outline" className="text-xs">
                          {userProfile.permissions}
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="bg-blue-50 p-3 rounded-lg border-l-4 border-blue-400">
              <p className="text-sm text-blue-800">
                <strong>Note :</strong> Pour gérer les actions rapides, vous devez être connecté en tant qu'administrateur.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader className="pb-3 px-3 sm:px-6">
        <CardTitle className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Settings className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
            <span className="text-base sm:text-lg font-semibold truncate">{getLocalizedText('manageActions')}</span>
            <Badge variant="outline" className="text-xs">
              <Shield className="h-3 w-3 mr-1" />
              Admin
            </Badge>
          </div>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="w-full sm:w-auto text-sm">
                <Plus className="h-4 w-4 mr-2 flex-shrink-0" />
                <span className="truncate">{getLocalizedText('addAction')}</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[95vw] max-w-md max-h-[95vh] overflow-y-auto mx-auto">
              <DialogHeader className="px-1">
                <DialogTitle className="text-base sm:text-lg">{getLocalizedText('addAction')}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 px-1">
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <Label className="text-xs sm:text-sm">{getLocalizedText('titleFr')}</Label>
                    <Input
                      value={newAction.title?.fr || ''}
                      onChange={(e) => setNewAction({
                        ...newAction,
                        title: { ...newAction.title, fr: e.target.value, en: newAction.title?.en || '' }
                      })}
                      className="text-xs sm:text-sm h-8 sm:h-10"
                      placeholder="Titre français..."
                    />
                  </div>
                  <div>
                    <Label className="text-xs sm:text-sm">{getLocalizedText('titleEn')}</Label>
                    <Input
                      value={newAction.title?.en || ''}
                      onChange={(e) => setNewAction({
                        ...newAction,
                        title: { ...newAction.title, en: e.target.value, fr: newAction.title?.fr || '' }
                      })}
                      className="text-xs sm:text-sm h-8 sm:h-10"
                      placeholder="English title..."
                    />
                  </div>
                  <div>
                    <Label className="text-xs sm:text-sm">{getLocalizedText('descriptionFr')}</Label>
                    <Input
                      value={newAction.description?.fr || ''}
                      onChange={(e) => setNewAction({
                        ...newAction,
                        description: { ...newAction.description, fr: e.target.value, en: newAction.description?.en || '' }
                      })}
                      className="text-xs sm:text-sm h-8 sm:h-10"
                      placeholder="Description française..."
                    />
                  </div>
                  <div>
                    <Label className="text-xs sm:text-sm">{getLocalizedText('descriptionEn')}</Label>
                    <Input
                      value={newAction.description?.en || ''}
                      onChange={(e) => setNewAction({
                        ...newAction,
                        description: { ...newAction.description, en: e.target.value, fr: newAction.description?.fr || '' }
                      })}
                      className="text-xs sm:text-sm h-8 sm:h-10"
                      placeholder="English description..."
                    />
                  </div>
                  <div>
                    <Label className="text-xs sm:text-sm">{getLocalizedText('actionType')}</Label>
                    <Select value={newAction.action} onValueChange={(value) => setNewAction({ ...newAction, action: value })}>
                      <SelectTrigger className="text-xs sm:text-sm h-8 sm:h-10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="navigate">{getLocalizedText('navigate')}</SelectItem>
                        <SelectItem value="dialog">{getLocalizedText('dialog')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs sm:text-sm">{getLocalizedText('actionValue')}</Label>
                    <Input
                      value={newAction.actionValue || ''}
                      onChange={(e) => setNewAction({ ...newAction, actionValue: e.target.value })}
                      placeholder={newAction.action === 'navigate' ? '/admin/example' : 'dialogName'}
                      className="text-xs sm:text-sm h-8 sm:h-10"
                    />
                  </div>
                  <div>
                    <Label className="text-xs sm:text-sm">{getLocalizedText('color')}</Label>
                    <Select value={newAction.color} onValueChange={(value) => setNewAction({ ...newAction, color: value })}>
                      <SelectTrigger className="text-xs sm:text-sm h-8 sm:h-10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="max-h-48">
                        {colorOptions.map((color) => (
                          <SelectItem key={color.value} value={color.value}>
                            <div className="flex items-center gap-2">
                              <div className={`w-3 h-3 sm:w-4 sm:h-4 rounded ${color.value} flex-shrink-0`} />
                              <span className="text-xs sm:text-sm">{color.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row justify-end gap-2 pt-2">
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} className="text-xs sm:text-sm h-8 sm:h-10">
                    {getLocalizedText('cancel')}
                  </Button>
                  <Button onClick={handleAddAction} disabled={saving} className="text-xs sm:text-sm h-8 sm:h-10">
                    {saving && <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 mr-2 animate-spin" />}
                    {getLocalizedText('save')}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardTitle>
        
        {/* Affichage des permissions utilisateur */}
        <div className="bg-green-50 p-3 rounded-lg border border-green-200">
          <div className="flex items-center gap-2 mb-2">
            <User className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium text-green-800">Connecté en tant qu'administrateur</span>
          </div>
          <div className="text-xs text-green-700">
            <p><strong>Utilisateur :</strong> {userProfile?.name || userProfile?.email}</p>
            <p><strong>Type :</strong> {userType}</p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-3 sm:p-6">
        <div className="space-y-2 sm:space-y-3">
          {quickActions.map((action) => (
            <div key={action.id} className="flex items-center justify-between p-2 sm:p-3 border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                <GripVertical className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400 flex-shrink-0" />
                <div className={`p-1.5 sm:p-2 rounded ${action.color} flex-shrink-0`}>
                  <div className="w-3 h-3 sm:w-4 sm:h-4 bg-white rounded-sm" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-xs sm:text-sm truncate">
                    {action.title[i18n.language as 'fr' | 'en'] || action.title.fr}
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    {action.description[i18n.language as 'fr' | 'en'] || action.description.fr}
                  </div>
                  <div className="text-xs text-gray-400 truncate mt-1">
                    {action.action === 'navigate' ? `→ ${action.actionValue}` : `Dialog: ${action.actionValue}`}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0 ml-2">
                <div className="flex items-center">
                  {toggleStates[action.id] && <Loader2 className="h-3 w-3 mr-1 animate-spin" />}
                  <Switch
                    checked={action.enabled}
                    onCheckedChange={() => handleToggleAction(action.id)}
                    disabled={toggleStates[action.id] || saving}
                    className="scale-75 sm:scale-100"
                  />
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeAction(action.id)}
                  disabled={saving}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 p-1 sm:p-2 h-auto"
                  title={getLocalizedText('delete')}
                >
                  <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </div>
            </div>
          ))}
          {quickActions.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p className="text-sm">Aucune action rapide configurée</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActionsManager;
