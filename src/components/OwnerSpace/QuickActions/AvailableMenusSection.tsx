
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Plus, Loader2 } from 'lucide-react';
import { QuickActionConfig } from '@/hooks/useQuickActionsManager';
import * as Icons from 'lucide-react';

interface AvailableMenusSectionProps {
  quickActions: QuickActionConfig[];
  onAddMenuToQuickActions: (menuItem: any) => void;
  addingMenus: Record<string, boolean>;
  saving: boolean;
}

const AvailableMenusSection: React.FC<AvailableMenusSectionProps> = ({
  quickActions,
  onAddMenuToQuickActions,
  addingMenus,
  saving
}) => {
  const { t } = useTranslation();

  const availableMenus = [
    { path: '/admin/dashboard', icon: 'LayoutDashboard', color: 'bg-slate-500' },
    { path: '/admin/properties', icon: 'Building', color: 'bg-blue-500' },
    { path: '/admin/tenants', icon: 'Users', color: 'bg-purple-500' },
    { path: '/admin/roommates', icon: 'UserPlus', color: 'bg-pink-500' },
    { path: '/admin/contracts', icon: 'FileCheck', color: 'bg-yellow-500' },
    { path: '/admin/inspections', icon: 'ClipboardCheck', color: 'bg-orange-500' },
    { path: '/admin/rent-management', icon: 'DollarSign', color: 'bg-green-500' },
    { path: '/admin/rental-charges', icon: 'Receipt', color: 'bg-teal-500' },
    { path: '/admin/forecasting', icon: 'TrendingUp', color: 'bg-emerald-500' },
    { path: '/admin/maintenance', icon: 'Wrench', color: 'bg-red-500' },
    { path: '/admin/messages', icon: 'MessageSquare', color: 'bg-indigo-500' },
    { path: '/admin/taxes', icon: 'Calculator', color: 'bg-cyan-500' },
    { path: '/admin/website', icon: 'Globe', color: 'bg-violet-500' },
    { path: '/admin/settings', icon: 'Settings', color: 'bg-gray-500' },
    { path: '/admin/help', icon: 'HelpCircle', color: 'bg-amber-500' }
  ];

  const getIconComponent = (iconName: string) => {
    const IconComponent = (Icons as any)[iconName];
    return IconComponent || Icons.Settings;
  };

  const isMenuAlreadyAdded = (menuPath: string) => {
    return quickActions.some(action => action.actionValue === menuPath);
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      <h3 className="text-base sm:text-lg font-semibold text-gray-900">
        {t('quickActions.manager.availableMenus')}
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
        {availableMenus.map((menu) => {
          const IconComponent = getIconComponent(menu.icon);
          const isAdded = isMenuAlreadyAdded(menu.path);
          const isAdding = addingMenus[menu.path];
          const menuName = menu.path.replace('/admin/', '').replace('-', '');
          
          return (
            <div
              key={menu.path}
              className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-2 sm:mb-3">
                <div className={`p-2 rounded-lg ${menu.color} flex-shrink-0`}>
                  <IconComponent className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                </div>
              </div>
              
              <div className="mb-2 sm:mb-3">
                <h4 className="font-medium text-gray-900 text-sm sm:text-base truncate">
                  {t(`quickActions.${menuName}.title`)}
                </h4>
                <p className="text-xs sm:text-sm text-gray-500 line-clamp-2">
                  {t(`quickActions.${menuName}.description`)}
                </p>
              </div>
              
              <Button
                variant={isAdded ? "secondary" : "default"}
                size="sm"
                onClick={() => !isAdded && onAddMenuToQuickActions(menu)}
                disabled={isAdded || isAdding || saving}
                className="w-full text-xs sm:text-sm"
              >
                {isAdding ? (
                  <>
                    <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 animate-spin" />
                    <span className="truncate">Ajout...</span>
                  </>
                ) : isAdded ? (
                  <span className="truncate">{t('quickActions.manager.alreadyAdded')}</span>
                ) : (
                  <>
                    <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 flex-shrink-0" />
                    <span className="truncate">{t('quickActions.manager.addToQuickActions')}</span>
                  </>
                )}
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AvailableMenusSection;
