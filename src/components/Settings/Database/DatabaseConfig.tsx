import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle, XCircle, Database, Info, Shield } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDatabaseConfig, DatabaseType, FirebaseConfig } from '@/hooks/useMongoConfig';
import { MongoConfig } from '@/services/mongoConfig';
import { useToast } from '@/hooks/use-toast';
import CertificateHelper from './CertificateHelper';

const DatabaseConfigComponent: React.FC = () => {
  const { t } = useTranslation();
  const { config, saveConfig, testConnection, isLoading, connectionTest } = useDatabaseConfig();
  const { toast } = useToast();
  
  const [databaseType, setDatabaseType] = useState<DatabaseType>('mongodb');
  const [mongoData, setMongoData] = useState<MongoConfig>({
    host: '161.97.108.157',
    port: 27017,
    database: 'immobilier',
    username: '',
    password: '',
    authSource: 'admin',
    ssl: false,
    allowInvalidCertificates: false,
    connectionString: '',
  });
  
  const [firebaseData, setFirebaseData] = useState<FirebaseConfig>({
    projectId: 'neorent-23d85',
    apiKey: 'AIzaSyDInXgSvKg0hvD8b57ts400lah99XjZx34',
    authDomain: 'neorent-23d85.firebaseapp.com',
    storageBucket: 'neorent-23d85.firebasestorage.app',
    messagingSenderId: '312457908893',
    appId: '1:312457908893:web:f625fd27aacf3798e77a74'
  });

  const [useConnectionString, setUseConnectionString] = useState(false);
  const [showCertificateHelper, setShowCertificateHelper] = useState(false);

  useEffect(() => {
    if (config) {
      setDatabaseType(config.type);
      if (config.mongodb) {
        setMongoData(config.mongodb);
      }
      if (config.firebase) {
        setFirebaseData(config.firebase);
      }
    }
  }, [config]);

  const handleMongoInputChange = (field: keyof MongoConfig, value: string | number | boolean) => {
    setMongoData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFirebaseInputChange = (field: keyof FirebaseConfig, value: string) => {
    setFirebaseData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    try {
      const newConfig = {
        type: databaseType,
        mongodb: mongoData,
        firebase: firebaseData,
      };
      saveConfig(newConfig);
      toast({
        title: "Configuration sauvegardée",
        description: `Les paramètres de connexion ${databaseType === 'mongodb' ? 'MongoDB' : 'Firebase'} ont été sauvegardés avec succès.`,
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Erreur de sauvegarde",
        description: "Impossible de sauvegarder la configuration.",
        variant: "destructive",
      });
    }
  };

  const handleTest = () => {
    const testConfig = {
      type: databaseType,
      mongodb: mongoData,
      firebase: firebaseData,
    };
    testConnection(testConfig);
  };

  const generatePreviewUrl = () => {
    if (databaseType === 'firebase') {
      return `Firebase Project: ${firebaseData.projectId}`;
    }
    
    if (useConnectionString && mongoData.connectionString) {
      return mongoData.connectionString;
    }
    
    let url = `mongodb://`;
    if (mongoData.username && mongoData.password) {
      url += `${mongoData.username}:***@`;
    }
    url += `${mongoData.host}:${mongoData.port}`;
    if (mongoData.database) {
      url += `/${mongoData.database}`;
    }
    const params = [];
    if (mongoData.authSource) params.push(`authSource=${mongoData.authSource}`);
    if (mongoData.ssl) params.push('ssl=true');
    if (mongoData.allowInvalidCertificates) params.push('tlsAllowInvalidCertificates=true');
    if (params.length > 0) {
      url += `?${params.join('&')}`;
    }
    return url;
  };

  const handleCertificateAccepted = () => {
    setShowCertificateHelper(false);
  };

  // Détecter si l'erreur est liée au certificat SSL
  const isSSLError = connectionTest && !connectionTest.success && 
    (connectionTest.message.includes('SSL') || connectionTest.message.includes('certificat'));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Configuration Base de Données
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Sélection du type de base de données */}
        <div className="space-y-2">
          <Label htmlFor="database-type">Type de base de données</Label>
          <Select value={databaseType} onValueChange={(value: DatabaseType) => setDatabaseType(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner le type de base de données" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mongodb">MongoDB</SelectItem>
              <SelectItem value="firebase">Firebase/Firestore</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Configuration MongoDB */}
        {databaseType === 'mongodb' && (
          <>
            {/* Helper de certificat SSL */}
            {(isSSLError || showCertificateHelper) && (
              <CertificateHelper 
                baseUrl="https://161.97.108.157:30433"
                onCertificateAccepted={handleCertificateAccepted}
              />
            )}

            <div className="flex items-center space-x-2 p-2 sm:p-0">
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
                  value={mongoData.connectionString || ''}
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
                    value={mongoData.host}
                    onChange={(e) => handleMongoInputChange('host', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="port">Port</Label>
                  <Input
                    id="port"
                    type="number"
                    value={mongoData.port}
                    onChange={(e) => handleMongoInputChange('port', parseInt(e.target.value) || 27017)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="database">Base de données</Label>
                  <Input
                    id="database"
                    type="text"
                    value={mongoData.database}
                    onChange={(e) => handleMongoInputChange('database', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username">Nom d'utilisateur</Label>
                  <Input
                    id="username"
                    type="text"
                    value={mongoData.username || ''}
                    onChange={(e) => handleMongoInputChange('username', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Mot de passe</Label>
                  <Input
                    id="password"
                    type="password"
                    value={mongoData.password || ''}
                    onChange={(e) => handleMongoInputChange('password', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="authSource">Source d'authentification</Label>
                  <Input
                    id="authSource"
                    type="text"
                    value={mongoData.authSource || ''}
                    onChange={(e) => handleMongoInputChange('authSource', e.target.value)}
                  />
                </div>
              </div>
            )}

            <div className="space-y-3 sm:space-y-4 p-2 sm:p-0">
              <div className="flex items-center space-x-2">
                <Switch
                  id="ssl"
                  checked={mongoData.ssl}
                  onCheckedChange={(checked) => handleMongoInputChange('ssl', checked)}
                />
                <Label htmlFor="ssl" className="text-sm sm:text-base">Activer SSL</Label>
              </div>

              <div className="flex items-start space-x-2">
                <Switch
                  id="allowInvalidCertificates"
                  checked={mongoData.allowInvalidCertificates}
                  onCheckedChange={(checked) => handleMongoInputChange('allowInvalidCertificates', checked)}
                  className="mt-1"
                />
                <Label htmlFor="allowInvalidCertificates" className="flex items-start gap-2 text-sm sm:text-base leading-tight">
                  <Shield className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                  <span>Autoriser les certificats invalides (certificats auto-signés)</span>
                </Label>
              </div>
            </div>
          </>
        )}

        {/* Configuration Firebase */}
        {databaseType === 'firebase' && (
          <div className="grid grid-cols-1 gap-3 sm:gap-4">
            <div className="space-y-2">
              <Label htmlFor="projectId">Project ID</Label>
              <Input
                id="projectId"
                type="text"
                value={firebaseData.projectId}
                onChange={(e) => handleFirebaseInputChange('projectId', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="apiKey">API Key</Label>
              <Input
                id="apiKey"
                type="text"
                value={firebaseData.apiKey}
                onChange={(e) => handleFirebaseInputChange('apiKey', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="authDomain">Auth Domain</Label>
              <Input
                id="authDomain"
                type="text"
                value={firebaseData.authDomain}
                onChange={(e) => handleFirebaseInputChange('authDomain', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="storageBucket">Storage Bucket</Label>
              <Input
                id="storageBucket"
                type="text"
                value={firebaseData.storageBucket}
                onChange={(e) => handleFirebaseInputChange('storageBucket', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="messagingSenderId">Messaging Sender ID</Label>
              <Input
                id="messagingSenderId"
                type="text"
                value={firebaseData.messagingSenderId}
                onChange={(e) => handleFirebaseInputChange('messagingSenderId', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="appId">App ID</Label>
              <Input
                id="appId"
                type="text"
                value={firebaseData.appId}
                onChange={(e) => handleFirebaseInputChange('appId', e.target.value)}
              />
            </div>
          </div>
        )}

        <Alert className="mx-2 sm:mx-0">
          <Info className="h-4 w-4 flex-shrink-0" />
          <AlertDescription className="space-y-2">
            <div className="font-medium text-sm sm:text-base">Configuration actuelle:</div>
            <code className="text-xs sm:text-sm bg-gray-100 p-2 rounded block break-all whitespace-pre-wrap">
              {generatePreviewUrl()}
            </code>
          </AlertDescription>
        </Alert>

        <div className="flex flex-col sm:flex-row gap-2 p-2 sm:p-0">
          <Button onClick={handleSave} variant="outline" className="w-full sm:w-auto">
            Sauvegarder
          </Button>
          <Button onClick={handleTest} disabled={isLoading} className="w-full sm:w-auto">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                <span className="hidden sm:inline">Test en cours...</span>
                <span className="sm:hidden">Test...</span>
              </>
            ) : (
              <>
                <span className="hidden sm:inline">Tester la connexion</span>
                <span className="sm:hidden">Tester</span>
              </>
            )}
          </Button>
          {databaseType === 'mongodb' && !showCertificateHelper && (
            <Button 
              onClick={() => setShowCertificateHelper(true)} 
              variant="outline"
              className="text-amber-600 border-amber-300 hover:bg-amber-50 w-full sm:w-auto"
            >
              <span className="hidden sm:inline">Gérer le certificat SSL</span>
              <span className="sm:hidden">Gérer certificat</span>
            </Button>
          )}
        </div>

        {connectionTest && (
          <Alert className={`mx-2 sm:mx-0 ${connectionTest.success ? 'border-green-500' : 'border-red-500'}`}>
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
                <p><span className="font-medium">Host:</span> {connectionTest.details.host}</p>
                <p><span className="font-medium">Base de données:</span> {connectionTest.details.database}</p>
                {connectionTest.details.collections && (
                  <p><span className="font-medium">Collections:</span> {connectionTest.details.collections.join(', ')}</p>
                )}
                {connectionTest.details.latency && (
                  <p><span className="font-medium">Latence:</span> {connectionTest.details.latency}ms</p>
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