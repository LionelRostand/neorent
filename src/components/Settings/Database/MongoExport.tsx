
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Download, Database, FileText, Loader2, RefreshCw } from 'lucide-react';
import { useMongoExport } from '@/hooks/useMongoExport';
import { useToast } from '@/hooks/use-toast';

const MongoExport: React.FC = () => {
  const { collections, isLoading, error, fetchCollections, exportAsJSON } = useMongoExport();
  const { toast } = useToast();

  const handleExport = async () => {
    try {
      await exportAsJSON();
      toast({
        title: "Export réussi",
        description: "Les collections ont été exportées au format JSON",
      });
    } catch (error) {
      toast({
        title: "Erreur d'export",
        description: "Impossible d'exporter les collections",
        variant: "destructive",
      });
    }
  };

  const handleFetchCollections = async () => {
    try {
      await fetchCollections();
      toast({
        title: "Collections récupérées",
        description: `${collections.length} collections trouvées`,
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de récupérer les collections",
        variant: "destructive",
      });
    }
  };

  const getTotalDocuments = () => {
    return collections.reduce((total, collection) => total + collection.count, 0);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Export des Collections MongoDB
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            onClick={handleFetchCollections}
            disabled={isLoading}
            variant="outline"
            className="flex items-center gap-2"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            Récupérer les collections
          </Button>
          
          <Button 
            onClick={handleExport}
            disabled={isLoading || collections.length === 0}
            className="flex items-center gap-2"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            Exporter en JSON
          </Button>
        </div>

        {error && (
          <Alert className="border-red-500">
            <AlertDescription className="text-red-800">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {collections.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Collections trouvées</h3>
              <Badge variant="outline" className="text-sm">
                {collections.length} collections • {getTotalDocuments()} documents
              </Badge>
            </div>
            
            <div className="grid gap-3">
              {collections.map((collection, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Database className="h-4 w-4 text-blue-600" />
                    <div>
                      <h4 className="font-medium">{collection.name}</h4>
                      <p className="text-sm text-gray-600">
                        {collection.count} document{collection.count > 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary">
                    {collection.count}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        <Alert>
          <AlertDescription>
            <strong>Note:</strong> L'export inclura toutes les données des collections. 
            Assurez-vous que votre configuration MongoDB permet l'accès aux collections souhaitées.
            Si vous avez des problèmes de certificat SSL, activez l'option "Autoriser les certificats invalides" 
            dans la configuration MongoDB.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};

export default MongoExport;
