
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle, XCircle, Database, Info, Shield } from 'lucide-react';
import { useMongoConfig } from '@/hooks/useMongoConfig';
import { MongoConfig } from '@/services/mongoConfig';
import CertificateHelper from './CertificateHelper';

const MongoConfigComponent: React.FC = () => {
  const { t } = useTranslation();
  const { config, saveConfig, testConnection, isLoading, connectionTest } = useMongoConfig();
  
  const [formData, setFormData] = useState<MongoConfig>({
    host: config?.host || '161.97.108.157',
    port: config?.port || 27017,
    database: config?.database || 'immobilier',
    username: config?.username || '',
    password: config?.password || '',
    authSource: config?.authSource || 'admin',
    ssl: config?.ssl || false,
    allowInvalidCertificates: config?.allowInvalidCertificates || false,
    connectionString: config?.connectionString || '',
  });

  const [useConnectionString, setUseConnectionString] = useState(false);
  const [showCertificateHelper, setShowCertificateHelper] = useState(false);

  const handleInputChange = (field: keyof MongoConfig, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    saveConfig(formData);
  };

  const handleTest = () => {
    console.log('Testing connection with:', formData);
    testConnection(formData);
  };

  const generatePreviewUrl = () => {
    if (useConnectionString && formData.connectionString) {
      return formData.connectionString;
    }
    
    let url = `mongodb://`;
    if (formData.username && formData.password) {
      url += `${formData.username}:***@`;
    }
    url += `${formData.host}:${formData.port}`;
    if (formData.database) {
      url += `/${formData.database}`;
    }
    const params = [];
    if (formData.authSource) params.push(`authSource=${formData.authSource}`);
    if (formData.ssl) params.push('ssl=true');
    if (formData.allowInvalidCertificates) params.push('tlsAllowInvalidCertificates=true');
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
          Configuration MongoDB
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Helper de certificat SSL */}
        {(isSSLError || showCertificateHelper) && (
          <CertificateHelper 
            baseUrl="https://161.97.108.157:30433"
            onCertificateAccepted={handleCertificateAccepted}
          />
        )}

        <div className="flex items-center space-x-2">
          <Switch
            id="use-connection-string"
            checked={useConnectionString}
            onCheckedChange={setUseConnectionString}
          />
          <Label htmlFor="use-connection-string">
            Utiliser une chaîne de connexion complète
          </Label>
        </div>

        {useConnectionString ? (
          <div className="space-y-2">
            <Label htmlFor="connectionString">Chaîne de connexion MongoDB</Label>
            <Input
              id="connectionString"
              type="text"
              value={formData.connectionString || ''}
              onChange={(e) => handleInputChange('connectionString', e.target.value)}
              placeholder="mongodb://username:password@host:port/database"
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="host">Host</Label>
              <Input
                id="host"
                type="text"
                value={formData.host}
                onChange={(e) => handleInputChange('host', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="port">Port</Label>
              <Input
                id="port"
                type="number"
                value={formData.port}
                onChange={(e) => handleInputChange('port', parseInt(e.target.value) || 27017)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="database">Base de données</Label>
              <Input
                id="database"
                type="text"
                value={formData.database}
                onChange={(e) => handleInputChange('database', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Nom d'utilisateur</Label>
              <Input
                id="username"
                type="text"
                value={formData.username || ''}
                onChange={(e) => handleInputChange('username', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                value={formData.password || ''}
                onChange={(e) => handleInputChange('password', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="authSource">Source d'authentification</Label>
              <Input
                id="authSource"
                type="text"
                value={formData.authSource || ''}
                onChange={(e) => handleInputChange('authSource', e.target.value)}
              />
            </div>
          </div>
        )}

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="ssl"
              checked={formData.ssl}
              onCheckedChange={(checked) => handleInputChange('ssl', checked)}
            />
            <Label htmlFor="ssl">Activer SSL</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="allowInvalidCertificates"
              checked={formData.allowInvalidCertificates}
              onCheckedChange={(checked) => handleInputChange('allowInvalidCertificates', checked)}
            />
            <Label htmlFor="allowInvalidCertificates" className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-amber-600" />
              Autoriser les certificats invalides (certificats auto-signés)
            </Label>
          </div>
        </div>

        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            <strong>URL de connexion générée:</strong>
            <br />
            <code className="text-sm bg-gray-100 p-1 rounded break-all">
              {generatePreviewUrl()}
            </code>
          </AlertDescription>
        </Alert>

        <div className="flex gap-2">
          <Button onClick={handleSave} variant="outline">
            Sauvegarder
          </Button>
          <Button onClick={handleTest} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Test en cours...
              </>
            ) : (
              'Tester la connexion'
            )}
          </Button>
          {!showCertificateHelper && (
            <Button 
              onClick={() => setShowCertificateHelper(true)} 
              variant="outline"
              className="text-amber-600 border-amber-300 hover:bg-amber-50"
            >
              Gérer le certificat SSL
            </Button>
          )}
        </div>

        {connectionTest && (
          <Alert className={connectionTest.success ? 'border-green-500' : 'border-red-500'}>
            <div className="flex items-center gap-2">
              {connectionTest.success ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500" />
              )}
              <AlertDescription className="flex-1">
                {connectionTest.message}
              </AlertDescription>
            </div>
            {connectionTest.details && (
              <div className="mt-2 text-sm text-gray-600">
                <p>Host: {connectionTest.details.host}</p>
                <p>Base de données: {connectionTest.details.database}</p>
                {connectionTest.details.collections && (
                  <p>Collections: {connectionTest.details.collections.join(', ')}</p>
                )}
                {connectionTest.details.latency && (
                  <p>Latence: {connectionTest.details.latency}ms</p>
                )}
              </div>
            )}
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default MongoConfigComponent;
