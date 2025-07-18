
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Download, Database, RefreshCw, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface CollectionInfo {
  name: string;
  count: number;
  data: any[];
}

export const FirebaseCollectionsExport: React.FC = () => {
  const [collections, setCollections] = useState<CollectionInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const { toast } = useToast();

  const collectionNames = [
    'Properties',
    'Tenants', 
    'Roommates',
    'Rent_payments',
    'Rent_contracts',
    'Inspections',
    'Maintenances',
    'Companies'
  ];

  const fetchCollections = async () => {
    setLoading(true);
    const collectionsData: CollectionInfo[] = [];

    try {
      for (const collectionName of collectionNames) {
        try {
          const querySnapshot = await getDocs(collection(db, collectionName));
          const data = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));

          collectionsData.push({
            name: collectionName,
            count: data.length,
            data: data
          });
        } catch (error) {
          console.warn(`Collection ${collectionName} not accessible:`, error);
          collectionsData.push({
            name: collectionName,
            count: 0,
            data: []
          });
        }
      }

      setCollections(collectionsData);
      toast({
        title: "Collections récupérées",
        description: `${collectionsData.length} collections analysées`,
      });
    } catch (error) {
      console.error('Error fetching collections:', error);
      toast({
        title: "Erreur",
        description: "Impossible de récupérer les collections",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const exportToJSON = async () => {
    if (collections.length === 0) {
      toast({
        title: "Aucune donnée",
        description: "Veuillez d'abord récupérer les collections",
        variant: "destructive",
      });
      return;
    }

    setExporting(true);
    try {
      const exportData = {
        exportDate: new Date().toISOString(),
        collections: collections.reduce((acc, collection) => {
          acc[collection.name] = collection.data;
          return acc;
        }, {} as Record<string, any[]>),
        summary: {
          totalCollections: collections.length,
          totalDocuments: collections.reduce((sum, col) => sum + col.count, 0),
          collectionsInfo: collections.map(col => ({
            name: col.name,
            documentCount: col.count
          }))
        }
      };

      const jsonString = JSON.stringify(exportData, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `firebase-collections-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Export réussi",
        description: "Les collections ont été exportées en JSON",
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Erreur d'export",
        description: "Impossible d'exporter les collections",
        variant: "destructive",
      });
    } finally {
      setExporting(false);
    }
  };

  const getTotalDocuments = () => {
    return collections.reduce((total, collection) => total + collection.count, 0);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          <Database className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
          Export des Collections Firebase
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            onClick={fetchCollections}
            disabled={loading}
            variant="outline"
            className="flex items-center gap-2"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            Analyser les collections
          </Button>
          
          <Button 
            onClick={exportToJSON}
            disabled={loading || exporting || collections.length === 0}
            className="flex items-center gap-2"
          >
            {exporting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            Exporter en JSON
          </Button>
        </div>

        {collections.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Collections Firebase</h3>
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
                  <Badge 
                    variant={collection.count > 0 ? "default" : "secondary"}
                    className={collection.count > 0 ? "bg-green-100 text-green-800" : ""}
                  >
                    {collection.count}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        <Alert>
          <AlertDescription>
            <strong>Note:</strong> L'export inclura toutes les données des collections accessibles. 
            Le fichier JSON contiendra la structure complète avec les métadonnées d'export.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};
