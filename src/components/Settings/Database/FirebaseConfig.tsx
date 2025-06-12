
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Database, Copy, ExternalLink } from 'lucide-react';
import { firebaseConfig } from '@/lib/firebase';

interface FirebaseConfigProps {
  onCopy: (text: string, type: string) => void;
}

export const FirebaseConfig: React.FC<FirebaseConfigProps> = ({ onCopy }) => {
  const configItems = [
    { label: 'Project ID', value: firebaseConfig.projectId, sensitive: false },
    { label: 'Auth Domain', value: firebaseConfig.authDomain, sensitive: false },
    { label: 'Storage Bucket', value: firebaseConfig.storageBucket, sensitive: false },
    { label: 'Messaging Sender ID', value: firebaseConfig.messagingSenderId, sensitive: false },
    { label: 'App ID', value: firebaseConfig.appId, sensitive: false },
    { label: 'API Key', value: firebaseConfig.apiKey, sensitive: true }
  ];

  const openFirebaseConsole = () => {
    window.open(`https://console.firebase.google.com/project/${firebaseConfig.projectId}`, '_blank');
  };

  const copyConfig = () => {
    const configText = JSON.stringify(firebaseConfig, null, 2);
    onCopy(configText, 'Configuration Firebase');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-base sm:text-lg md:text-xl">
          <div className="flex items-center gap-2">
            <Database className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600" />
            <span className="text-sm sm:text-base md:text-lg">Configuration Firebase</span>
          </div>
          <div className="flex flex-col xs:flex-row gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={copyConfig}
              className="flex items-center gap-2 text-xs sm:text-sm w-full xs:w-auto"
            >
              <Copy className="h-3 w-3 sm:h-4 sm:w-4" />
              Copier
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={openFirebaseConsole}
              className="flex items-center gap-2 text-xs sm:text-sm w-full xs:w-auto"
            >
              <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4" />
              Console
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {configItems.map((item) => (
              <div key={item.label} className="space-y-2">
                <label className="text-xs sm:text-sm font-medium text-gray-700">
                  {item.label}
                </label>
                <div className="relative">
                  <input
                    type={item.sensitive ? 'password' : 'text'}
                    value={item.value}
                    readOnly
                    className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-xs sm:text-sm pr-8 sm:pr-10"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 sm:right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                    onClick={() => onCopy(item.value, item.label)}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-2">
              <span className="text-blue-600 text-xs sm:text-sm">ℹ️</span>
              <div className="text-xs sm:text-sm">
                <p className="font-medium text-blue-800 mb-1">État de la connexion :</p>
                <ul className="text-blue-700 space-y-1">
                  <li>• <strong>Firestore :</strong> Connecté et opérationnel</li>
                  <li>• <strong>Authentication :</strong> Configuré et actif</li>
                  <li>• <strong>Storage :</strong> Disponible pour le stockage de fichiers</li>
                  <li>• <strong>Région :</strong> {firebaseConfig.storageBucket?.includes('europe') ? 'Europe' : 'US-Central'}</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="p-3 sm:p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start gap-2">
              <span className="text-yellow-600 text-xs sm:text-sm">⚠️</span>
              <div className="text-xs sm:text-sm">
                <p className="font-medium text-yellow-800 mb-1">Sécurité :</p>
                <ul className="text-yellow-700 space-y-1">
                  <li>• L'API Key est publique (normale pour les apps frontend)</li>
                  <li>• La sécurité est assurée par les règles Firestore</li>
                  <li>• Vérifiez régulièrement vos règles de sécurité</li>
                  <li>• Surveillez l'usage dans la console Firebase</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
