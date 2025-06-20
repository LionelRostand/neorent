
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useUserPermissions } from '@/hooks/useUserPermissions';
import { 
  LayoutDashboard, 
  Building, 
  UserCheck, 
  Users, 
  FileText, 
  ClipboardList,
  Euro,
  Calculator,
  TrendingUp,
  Wrench,
  MessageSquare,
  Receipt,
  Globe,
  Settings,
  HelpCircle,
  UserCog
} from 'lucide-react';

interface SidebarProps {
  collapsed?: boolean;
  onMobileClose?: () => void;
}

const Sidebar = ({ collapsed = false, onMobileClose }: SidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { canAccessMenu, isAdmin, isEmployee } = useUserPermissions();

  const handleNavigation = (href: string) => {
    navigate(href);
    // Call onMobileClose when navigating on mobile
    if (onMobileClose) {
      onMobileClose();
    }
  };

  const menuItems = [
    {
      title: t('navigation.dashboard'),
      icon: LayoutDashboard,
      href: '/admin',
      permission: 'dashboard' as const
    },
    {
      title: t('navigation.properties'),
      icon: Building,
      href: '/admin/properties',
      permission: 'properties' as const
    },
    {
      title: t('navigation.tenants'),
      icon: UserCheck,
      href: '/admin/tenants',
      permission: 'tenants' as const
    },
    {
      title: t('navigation.roommates'),
      icon: Users,
      href: '/admin/roommates',
      permission: 'roommates' as const
    },
    {
      title: t('navigation.contracts'),
      icon: FileText,
      href: '/admin/contracts',
      permission: 'contracts' as const
    },
    {
      title: t('navigation.inspections'),
      icon: ClipboardList,
      href: '/admin/inspections',
      permission: 'inspections' as const
    },
    {
      title: t('navigation.rentManagement'),
      icon: Euro,
      href: '/admin/rent-management',
      permission: 'rentManagement' as const
    },
    {
      title: t('navigation.rentalCharges'),
      icon: Calculator,
      href: '/admin/rental-charges',
      permission: 'rentalCharges' as const
    },
    {
      title: t('navigation.forecasting'),
      icon: TrendingUp,
      href: '/admin/forecasting',
      permission: null
    },
    {
      title: t('navigation.maintenance'),
      icon: Wrench,
      href: '/admin/maintenance',
      permission: 'maintenance' as const
    },
    {
      title: t('navigation.messages'),
      icon: MessageSquare,
      href: '/admin/messages',
      permission: 'messages' as const
    },
    {
      title: t('navigation.taxes'),
      icon: Receipt,
      href: '/admin/taxes',
      permission: 'taxes' as const
    },
    {
      title: t('navigation.website'),
      icon: Globe,
      href: '/admin/website',
      permission: 'website' as const
    }
  ];

  const bottomMenuItems = [
    {
      title: t('navigation.settings'),
      icon: Settings,
      href: '/admin/settings',
      permission: 'settings' as const
    },
    {
      title: t('navigation.help'),
      icon: HelpCircle,
      href: '/admin/help',
      permission: null
    }
  ];

  // Ajouter l'espace propriétaire pour les employés
  const ownerSpaceItem = isEmployee ? {
    title: 'Mon Espace Propriétaire',
    icon: UserCog,
    href: '/owner-space',
    permission: null
  } : null;

  return (
    <div className={cn(
      "flex flex-col h-full bg-gradient-to-b from-green-700 to-green-800 border-r border-green-600 transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Logo */}
      <div className="flex items-center justify-center h-16 border-b border-green-600">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <span className="text-green-700 font-bold text-sm">N</span>
          </div>
          {!collapsed && (
            <span className="font-bold text-xl text-white">NeoRent</span>
          )}
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 py-4">
        <nav className="space-y-1 px-3">
          {/* Main menu items */}
          {menuItems.map((item) => {
            const hasPermission = !item.permission || canAccessMenu(item.permission);
            if (!hasPermission) return null;

            const isActive = location.pathname === item.href;
            const Icon = item.icon;

            return (
              <Button
                key={item.href}
                variant="ghost"
                className={cn(
                  "w-full justify-start text-left font-normal text-white hover:bg-green-600 hover:text-white",
                  collapsed ? "px-2" : "px-3",
                  isActive && "bg-green-600 text-white border-r-2 border-white"
                )}
                onClick={() => handleNavigation(item.href)}
              >
                <Icon className={cn("h-4 w-4", collapsed ? "mx-auto" : "mr-3")} />
                {!collapsed && <span>{item.title}</span>}
              </Button>
            );
          })}

          {/* Owner space for employees */}
          {ownerSpaceItem && (
            <>
              <div className="my-4 border-t border-green-600" />
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start text-left font-normal text-white hover:bg-green-600 hover:text-white",
                  collapsed ? "px-2" : "px-3",
                  location.pathname === ownerSpaceItem.href && "bg-green-600 text-white border-r-2 border-white"
                )}
                onClick={() => handleNavigation(ownerSpaceItem.href)}
              >
                <ownerSpaceItem.icon className={cn("h-4 w-4", collapsed ? "mx-auto" : "mr-3")} />
                {!collapsed && <span>{ownerSpaceItem.title}</span>}
              </Button>
            </>
          )}

          {/* Bottom menu items */}
          <div className="mt-8 pt-4 border-t border-green-600">
            {bottomMenuItems.map((item) => {
              const hasPermission = !item.permission || canAccessMenu(item.permission);
              if (!hasPermission) return null;

              const isActive = location.pathname === item.href;
              const Icon = item.icon;

              return (
                <Button
                  key={item.href}
                  variant="ghost"
                  className={cn(
                    "w-full justify-start text-left font-normal text-white hover:bg-green-600 hover:text-white",
                    collapsed ? "px-2" : "px-3",
                    isActive && "bg-green-600 text-white border-r-2 border-white"
                  )}
                  onClick={() => handleNavigation(item.href)}
                >
                  <Icon className={cn("h-4 w-4", collapsed ? "mx-auto" : "mr-3")} />
                  {!collapsed && <span>{item.title}</span>}
                </Button>
              );
            })}
          </div>
        </nav>
      </ScrollArea>
    </div>
  );
};

export default Sidebar;
