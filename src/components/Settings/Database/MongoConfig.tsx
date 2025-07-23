
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
import { useToast } from '@/hooks/use-toast';
import CertificateHelper from './CertificateHelper';

const MongoConfigComponent: React.FC = () => {
  const { t } = useTranslation();
  const { config, testConnection, isLoading, connectionTest } = useMongoConfig();
  const { toast } = useToast();

  const handleTest = () => {
    testConnection();
  };

  const generatePreviewUrl = () => {
    return `Firebase Project: ${config?.projectId || 'neorent-23d85'}`;
  };


  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Configuration Firebase/Firestore
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <Label>Project ID</Label>
            <Input
              type="text"
              value={config?.projectId || 'neorent-23d85'}
              disabled
              className="bg-gray-50"
            />
          </div>
          <div className="space-y-2">
            <Label>Auth Domain</Label>
            <Input
              type="text"
              value={config?.authDomain || 'neorent-23d85.firebaseapp.com'}
              disabled
              className="bg-gray-50"
            />
          </div>
          <div className="space-y-2">
            <Label>Storage Bucket</Label>
            <Input
              type="text"
              value={config?.storageBucket || 'neorent-23d85.firebasestorage.app'}
              disabled
              className="bg-gray-50"
            />
          </div>
          <div className="space-y-2">
            <Label>Statut</Label>
            <Input
              type="text"
              value={config?.status || 'Connecté'}
              disabled
              className="bg-green-50 text-green-700"
            />
          </div>
        </div>

        <Alert className="mx-2 sm:mx-0">
          <Info className="h-4 w-4 flex-shrink-0" />
          <AlertDescription className="space-y-2">
            <div className="font-medium text-sm sm:text-base">Configuration Firebase:</div>
            <code className="text-xs sm:text-sm bg-gray-100 p-2 rounded block break-all whitespace-pre-wrap">
              {generatePreviewUrl()}
            </code>
          </AlertDescription>
        </Alert>

        <div className="flex flex-col sm:flex-row gap-2 p-2 sm:p-0">
          <Button onClick={handleTest} disabled={isLoading} className="w-full sm:w-auto">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                <span className="hidden sm:inline">Test en cours...</span>
                <span className="sm:hidden">Test...</span>
              </>
            ) : (
              <>
                <span className="hidden sm:inline">Tester la connexion Firebase</span>
                <span className="sm:hidden">Tester</span>
              </>
            )}
          </Button>
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
                <p><span className="font-medium">Project ID:</span> {connectionTest.details.projectId}</p>
                <p><span className="font-medium">Documents totaux:</span> {connectionTest.details.documentsCount}</p>
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

export default MongoConfigComponent;
