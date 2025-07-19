
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Database } from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

const FirebaseCollectionsExport = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);

  const collections = [
    'Rent_contracts',
    'Rent_Inspections',
    'rent_properties',
    'rent_tenants',
    'rent_payments'
  ];

  const exportCollection = async (collectionName: string) => {
    try {
      setIsExporting(true);
      const querySnapshot = await getDocs(collection(db, collectionName));
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json'
      });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${collectionName}-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Export réussi",
        description: `Collection ${collectionName} exportée avec succès`,
      });
    } catch (error) {
      console.error('Error exporting collection:', error);
      toast({
        title: "Erreur d'export",
        description: `Impossible d'exporter la collection ${collectionName}`,
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const exportAllCollections = async () => {
    try {
      setIsExporting(true);
      const allData: Record<string, any[]> = {};

      for (const collectionName of collections) {
        const querySnapshot = await getDocs(collection(db, collectionName));
        allData[collectionName] = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      }

      const blob = new Blob([JSON.stringify(allData, null, 2)], {
        type: 'application/json'
      });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `firebase-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Export complet réussi",
        description: "Toutes les collections ont été exportées avec succès",
      });
    } catch (error) {
      console.error('Error exporting all collections:', error);
      toast({
        title: "Erreur d'export",
        description: "Impossible d'exporter toutes les collections",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export des Collections Firebase
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            Exportez vos collections Firebase au format JSON pour sauvegarde ou migration.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {collections.map((collectionName) => (
              <Card key={collectionName} className="border">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Database className="h-4 w-4 text-blue-600" />
                      <span className="font-medium">{collectionName}</span>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => exportCollection(collectionName)}
                      disabled={isExporting}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Export
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex justify-center pt-4">
            <Button
              onClick={exportAllCollections}
              disabled={isExporting}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Download className="h-4 w-4 mr-2" />
              {isExporting ? 'Export en cours...' : 'Exporter toutes les collections'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FirebaseCollectionsExport;
