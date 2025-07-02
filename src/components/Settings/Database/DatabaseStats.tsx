
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Database, FileText, Users, Activity } from 'lucide-react';

export const DatabaseStats: React.FC = () => {
  const { t } = useTranslation();

  const stats = [
    {
      title: t('settings.database.stats.firestoreCollections'),
      value: "12",
      description: t('settings.database.stats.collectionsConfigured'),
      icon: Database,
      color: "text-blue-600"
    },
    {
      title: t('settings.database.stats.userAccounts'),
      value: "248",
      description: t('settings.database.stats.activeUsers'),
      icon: Users,
      color: "text-green-600"
    },
    {
      title: t('settings.database.stats.documentsInCollections'),
      value: "1,847",
      description: t('settings.database.stats.storedDocuments'),
      icon: FileText,
      color: "text-purple-600"
    },
    {
      title: t('settings.database.stats.dailyOperations'),
      value: "12.3k",
      description: t('settings.database.stats.operationsPerDay'),
      icon: Activity,
      color: "text-orange-600"
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('settings.database.stats.title')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <div key={index} className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
                <span className="text-2xl font-bold">{stat.value}</span>
              </div>
              <h4 className="font-medium text-sm">{stat.title}</h4>
              <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium text-blue-800 mb-2">{t('settings.database.importantInfo.title')}</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• {t('settings.database.importantInfo.realTimeStats')}</li>
            <li>• {t('settings.database.importantInfo.monitorQuota')}</li>
            <li>• {t('settings.database.importantInfo.optimizeQueries')}</li>
            <li>• {t('settings.database.importantInfo.configureBilling')}</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
