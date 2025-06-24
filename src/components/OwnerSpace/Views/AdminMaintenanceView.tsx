
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Wrench, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useFirebaseMaintenances } from '@/hooks/useFirebaseMaintenances';
import { useOwnerData } from '@/hooks/useOwnerData';
import MaintenanceRequestForm from '@/components/Maintenance/MaintenanceRequestForm';

interface AdminMaintenanceViewProps {
  currentProfile: any;
}

const AdminMaintenanceView: React.FC<AdminMaintenanceViewProps> = ({ currentProfile }) => {
  const { t } = useTranslation();
  const { requests } = useFirebaseMaintenances();
  const { propertyTitles } = useOwnerData(currentProfile);
  const [showMaintenanceForm, setShowMaintenanceForm] = useState(false);

  // Filter maintenance requests by owner's properties
  const ownerMaintenances = requests.filter(maintenance => 
    propertyTitles.includes(maintenance.propertyId)
  );

  const totalMaintenances = ownerMaintenances.length;
  const pendingMaintenances = ownerMaintenances.filter(m => m.status === 'En attente').length;
  const urgentMaintenances = ownerMaintenances.filter(m => m.priority === 'Élevée').length;
  const completedMaintenances = ownerMaintenances.filter(m => m.status === 'Terminé').length;

  const handleMaintenanceSubmit = async (maintenanceData: any) => {
    console.log('Maintenance data:', maintenanceData);
    setShowMaintenanceForm(false);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header harmonisé avec la sidebar */}
      <div className="bg-gradient-to-r from-orange-600 to-orange-700 rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Maintenance</h1>
            <p className="text-orange-100 mt-2">Gérez vos demandes de maintenance et de réparation</p>
          </div>
          <Button 
            className="bg-white text-orange-600 hover:bg-orange-50 border-0 shadow-md"
            onClick={() => setShowMaintenanceForm(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle demande
          </Button>
        </div>
      </div>

      {/* Metrics Grid avec style harmonisé */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-orange-500 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Demandes</CardTitle>
            <div className="p-2 bg-orange-100 rounded-lg">
              <Wrench className="h-4 w-4 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{totalMaintenances}</div>
            <p className="text-xs text-gray-500 mt-1">{totalMaintenances} demandes enregistrées</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">En Attente</CardTitle>
            <div className="p-2 bg-blue-100 rounded-lg">
              <Clock className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{pendingMaintenances}</div>
            <p className="text-xs text-gray-500 mt-1">{pendingMaintenances} à traiter</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Urgentes</CardTitle>
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{urgentMaintenances}</div>
            <p className="text-xs text-gray-500 mt-1">{urgentMaintenances} prioritaires</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Terminées</CardTitle>
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{completedMaintenances}</div>
            <p className="text-xs text-gray-500 mt-1">{completedMaintenances} complétées</p>
          </CardContent>
        </Card>
      </div>

      {/* Maintenance List avec style amélioré */}
      <Card className="shadow-lg border-0">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b">
          <CardTitle className="text-xl text-gray-800">Demandes de Maintenance</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {ownerMaintenances.length === 0 ? (
            <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-white rounded-lg border-2 border-dashed border-gray-200">
              <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Wrench className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">Aucune demande de maintenance</h3>
              <p className="text-gray-500 mb-4">Commencez par créer votre première demande</p>
              <Button className="bg-orange-600 hover:bg-orange-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Créer une demande
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {ownerMaintenances.map((maintenance) => (
                <div key={maintenance.id} className="flex items-center justify-between p-6 border rounded-xl hover:shadow-md transition-all duration-200 bg-gradient-to-r from-white to-gray-50">
                  <div className="flex items-center space-x-4">
                    <div className="h-14 w-14 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl flex items-center justify-center">
                      <Wrench className="h-7 w-7 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{maintenance.description}</h3>
                      <p className="text-sm text-gray-600 font-medium">{maintenance.propertyId}</p>
                      <div className="flex items-center space-x-4 mt-1">
                        <p className="text-sm text-gray-500">Catégorie: {maintenance.category}</p>
                        <p className="text-sm text-gray-500">
                          Créé le: {maintenance.createdAt?.toDate?.()?.toLocaleDateString() || 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge 
                      variant={
                        maintenance.status === 'Terminé' ? 'default' :
                        maintenance.priority === 'Élevée' ? 'destructive' : 'secondary'
                      }
                      className="mb-2"
                    >
                      {maintenance.status}
                    </Badge>
                    <p className="text-sm text-gray-500">
                      Priorité: {maintenance.priority}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showMaintenanceForm} onOpenChange={setShowMaintenanceForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nouvelle Demande de Maintenance</DialogTitle>
          </DialogHeader>
          <MaintenanceRequestForm 
            isOpen={true}
            onClose={() => setShowMaintenanceForm(false)}
            onSubmit={handleMaintenanceSubmit}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminMaintenanceView;
