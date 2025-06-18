
import React from 'react';
import { FirestoreRulesSection } from './Firebase/FirestoreRulesSection';
import { StorageRulesSection } from './Firebase/StorageRulesSection';
import FirebaseCollectionsList from './Firebase/FirebaseCollectionsList';
import { UserRolesList } from './Firebase/UserRolesList';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Database, Shield, Copy, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const FirebaseTab: React.FC = () => {
  const { t } = useTranslation();
  
  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    console.log(`${type} ${t('settings.firebase.config.copy')}`);
  };

  const openFirebaseConsole = () => {
    window.open('https://console.firebase.google.com/', '_blank');
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-xl md:text-2xl font-semibold text-gray-900">
            <div className="flex items-center gap-3">
              <Database className="h-6 w-6 text-orange-600" />
              <span>🔥 {t('settings.firebase.title')}</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                {t('settings.firebase.config.connectionStatus.connected')}
              </Badge>
              <Button 
                variant="outline" 
                size="sm"
                onClick={openFirebaseConsole}
                className="flex items-center gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                {t('settings.firebase.config.console')}
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            {t('settings.firebase.subtitle')}
          </p>
          
          {/* Connection Status */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium">{t('settings.firebase.config.connectionStatus.firestore')}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium">{t('settings.firebase.config.connectionStatus.authentication')}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium">{t('settings.firebase.config.connectionStatus.storage')}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm font-medium">{t('settings.firebase.config.connectionStatus.region')}: {t('settings.firebase.config.connectionStatus.europe')}</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Security Rules Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <FirestoreRulesSection onCopy={copyToClipboard} />
        <StorageRulesSection onCopy={copyToClipboard} />
      </div>
      
      {/* Collections and Users Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <FirebaseCollectionsList />
        <UserRolesList />
      </div>

      {/* Security Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
            <Shield className="h-5 w-5 text-blue-600" />
            {t('settings.firebase.config.security.title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
              <span className="text-blue-600 text-sm">ℹ️</span>
              <div className="text-sm">
                <p className="font-medium text-blue-800 mb-1">{t('settings.firebase.config.security.apiKeyPublic')}</p>
                <p className="text-blue-700">{t('settings.firebase.config.security.rulesProtection')}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
              <span className="text-yellow-600 text-sm">⚠️</span>
              <div className="text-sm">
                <p className="font-medium text-yellow-800 mb-1">{t('settings.firebase.config.security.checkRules')}</p>
                <p className="text-yellow-700">{t('settings.firebase.config.security.monitorUsage')}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FirebaseTab;
