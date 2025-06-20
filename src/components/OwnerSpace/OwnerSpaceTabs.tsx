
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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

interface OwnerSpaceTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  properties: any[];
  tenants: any[];
  roommates: any[];
  contracts: any[];
}

const OwnerSpaceTabs: React.FC<OwnerSpaceTabsProps> = ({
  activeTab,
  onTabChange,
  properties,
  tenants,
  roommates,
  contracts
}) => {
  const { t } = useTranslation();

  const menuItems = [
    { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
    { id: 'properties', label: 'Propriétés', icon: Building },
    { id: 'tenants', label: 'Locataires', icon: UserCheck },
    { id: 'roommates', label: 'Colocataires', icon: Users },
    { id: 'contracts', label: 'Contrats de bail', icon: FileText },
    { id: 'inspections', label: 'États des lieux', icon: ClipboardList },
    { id: 'rent', label: 'Gestion des loyers', icon: Euro },
    { id: 'charges', label: 'Charges locatives', icon: Calculator },
    { id: 'forecasting', label: 'Prévisions financières', icon: TrendingUp },
    { id: 'maintenance', label: 'Maintenance', icon: Wrench },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'taxes', label: 'Gestion fiscale', icon: Receipt }
  ];

  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="grid grid-cols-3 lg:grid-cols-6 xl:grid-cols-12 h-auto p-1 bg-gray-100">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <TabsTrigger
              key={item.id}
              value={item.id}
              className="flex flex-col items-center gap-1 p-2 text-xs data-[state=active]:bg-white"
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:block">{item.label}</span>
            </TabsTrigger>
          );
        })}
      </TabsList>

      <div className="mt-6">
        <TabsContent value="dashboard">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5 text-blue-600" />
                  Mes Propriétés
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {properties.slice(0, 3).map((property) => (
                    <div key={property.id} className="flex justify-between items-center p-2 border rounded">
                      <div>
                        <p className="font-medium">{property.title}</p>
                        <p className="text-sm text-gray-500">{property.address}</p>
                      </div>
                      <Badge variant={property.status === 'Occupé' ? 'default' : 'secondary'}>
                        {property.status}
                      </Badge>
                    </div>
                  ))}
                  {properties.length > 3 && (
                    <p className="text-sm text-blue-600 cursor-pointer">
                      Voir toutes ({properties.length})
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserCheck className="h-5 w-5 text-green-600" />
                  Locataires Récents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {tenants.slice(0, 3).map((tenant) => (
                    <div key={tenant.id} className="flex justify-between items-center p-2 border rounded">
                      <div>
                        <p className="font-medium">{tenant.name}</p>
                        <p className="text-sm text-gray-500">{tenant.property}</p>
                      </div>
                      <Badge variant="outline">
                        {tenant.rentAmount}€
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Euro className="h-5 w-5 text-green-600" />
                  Revenus Mensuels
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <p className="text-3xl font-bold text-green-600">
                    {(tenants.reduce((sum, t) => sum + parseFloat(t.rentAmount || '0'), 0) + 
                      roommates.reduce((sum, r) => sum + parseFloat(r.rentAmount || '0'), 0)).toFixed(0)}€
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Ce mois-ci</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="properties">
          <Card>
            <CardHeader>
              <CardTitle>Mes Propriétés ({properties.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {properties.map((property) => (
                  <div key={property.id} className="border rounded-lg p-4 space-y-2">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold">{property.title}</h3>
                      <Badge variant={property.status === 'Occupé' ? 'default' : 'secondary'}>
                        {property.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{property.address}</p>
                    <div className="flex justify-between text-sm">
                      <span>Type: {property.type}</span>
                      <span>Surface: {property.surface}</span>
                    </div>
                    <div className="text-lg font-semibold text-green-600">
                      {property.rent}€/mois
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tenants">
          <Card>
            <CardHeader>
              <CardTitle>Mes Locataires ({tenants.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tenants.map((tenant) => (
                  <div key={tenant.id} className="border rounded-lg p-4 flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold">{tenant.name}</h3>
                      <p className="text-sm text-gray-600">{tenant.email}</p>
                      <p className="text-sm text-gray-500">Propriété: {tenant.property}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600">{tenant.rentAmount}€/mois</p>
                      <Badge variant="outline">{tenant.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roommates">
          <Card>
            <CardHeader>
              <CardTitle>Mes Colocataires ({roommates.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {roommates.map((roommate) => (
                  <div key={roommate.id} className="border rounded-lg p-4 flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold">{roommate.name}</h3>
                      <p className="text-sm text-gray-600">{roommate.email}</p>
                      <p className="text-sm text-gray-500">
                        {roommate.property} - Chambre {roommate.roomNumber}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-purple-600">{roommate.rentAmount}€/mois</p>
                      <Badge variant="outline">{roommate.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Placeholder pour les autres onglets */}
        {['contracts', 'inspections', 'rent', 'charges', 'forecasting', 'maintenance', 'messages', 'taxes'].map((tabId) => (
          <TabsContent key={tabId} value={tabId}>
            <Card>
              <CardHeader>
                <CardTitle>
                  {menuItems.find(item => item.id === tabId)?.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-gray-500">Cette section sera développée prochainement.</p>
                  <p className="text-sm text-gray-400 mt-2">
                    Ici vous pourrez gérer {menuItems.find(item => item.id === tabId)?.label.toLowerCase()}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </div>
    </Tabs>
  );
};

export default OwnerSpaceTabs;
