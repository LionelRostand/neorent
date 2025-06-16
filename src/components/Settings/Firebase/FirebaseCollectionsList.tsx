
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Database, FileText, Users, Home, Calendar, CreditCard, Settings as SettingsIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const FirebaseCollectionsList = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const { toast } = useToast();

  const [collections] = useState([
    {
      name: 'Rent_properties',
      icon: Home,
      description: 'Propriétés immobilières',
      documentCount: 12,
      status: 'active',
      lastModified: '2024-01-15T10:30:00Z'
    },
    {
      name: 'Rent_tenants',
      icon: Users,
      description: 'Locataires',
      documentCount: 28,
      status: 'active',
      lastModified: '2024-01-14T16:45:00Z'
    },
    {
      name: 'Rent_colocataires',
      icon: Users,
      description: 'Colocataires',
      documentCount: 34,
      status: 'active',
      lastModified: '2024-01-14T14:20:00Z'
    },
    {
      name: 'Rent_Payments',
      icon: CreditCard,
      description: 'Paiements de loyers',
      documentCount: 156,
      status: 'active',
      lastModified: '2024-01-15T09:15:00Z'
    },
    {
      name: 'Rent_Contracts',
      icon: FileText,
      description: 'Contrats de location',
      documentCount: 23,
      status: 'active',
      lastModified: '2024-01-13T11:30:00Z'
    },
    {
      name: 'Rent_Inspections',
      icon: Calendar,
      description: 'Inspections et visites',
      documentCount: 45,
      status: 'active',
      lastModified: '2024-01-12T15:20:00Z'
    },
    {
      name: 'Rent_Maintenances',
      icon: SettingsIcon,
      description: 'Maintenance et réparations',
      documentCount: 67,
      status: 'active',
      lastModified: '2024-01-14T08:45:00Z'
    },
    {
      name: 'Rent_Companies',
      icon: Database,
      description: 'Informations des entreprises',
      documentCount: 3,
      status: 'active',
      lastModified: '2024-01-10T12:00:00Z'
    }
  ]);

  const handleRefreshCollections = async () => {
    setRefreshing(true);
    
    // Simuler une requête de rafraîchissement
    setTimeout(() => {
      setRefreshing(false);
      setLastRefresh(new Date());
      toast({
        title: "Collections mises à jour",
        description: "Les informations des collections Firebase ont été actualisées.",
      });
    }, 2000);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Actif</Badge>;
      case 'inactive':
        return <Badge variant="secondary">Inactif</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
              <Database className="h-5 w-5" />
              Collections Firebase configurées
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              Dernière mise à jour: {lastRefresh.toLocaleDateString('fr-FR')} à {lastRefresh.toLocaleTimeString('fr-FR')}
            </p>
          </div>
          <Button 
            onClick={handleRefreshCollections}
            disabled={refreshing}
            className="w-full sm:w-auto"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Actualisation...' : 'Actualiser'}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 md:space-y-4">
          {collections.map((collection) => {
            const Icon = collection.icon;
            return (
              <div
                key={collection.name}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 md:p-4 border rounded-lg hover:bg-gray-50 transition-colors gap-3 sm:gap-4"
              >
                <div className="flex items-start sm:items-center space-x-3 min-w-0 flex-1">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="h-5 w-5 md:h-6 md:w-6 text-blue-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-sm md:text-base text-gray-900 truncate">
                      {collection.name}
                    </h3>
                    <p className="text-xs md:text-sm text-gray-600 mt-1">
                      {collection.description}
                    </p>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mt-2 text-xs text-gray-500">
                      <span>{collection.documentCount} document{collection.documentCount > 1 ? 's' : ''}</span>
                      <span className="hidden sm:inline">•</span>
                      <span>Modifié le {formatDate(collection.lastModified)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 sm:gap-3">
                  {getStatusBadge(collection.status)}
                  <div className="text-right">
                    <div className="font-semibold text-lg md:text-xl text-blue-600">
                      {collection.documentCount}
                    </div>
                    <div className="text-xs text-gray-500">
                      docs
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-semibold text-blue-900 mb-2 text-sm md:text-base">Informations importantes</h4>
          <ul className="space-y-1 text-xs md:text-sm text-blue-800">
            <li>• Les collections sont automatiquement créées lors de l'ajout du premier document</li>
            <li>• Les règles de sécurité Firestore s'appliquent à toutes les collections</li>
            <li>• La synchronisation en temps réel est activée pour toutes les collections</li>
            <li>• Cliquez sur "Actualiser" pour mettre à jour les statistiques</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default FirebaseCollectionsList;
