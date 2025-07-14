
import React from 'react';
import { useTranslation } from 'react-i18next';
import { LayoutDashboard, Building, Users, FileText, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useOwnerData } from '@/hooks/useOwnerData';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface AdminDashboardViewProps {
  currentProfile: any;
}

const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({ currentProfile }) => {
  const { i18n } = useTranslation();
  const { properties, tenants, roommates, contracts } = useOwnerData(currentProfile);

  // Get texts based on current language
  const getLocalizedText = (key: string) => {
    const currentLang = i18n.language;
    
    const texts: Record<string, Record<string, string>> = {
      title: {
        fr: 'Tableau de Bord',
        en: 'Dashboard'
      },
      subtitle: {
        fr: 'Vue d\'ensemble de votre portefeuille immobilier',
        en: 'Overview of your real estate portfolio'
      },
      properties: {
        fr: 'Propriétés',
        en: 'Properties'
      },
      tenants: {
        fr: 'Locataires',
        en: 'Tenants'
      },
      contracts: {
        fr: 'Contrats',
        en: 'Contracts'
      },
      monthlyRevenue: {
        fr: 'Revenus Mensuels',
        en: 'Monthly Revenue'
      },
      thisMonth: {
        fr: 'ce mois',
        en: 'this month'
      },
      chartTitle: {
        fr: 'Revenus Mensuels - Locataires vs Colocataires',
        en: 'Monthly Revenue - Tenants vs Roommates'
      }
    };

    return texts[key]?.[currentLang] || texts[key]?.['fr'] || key;
  };

  const totalProperties = properties.length;
  const totalTenants = tenants.length + roommates.length;
  const totalContracts = contracts.length;
  const monthlyRevenue = [...tenants, ...roommates].reduce((sum, item) => sum + (parseFloat(item.rentAmount?.toString() || '0') || 0), 0);

  // Mock data for the chart to match your screenshot
  const chartData = [
    { month: 'Jan', tenants: 0, roommates: 0 },
    { month: 'Feb', tenants: 0, roommates: 0 },
    { month: 'Mar', tenants: 0, roommates: 0 },
    { month: 'Apr', tenants: 0, roommates: 0 },
    { month: 'May', tenants: 0, roommates: 0 },
    { month: 'Jun', tenants: 0, roommates: 0 },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header harmonisé */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{getLocalizedText('title')}</h1>
            <p className="text-blue-100 mt-2">{getLocalizedText('subtitle')}</p>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">{getLocalizedText('properties')}</p>
                <p className="text-2xl font-bold text-gray-900 mb-1">{totalProperties}</p>
                <p className="text-xs text-green-600 font-medium">
                  +2 {getLocalizedText('thisMonth')}
                </p>
              </div>
              <div className="p-2 rounded-lg bg-blue-50">
                <Building className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">{getLocalizedText('tenants')}</p>
                <p className="text-2xl font-bold text-gray-900 mb-1">{totalTenants}</p>
                <p className="text-xs text-green-600 font-medium">
                  +3 {getLocalizedText('thisMonth')}
                </p>
              </div>
              <div className="p-2 rounded-lg bg-green-50">
                <Users className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">{getLocalizedText('contracts')}</p>
                <p className="text-2xl font-bold text-gray-900 mb-1">{totalContracts}</p>
                <p className="text-xs text-green-600 font-medium">
                  +1 {getLocalizedText('thisMonth')}
                </p>
              </div>
              <div className="p-2 rounded-lg bg-orange-50">
                <FileText className="h-5 w-5 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">{getLocalizedText('monthlyRevenue')}</p>
                <p className="text-2xl font-bold text-gray-900 mb-1">{monthlyRevenue}€</p>
                <p className="text-xs text-green-600 font-medium">
                  +8.2% {getLocalizedText('thisMonth')}
                </p>
              </div>
              <div className="p-2 rounded-lg bg-purple-50">
                <TrendingUp className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card className="shadow-lg border-0">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b">
          <CardTitle className="text-xl text-gray-800 flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            {getLocalizedText('chartTitle')}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#666', fontSize: 12 }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#666', fontSize: 12 }}
                  domain={[0, 4]}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="tenants" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                  name="Locataires"
                />
                <Line 
                  type="monotone" 
                  dataKey="roommates" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                  name="Colocataires"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboardView;
