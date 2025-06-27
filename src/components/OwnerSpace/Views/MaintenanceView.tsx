
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Wrench, Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface MaintenanceViewProps {
  currentProfile: any;
}

const MaintenanceView: React.FC<MaintenanceViewProps> = ({ currentProfile }) => {
  const { i18n } = useTranslation();

  // Get texts based on current language
  const getLocalizedText = (key: string) => {
    const currentLang = i18n.language;
    
    const texts: Record<string, Record<string, string>> = {
      title: {
        fr: 'Maintenance',
        en: 'Maintenance'
      },
      subtitle: {
        fr: 'Gérez vos demandes de maintenance et de réparation',
        en: 'Manage your maintenance and repair requests'
      },
      newRequest: {
        fr: 'Nouvelle demande',
        en: 'New Request'
      },
      totalRequests: {
        fr: 'Total Demandes',
        en: 'Total Requests'
      },
      totalRequestsDesc: {
        fr: 'demandes enregistrées',
        en: 'registered requests'
      },
      pending: {
        fr: 'En Attente',
        en: 'Pending'
      },
      pendingDesc: {
        fr: 'à traiter',
        en: 'to process'
      },
      urgent: {
        fr: 'Urgentes',
        en: 'Urgent'
      },
      urgentDesc: {
        fr: 'prioritaires',
        en: 'priority requests'
      },
      completed: {
        fr: 'Terminées',
        en: 'Completed'
      },
      completedDesc: {
        fr: 'complétées',
        en: 'completed'
      },
      requestsList: {
        fr: 'Demandes de Maintenance',
        en: 'Maintenance Requests'
      },
      noRequests: {
        fr: 'Aucune demande de maintenance',
        en: 'No maintenance requests'
      },
      noRequestsDesc: {
        fr: 'Toutes vos propriétés sont en bon état',
        en: 'All your properties are in good condition'
      },
      createRequest: {
        fr: 'Créer une demande',
        en: 'Create a request'
      }
    };

    return texts[key]?.[currentLang] || texts[key]?.['fr'] || key;
  };

  // Mock data for demonstration
  const totalRequests = 0;
  const pendingRequests = 0;
  const urgentRequests = 0;
  const completedRequests = 0;

  return (
    <div className="p-6 space-y-6">
      {/* Header harmonisé */}
      <div className="bg-gradient-to-r from-orange-600 to-orange-700 rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{getLocalizedText('title')}</h1>
            <p className="text-orange-100 mt-2">{getLocalizedText('subtitle')}</p>
          </div>
          <Button className="bg-white text-orange-600 hover:bg-orange-50 border-0 shadow-md">
            <Plus className="h-4 w-4 mr-2" />
            {getLocalizedText('newRequest')}
          </Button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-orange-500 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">{getLocalizedText('totalRequests')}</CardTitle>
            <div className="p-2 bg-orange-100 rounded-lg">
              <Wrench className="h-4 w-4 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{totalRequests}</div>
            <p className="text-xs text-gray-500 mt-1">{totalRequests} {getLocalizedText('totalRequestsDesc')}</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">{getLocalizedText('pending')}</CardTitle>
            <div className="p-2 bg-blue-100 rounded-lg">
              <Clock className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{pendingRequests}</div>
            <p className="text-xs text-gray-500 mt-1">{pendingRequests} {getLocalizedText('pendingDesc')}</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">{getLocalizedText('urgent')}</CardTitle>
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{urgentRequests}</div>
            <p className="text-xs text-gray-500 mt-1">{urgentRequests} {getLocalizedText('urgentDesc')}</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">{getLocalizedText('completed')}</CardTitle>
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{completedRequests}</div>
            <p className="text-xs text-gray-500 mt-1">{completedRequests} {getLocalizedText('completedDesc')}</p>
          </CardContent>
        </Card>
      </div>

      {/* Requests List */}
      <Card className="shadow-lg border-0">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b">
          <CardTitle className="text-xl text-gray-800">{getLocalizedText('requestsList')}</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-white rounded-lg border-2 border-dashed border-gray-200">
            <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Wrench className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">{getLocalizedText('noRequests')}</h3>
            <p className="text-gray-500 mb-4">{getLocalizedText('noRequestsDesc')}</p>
            <Button className="bg-orange-600 hover:bg-orange-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              {getLocalizedText('createRequest')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MaintenanceView;
