
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Settings, Trash2, GripVertical, Loader2, Shield, User, Plus } from 'lucide-react';
import { useQuickActionsManager } from '@/hooks/useQuickActionsManager';
import { useAuth } from '@/hooks/useAuth';
import { useSidebarMenuItems } from '@/components/Layout/SidebarComponents/useSidebarMenuItems';
import FirestoreRulesHelper from './FirestoreRulesHelper';

const QuickActionsManager: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { userType, userProfile } = useAuth();
  const { quickActions, isAdmin, toggleAction, removeAction, saving, addCustomAction } = useQuickActionsManager();
  const [toggleStates, setToggleStates] = useState<Record<string, boolean>>({});
  const [showPermissionsError, setShowPermissionsError] = useState(false);
  const [addingMenus, setAddingMenus] = useState<Record<string, boolean>>({});
  const sidebarMenuItems = useSidebarMenuItems();

  const getLocalizedText = (key: string) => {
    const currentLang = i18n.language;
    
    const texts: Record<string, Record<string, string>> = {
      manageActions: {
        fr: 'Gérer les actions rapides',
        en: 'Manage Quick Actions'
      },
      delete: {
        fr: 'Supprimer',
        en: 'Delete'
      },
      adminOnly: {
        fr: 'Seuls les administrateurs peuvent gérer les actions rapides',
        en: 'Only administrators can manage quick actions'
      },
      availableMenus: {
        fr: 'Menus disponibles du sidebar',
        en: 'Available sidebar menus'
      },
      addToQuickActions: {
        fr: 'Ajouter aux actions rapides',
        en: 'Add to quick actions'
      },
      alreadyAdded: {
        fr: 'Déjà ajouté',
        en: 'Already added'
      }
    };

    return texts[key]?.[currentLang] || texts[key]?.['fr'] || key;
  };

  const handleToggleAction = async (actionId: string) => {
    // Set loading state for this specific toggle
    setToggleStates(prev => ({ ...prev, [actionId]: true }));
    
    try {
      const success = await toggleAction(actionId);
      if (!success) {
        setShowPermissionsError(true);
      }
    } finally {
      // Clear loading state
      setToggleStates(prev => ({ ...prev, [actionId]: false }));
    }
  };

  const handleAddMenuToQuickActions = async (menuItem: any) => {
    setAddingMenus(prev => ({ ...prev, [menuItem.path]: true }));
    
    try {
      // Create a quick action from the sidebar menu item
      const newAction = {
        id: menuItem.path.replace('/admin/', ''),
        title: { 
          fr: menuItem.label, 
          en: menuItem.label 
        },
        description: { 
          fr: `Accès rapide à ${menuItem.label}`, 
          en: `Quick access to ${menuItem.label}` 
        },
        icon: menuItem.icon.name || 'Settings',
        color: getColorForMenu(menuItem.path),
        enabled: true,
        action: 'navigate' as const,
        actionValue: menuItem.path
      };

      const success = await addCustomAction(newAction);
      if (!success) {
        setShowPermissionsError(true);
      }
    } finally {
      setAddingMenus(prev => ({ ...prev, [menuItem.path]: false }));
    }
  };

  const getColorForMenu = (path: string): string => {
    const colorMap: Record<string, string> = {
      '/admin/dashboard': 'bg-slate-500',
      '/admin/properties': 'bg-blue-500',
      '/admin/tenants': 'bg-purple-500',
      '/admin/roommates': 'bg-pink-500',
      '/admin/contracts': 'bg-yellow-500',
      '/admin/inspections': 'bg-orange-500',
      '/admin/rent-management': 'bg-green-500',
      '/admin/rental-charges': 'bg-teal-500',
      '/admin/forecasting': 'bg-emerald-500',
      '/admin/maintenance': 'bg-red-500',
      '/admin/messages': 'bg-indigo-500',
      '/admin/taxes': 'bg-cyan-500',
      '/admin/website': 'bg-violet-500',
      '/admin/settings': 'bg-gray-500',
      '/admin/help': 'bg-amber-500'
    };
    return colorMap[path] || 'bg-gray-500';
  };

  const isMenuAlreadyAdded = (menuPath: string): boolean => {
    const menuId = menuPath.replace('/admin/', '');
    return quickActions.some(action => action.id === menuId || action.actionValue === menuPath);
  };

  const getAvailableMenus = () => {
    return sidebarMenuItems.filter(menu => !isMenuAlreadyAdded(menu.path));
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
    <div className="space-y-6">
      {/* Affichage de l'aide en cas d'erreur de permissions */}
      {showPermissionsError && <FirestoreRulesHelper />}

      {/* Section pour ajouter des menus du sidebar */}
      <Card className="w-full max-w-6xl mx-auto">
        <CardHeader className="pb-3 px-3 sm:px-6">
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="text-base sm:text-lg font-semibold">{getLocalizedText('availableMenus')}</span>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-3 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {getAvailableMenus().map((menuItem) => {
              const Icon = menuItem.icon;
              const isAdding = addingMenus[menuItem.path];
              
              return (
                <div key={menuItem.path} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className={`p-2 rounded ${getColorForMenu(menuItem.path)} flex-shrink-0`}>
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{menuItem.label}</div>
                    <div className="text-xs text-gray-500 truncate">{menuItem.path}</div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleAddMenuToQuickActions(menuItem)}
                    disabled={isAdding || saving}
                    className="flex-shrink-0"
                  >
                    {isAdding && <Loader2 className="h-3 w-3 mr-1 animate-spin" />}
                    <Plus className="h-3 w-3 mr-1" />
                    Ajouter
                  </Button>
                </div>
              );
            })}
            {getAvailableMenus().length === 0 && (
              <div className="col-span-full text-center py-8 text-gray-500">
                <p className="text-sm">Tous les menus du sidebar ont déjà été ajoutés aux actions rapides</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Section de gestion des actions rapides existantes */}
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
    </div>
  );
};

export default QuickActionsManager;
