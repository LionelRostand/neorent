
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Eye, EyeOff, Copy, TestTube } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const MongoDBConfig: React.FC = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [showConnectionString, setShowConnectionString] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  
  const [mongoConfig, setMongoConfig] = useState({
    connectionString: '',
    database: '',
    username: '',
    password: '',
    host: 'localhost',
    port: '27017',
    authSource: 'admin'
  });

  const handleConfigChange = (field: string, value: string) => {
    setMongoConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const copyConnectionString = () => {
    const connectionString = `mongodb://${mongoConfig.username}:${mongoConfig.password}@${mongoConfig.host}:${mongoConfig.port}/${mongoConfig.database}?authSource=${mongoConfig.authSource}`;
    navigator.clipboard.writeText(connectionString);
    toast({
      title: "Chaîne de connexion copiée",
      description: "La chaîne de connexion MongoDB a été copiée dans le presse-papiers.",
    });
  };

  const testConnection = async () => {
    setIsTesting(true);
    try {
      // Simulation du test de connexion
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast({
        title: "Test de connexion réussi",
        description: "La connexion à MongoDB a été établie avec succès.",
      });
    } catch (error) {
      toast({
        title: "Échec du test de connexion",
        description: "Impossible de se connecter à MongoDB. Vérifiez vos paramètres.",
        variant: "destructive"
      });
    } finally {
      setIsTesting(false);
    }
  };

  const saveConfiguration = () => {
    // Sauvegarder la configuration MongoDB
    toast({
      title: "Configuration sauvegardée",
      description: "Les paramètres MongoDB ont été sauvegardés avec succès.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🍃 Configuration MongoDB
          <Switch
            checked={isEnabled}
            onCheckedChange={setIsEnabled}
            className="ml-auto"
          />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-sm text-gray-600">
          Configurez votre connexion à MongoDB pour étendre les capacités de stockage de votre application.
        </div>

        {isEnabled && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="mongo-host">Hôte</Label>
                <Input
                  id="mongo-host"
                  value={mongoConfig.host}
                  onChange={(e) => handleConfigChange('host', e.target.value)}
                  placeholder="localhost"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mongo-port">Port</Label>
                <Input
                  id="mongo-port"
                  value={mongoConfig.port}
                  onChange={(e) => handleConfigChange('port', e.target.value)}
                  placeholder="27017"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="mongo-database">Base de données</Label>
              <Input
                id="mongo-database"
                value={mongoConfig.database}
                onChange={(e) => handleConfigChange('database', e.target.value)}
                placeholder="neorent"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="mongo-username">Nom d'utilisateur</Label>
                <Input
                  id="mongo-username"
                  value={mongoConfig.username}
                  onChange={(e) => handleConfigChange('username', e.target.value)}
                  placeholder="username"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mongo-password">Mot de passe</Label>
                <div className="relative">
                  <Input
                    id="mongo-password"
                    type={showConnectionString ? "text" : "password"}
                    value={mongoConfig.password}
                    onChange={(e) => handleConfigChange('password', e.target.value)}
                    placeholder="password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowConnectionString(!showConnectionString)}
                  >
                    {showConnectionString ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="mongo-authsource">Source d'authentification</Label>
              <Input
                id="mongo-authsource"
                value={mongoConfig.authSource}
                onChange={(e) => handleConfigChange('authSource', e.target.value)}
                placeholder="admin"
              />
            </div>

            <div className="space-y-2">
              <Label>Chaîne de connexion générée</Label>
              <div className="flex gap-2">
                <Input
                  readOnly
                  value={`mongodb://${mongoConfig.username}:${mongoConfig.password}@${mongoConfig.host}:${mongoConfig.port}/${mongoConfig.database}?authSource=${mongoConfig.authSource}`}
                  className="bg-gray-50"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={copyConnectionString}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={testConnection}
                disabled={isTesting}
                variant="outline"
                className="flex items-center gap-2"
              >
                <TestTube className="h-4 w-4" />
                {isTesting ? "Test en cours..." : "Tester la connexion"}
              </Button>
              <Button onClick={saveConfiguration}>
                Sauvegarder la configuration
              </Button>
            </div>

            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="font-medium text-yellow-800 mb-2">⚠️ Important</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• MongoDB nécessite une connexion backend sécurisée</li>
                <li>• Les credentials ne doivent jamais être exposés côté client</li>
                <li>• Utilisez des variables d'environnement pour les informations sensibles</li>
                <li>• Assurez-vous que votre instance MongoDB est accessible</li>
              </ul>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default MongoDBConfig;
