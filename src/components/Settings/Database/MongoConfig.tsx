
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle, XCircle, Database, Info, Shield, Radio } from 'lucide-react';
import { useDatabaseConfig } from '@/hooks/useMongoConfig';
import { useToast } from '@/hooks/use-toast';

const DatabaseConfigComponent: React.FC = () => {
  const { t } = useTranslation();
  const { config, saveConfig, testConnection, isLoading, connectionTest } = useDatabaseConfig();
  const { toast } = useToast();
  
  const [mongoFormData, setMongoFormData] = useState({
    host: config?.mongodb?.host || 'mongodb.neotech-consulting.com',
    port: config?.mongodb?.port || 27017,
    database: config?.mongodb?.database || 'neorent',
    username: config?.mongodb?.username || 'admin',
    password: config?.mongodb?.password || 'admin',
    authSource: config?.mongodb?.authSource || 'admin',
    ssl: config?.mongodb?.ssl || true,
    allowInvalidCertificates: config?.mongodb?.allowInvalidCertificates || true,
    connectionString: config?.mongodb?.connectionString || '',
  });

  const [useConnectionString, setUseConnectionString] = useState(false);

  const handleDatabaseTypeChange = (type: 'mongodb' | 'firebase') => {
    if (!config) return;
    
    const newConfig = {
      ...config,
      type
    };
    saveConfig(newConfig);
    
    toast({
      title: "Type de base de données changé",
      description: `Basculement vers ${type === 'mongodb' ? 'MongoDB' : 'Firebase/Firestore'}`,
      variant: "default",
    });
  };

  const handleMongoInputChange = (field: string, value: string | number | boolean) => {
    setMongoFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveMongo = () => {
    if (!config) return;
    
    try {
      const newConfig = {
        ...config,
        mongodb: mongoFormData
      };
      saveConfig(newConfig);
      toast({
        title: "Configuration MongoDB sauvegardée",
        description: "Les paramètres de connexion MongoDB ont été sauvegardés avec succès.",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Erreur de sauvegarde",
        description: "Impossible de sauvegarder la configuration MongoDB.",
        variant: "destructive",
      });
    }
  };

  const handleTest = () => {
    if (config?.type === 'mongodb') {
      testConnection(mongoFormData);
    } else {
      testConnection();
    }
  };

  const generatePreviewUrl = () => {
    if (config?.type === 'firebase') {
      return `Firebase Project: ${config?.firebase?.projectId || 'neorent-23d85'}`;
    }
    
    if (useConnectionString && mongoFormData.connectionString) {
      return mongoFormData.connectionString;
    }
    
    let url = `mongodb://`;
    if (mongoFormData.username && mongoFormData.password) {
      url += `${mongoFormData.username}:***@`;
    }
    url += `${mongoFormData.host}:${mongoFormData.port}`;
    if (mongoFormData.database) {
      url += `/${mongoFormData.database}`;
    }
    const params = [];
    if (mongoFormData.authSource) params.push(`authSource=${mongoFormData.authSource}`);
    if (mongoFormData.ssl) params.push('ssl=true');
    if (mongoFormData.allowInvalidCertificates) params.push('tlsAllowInvalidCertificates=true');
    if (params.length > 0) {
      url += `?${params.join('&')}`;
    }
    return url;
  };


  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Configuration Base de Données
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Sélecteur de type de base de données */}
        <div className="space-y-4">
          <Label className="text-base font-medium">Type de base de données</Label>
          <div className="flex flex-col sm:flex-row gap-3">
            <div 
              className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                config?.type === 'firebase' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleDatabaseTypeChange('firebase')}
            >
              <Radio className={`h-4 w-4 ${config?.type === 'firebase' ? 'text-blue-500' : 'text-gray-400'}`} />
              <div>
                <div className="font-medium">Firebase/Firestore</div>
                <div className="text-sm text-gray-500">Base de données cloud Google</div>
              </div>
            </div>
            <div 
              className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                config?.type === 'mongodb' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleDatabaseTypeChange('mongodb')}
            >
              <Radio className={`h-4 w-4 ${config?.type === 'mongodb' ? 'text-blue-500' : 'text-gray-400'}`} />
              <div>
                <div className="font-medium">MongoDB</div>
                <div className="text-sm text-gray-500">Base de données NoSQL</div>
              </div>
            </div>
          </div>
        </div>

        {/* Configuration Firebase */}
        {config?.type === 'firebase' && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Configuration Firebase</h3>
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label>Project ID</Label>
                <Input
                  type="text"
                  value={config?.firebase?.projectId || 'neorent-23d85'}
                  disabled
                  className="bg-gray-50"
                />
              </div>
              <div className="space-y-2">
                <Label>Auth Domain</Label>
                <Input
                  type="text"
                  value={config?.firebase?.authDomain || 'neorent-23d85.firebaseapp.com'}
                  disabled
                  className="bg-gray-50"
                />
              </div>
              <div className="space-y-2">
                <Label>Storage Bucket</Label>
                <Input
                  type="text"
                  value={config?.firebase?.storageBucket || 'neorent-23d85.firebasestorage.app'}
                  disabled
                  className="bg-gray-50"
                />
              </div>
              <div className="space-y-2">
                <Label>Statut</Label>
                <Input
                  type="text"
                  value={config?.firebase?.status || 'Connecté'}
                  disabled
                  className="bg-green-50 text-green-700"
                />
              </div>
            </div>
          </div>
        )}

        {/* Configuration MongoDB */}
        {config?.type === 'mongodb' && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Configuration MongoDB</h3>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="use-connection-string"
                checked={useConnectionString}
                onCheckedChange={setUseConnectionString}
              />
              <Label htmlFor="use-connection-string" className="text-sm sm:text-base">
                Utiliser une chaîne de connexion complète
              </Label>
            </div>

            {useConnectionString ? (
              <div className="space-y-2">
                <Label htmlFor="connectionString">Chaîne de connexion MongoDB</Label>
                <Input
                  id="connectionString"
                  type="text"
                  value={mongoFormData.connectionString}
                  onChange={(e) => handleMongoInputChange('connectionString', e.target.value)}
                  placeholder="mongodb://username:password@host:port/database"
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-2">
                  <Label htmlFor="host">Host</Label>
                  <Input
                    id="host"
                    type="text"
                    value={mongoFormData.host}
                    onChange={(e) => handleMongoInputChange('host', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="port">Port</Label>
                  <Input
                    id="port"
                    type="number"
                    value={mongoFormData.port}
                    onChange={(e) => handleMongoInputChange('port', parseInt(e.target.value) || 27017)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="database">Base de données</Label>
                  <Input
                    id="database"
                    type="text"
                    value={mongoFormData.database}
                    onChange={(e) => handleMongoInputChange('database', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username">Nom d'utilisateur</Label>
                  <Input
                    id="username"
                    type="text"
                    value={mongoFormData.username}
                    onChange={(e) => handleMongoInputChange('username', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Mot de passe</Label>
                  <Input
                    id="password"
                    type="password"
                    value={mongoFormData.password}
                    onChange={(e) => handleMongoInputChange('password', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="authSource">Source d'authentification</Label>
                  <Input
                    id="authSource"
                    type="text"
                    value={mongoFormData.authSource}
                    onChange={(e) => handleMongoInputChange('authSource', e.target.value)}
                  />
                </div>
              </div>
            )}

            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="ssl"
                  checked={mongoFormData.ssl}
                  onCheckedChange={(checked) => handleMongoInputChange('ssl', checked)}
                />
                <Label htmlFor="ssl" className="text-sm sm:text-base">Activer SSL</Label>
              </div>

              <div className="flex items-start space-x-2">
                <Switch
                  id="allowInvalidCertificates"
                  checked={mongoFormData.allowInvalidCertificates}
                  onCheckedChange={(checked) => handleMongoInputChange('allowInvalidCertificates', checked)}
                  className="mt-1"
                />
                <Label htmlFor="allowInvalidCertificates" className="flex items-start gap-2 text-sm sm:text-base leading-tight">
                  <Shield className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                  <span>Autoriser les certificats invalides (certificats auto-signés)</span>
                </Label>
              </div>
            </div>
          </div>
        )}

        <Alert>
          <Info className="h-4 w-4 flex-shrink-0" />
          <AlertDescription className="space-y-2">
            <div className="font-medium text-sm sm:text-base">
              {config?.type === 'firebase' ? 'Configuration Firebase:' : 'URL de connexion MongoDB:'}
            </div>
            <code className="text-xs sm:text-sm bg-gray-100 p-2 rounded block break-all whitespace-pre-wrap">
              {generatePreviewUrl()}
            </code>
          </AlertDescription>
        </Alert>

        <div className="flex flex-col sm:flex-row gap-2">
          {config?.type === 'mongodb' && (
            <Button onClick={handleSaveMongo} variant="outline" className="w-full sm:w-auto">
              Sauvegarder MongoDB
            </Button>
          )}
          <Button onClick={handleTest} disabled={isLoading} className="w-full sm:w-auto">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                <span className="hidden sm:inline">Test en cours...</span>
                <span className="sm:hidden">Test...</span>
              </>
            ) : (
              <>
                <span className="hidden sm:inline">
                  Tester la connexion {config?.type === 'firebase' ? 'Firebase' : 'MongoDB'}
                </span>
                <span className="sm:hidden">Tester</span>
              </>
            )}
          </Button>
        </div>

        {connectionTest && (
          <Alert className={connectionTest.success ? 'border-green-500' : 'border-red-500'}>
            <div className="flex items-start gap-2">
              {connectionTest.success ? (
                <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
              )}
              <AlertDescription className="flex-1 text-sm sm:text-base">
                {connectionTest.message}
              </AlertDescription>
            </div>
            {connectionTest.details && (
              <div className="mt-3 text-xs sm:text-sm text-gray-600 space-y-1">
                {config?.type === 'firebase' ? (
                  <>
                    <p><span className="font-medium">Project ID:</span> {connectionTest.details.projectId}</p>
                    <p><span className="font-medium">Documents totaux:</span> {connectionTest.details.documentsCount}</p>
                  </>
                ) : (
                  <>
                    <p><span className="font-medium">Host:</span> {connectionTest.details.host}</p>
                    <p><span className="font-medium">Base de données:</span> {connectionTest.details.database}</p>
                    {connectionTest.details.latency && (
                      <p><span className="font-medium">Latence:</span> {connectionTest.details.latency}ms</p>
                    )}
                  </>
                )}
                {connectionTest.details.collections && (
                  <p><span className="font-medium">Collections:</span> {connectionTest.details.collections.join(', ')}</p>
                )}
              </div>
            )}
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default DatabaseConfigComponent;
