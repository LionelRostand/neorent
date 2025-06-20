
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/card';
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
  Receipt
} from 'lucide-react';

const NavigationGrid = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const navigationItems = [
    {
      title: t('navigation.dashboard'),
      icon: LayoutDashboard,
      href: '/admin',
      color: 'text-blue-600'
    },
    {
      title: t('navigation.properties'),
      icon: Building,
      href: '/admin/properties',
      color: 'text-green-600'
    },
    {
      title: t('navigation.tenants'),
      icon: UserCheck,
      href: '/admin/tenants',
      color: 'text-purple-600'
    },
    {
      title: t('navigation.roommates'),
      icon: Users,
      href: '/admin/roommates',
      color: 'text-orange-600'
    },
    {
      title: t('navigation.contracts'),
      icon: FileText,
      href: '/admin/contracts',
      color: 'text-red-600'
    },
    {
      title: t('navigation.inspections'),
      icon: ClipboardList,
      href: '/admin/inspections',
      color: 'text-indigo-600'
    },
    {
      title: t('navigation.rentManagement'),
      icon: Euro,
      href: '/admin/rent-management',
      color: 'text-green-700'
    },
    {
      title: t('navigation.rentalCharges'),
      icon: Calculator,
      href: '/admin/rental-charges',
      color: 'text-blue-700'
    },
    {
      title: t('navigation.forecasting'),
      icon: TrendingUp,
      href: '/admin/forecasting',
      color: 'text-yellow-600'
    },
    {
      title: t('navigation.maintenance'),
      icon: Wrench,
      href: '/admin/maintenance',
      color: 'text-gray-600'
    },
    {
      title: t('navigation.messages'),
      icon: MessageSquare,
      href: '/admin/messages',
      color: 'text-pink-600'
    },
    {
      title: t('navigation.taxes'),
      icon: Receipt,
      href: '/admin/taxes',
      color: 'text-teal-600'
    }
  ];

  const handleNavigation = (href: string) => {
    navigate(href);
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
      {navigationItems.map((item) => {
        const Icon = item.icon;
        return (
          <Card 
            key={item.href}
            className="p-4 md:p-6 cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
            onClick={() => handleNavigation(item.href)}
          >
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="p-3 rounded-full bg-gray-50">
                <Icon className={`h-6 w-6 md:h-8 md:w-8 ${item.color}`} />
              </div>
              <h3 className="font-medium text-sm md:text-base text-gray-900">
                {item.title}
              </h3>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default NavigationGrid;
