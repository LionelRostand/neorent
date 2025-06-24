
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Wrench, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useFirebaseMaintenances } from '@/hooks/useFirebaseMaintenances';
import { useOwnerData } from '@/hooks/useOwnerData';

interface AdminMaintenanceViewProps {
  currentProfile: any;
}

const AdminMaintenanceView: React.FC<AdminMaintenanceViewProps> = ({ currentProfile }) => {
  const { t } = useTranslation();
  const { requests } = useFirebaseMaintenances();
  const { propertyTitles } = useOwnerData(currentProfile);

  // Filter maintenance requests by owner's properties
  const ownerMaintenances = requests.filter(maintenance => 
    propertyTitles.includes(maintenance.property)
  );

  const totalMaintenances = ownerMaintenances.length;
  const pendingMaintenances = ownerMaintenances.filter(m => m.status === 'En attente').length;
  const urgentMaintenances = ownerMaintenances.filter(m => m.priority === 'Élevée').length;
  const completedMaintenances = ownerMaintenances.filter(m => m.status === 'Terminé').length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Maintenance</h1>
            <p className="text-gray-600 mt-1">Gérez vos demandes de maintenance</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle demande
          </Button>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Demandes</CardTitle>
              <Wrench className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalMaintenances}</div>
              <p className="text-xs text-muted-foreground">{totalMaintenances} demandes enregistrées</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">En Attente</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingMaintenances}</div>
              <p className="text-xs text-muted-foreground">{pendingMaintenances} à traiter</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Urgentes</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{urgentMaintenances}</div>
              <p className="text-xs text-muted-foreground">{urgentMaintenances} prioritaires</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Terminées</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedMaintenances}</div>
              <p className="text-xs text-muted-foreground">{completedMaintenances} complétées</p>
            </CardContent>
          </Card>
        </div>

        {/* Maintenance List */}
        <Card>
          <CardHeader>
            <CardTitle>Demandes de Maintenance</CardTitle>
          </CardHeader>
          <CardContent>
            {ownerMaintenances.length === 0 ? (
              <div className="text-center py-8">
                <Wrench className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Aucune demande de maintenance</p>
                <p className="text-sm text-gray-400">Les demandes apparaîtront ici</p>
              </div>
            ) : (
              <div className="space-y-4">
                {ownerMaintenances.map((maintenance) => (
                  <div key={maintenance.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center space-x-4">
                      <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                        <Wrench className="h-6 w-6 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{maintenance.title}</h3>
                        <p className="text-sm text-gray-600">{maintenance.property}</p>
                        <p className="text-sm text-gray-500">Catégorie: {maintenance.category}</p>
                        <p className="text-sm text-gray-500">Créé le: {maintenance.createdAt}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge 
                        variant={
                          maintenance.status === 'Terminé' ? 'default' :
                          maintenance.priority === 'Élevée' ? 'destructive' : 'secondary'
                        }
                      >
                        {maintenance.status}
                      </Badge>
                      <p className="text-sm text-gray-500 mt-1">
                        Priorité: {maintenance.priority}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminMaintenanceView;
