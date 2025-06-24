
import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Home, 
  Building, 
  Users, 
  UserCheck,
  FileText, 
  ClipboardList,
  DollarSign, 
  Calculator,
  TrendingUp,
  Wrench,
  MessageSquare,
  Receipt,
  Settings,
  BarChart3,
  CreditCard
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface OwnerQuickActionsProps {
  ownerProfile: any;
  setActiveView: (view: string) => void;
}

const OwnerQuickActions: React.FC<OwnerQuickActionsProps> = ({ 
  ownerProfile, 
  setActiveView 
}) => {
  const { t } = useTranslation();

  const quickActions = [
    {
      id: 'dashboard',
      adminId: 'admin-dashboard',
      label: 'Tableau de bord',
      icon: Home,
      color: 'bg-green-100 text-green-700 hover:bg-green-200',
      description: 'Vue d\'ensemble'
    },
    {
      id: 'property',
      adminId: 'admin-properties',
      label: 'Propriétés',
      icon: Building,
      color: 'bg-blue-100 text-blue-700 hover:bg-blue-200',
      description: 'Gestion immobilière'
    },
    {
      id: 'contract',
      adminId: 'admin-contracts',
      label: 'Contrats',
      icon: FileText,
      color: 'bg-purple-100 text-purple-700 hover:bg-purple-200',
      description: 'Baux et contrats'
    },
    {
      id: 'roommate',
      adminId: 'admin-roommates',
      label: 'Colocataires',
      icon: UserCheck,
      color: 'bg-orange-100 text-orange-700 hover:bg-orange-200',
      description: 'Gestion colocation'
    },
    {
      id: 'inspection',
      adminId: 'admin-inspections',
      label: 'États des lieux',
      icon: ClipboardList,
      color: 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200',
      description: 'Inspections'
    },
    {
      id: 'charges',
      adminId: 'admin-rental-charges',
      label: 'Charges',
      icon: Calculator,
      color: 'bg-teal-100 text-teal-700 hover:bg-teal-200',
      description: 'Charges locatives'
    },
    {
      id: 'maintenance',
      adminId: 'admin-maintenance',
      label: 'Maintenance',
      icon: Wrench,
      color: 'bg-red-100 text-red-700 hover:bg-red-200',
      description: 'Réparations'
    },
    {
      id: 'admin-taxes',
      adminId: 'admin-taxes',
      label: 'Gestion fiscale',
      icon: Receipt,
      color: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200',
      description: 'Déclarations'
    },
    {
      id: 'admin-forecasting',
      adminId: 'admin-forecasting',
      label: 'Prévisions',
      icon: TrendingUp,
      color: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200',
      description: 'Projections revenus'
    },
    {
      id: 'admin-rent-management',
      adminId: 'admin-rent-management',
      label: 'Gestion loyers',
      icon: DollarSign,
      color: 'bg-cyan-100 text-cyan-700 hover:bg-cyan-200',
      description: 'Loyers et paiements'
    },
    {
      id: 'admin-tenants',
      adminId: 'admin-tenants',
      label: 'Locataires',
      icon: Users,
      color: 'bg-pink-100 text-pink-700 hover:bg-pink-200',
      description: 'Gestion locataires'
    },
    {
      id: 'admin-messages',
      adminId: 'admin-messages',
      label: 'Messages',
      icon: MessageSquare,
      color: 'bg-purple-100 text-purple-700 hover:bg-purple-200',
      description: 'Nouveaux messages'
    }
  ];

  const handleActionClick = (actionId: string, adminId: string) => {
    // Use admin version if available, otherwise use the regular version
    setActiveView(adminId || actionId);
  };

  return (
    <div className="space-y-3">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white mb-2">Actions rapides</h3>
        <p className="text-sm text-white/70">Accédez rapidement à vos outils</p>
      </div>

      <div className="space-y-2">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <Button
              key={action.id}
              variant="ghost"
              className="w-full justify-start h-auto p-3 text-left hover:bg-white/10 bg-white/5 border border-white/10"
              onClick={() => handleActionClick(action.id, action.adminId)}
            >
              <div className="flex items-center space-x-3 w-full">
                <div className={`p-2 rounded-lg ${action.color.replace('hover:bg-', 'bg-').replace('text-', 'text-').split(' ')[0]} bg-white/20`}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-white text-sm">{action.label}</div>
                  <div className="text-xs text-white/60 truncate">{action.description}</div>
                </div>
              </div>
            </Button>
          );
        })}
      </div>

      {/* Quick Stats */}
      <div className="mt-6 pt-4 border-t border-white/20">
        <h4 className="text-sm font-medium text-white/90 mb-3">Aperçu rapide</h4>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-white/70">Propriétés</span>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              {ownerProfile?.properties?.length || 0}
            </Badge>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-white/70">Locataires</span>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              {ownerProfile?.tenants?.length || 0}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerQuickActions;
