
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

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header responsive */}
      <div className="bg-gradient-to-r from-orange-600 to-orange-700 rounded-xl p-4 sm:p-6 text-white shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold truncate">{t('maintenance.title')}</h1>
            <p className="text-orange-100 mt-1 sm:mt-2 text-sm sm:text-base line-clamp-2 sm:line-clamp-1">
              {t('maintenance.subtitle')}
            </p>
          </div>
          <div className="flex-shrink-0">
            <Button 
              className="bg-white text-orange-600 hover:bg-orange-50 border-0 shadow-md w-full sm:w-auto"
              onClick={() => setShowMaintenanceForm(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">{t('maintenance.newRequest')}</span>
              <span className="sm:hidden">Nouvelle</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Metrics Grid responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card className="border-l-4 border-l-orange-500 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 sm:p-6">
            <CardTitle className="text-xs sm:text-sm font-medium text-gray-600 truncate pr-2">
              {t('maintenance.totalRequests')}
            </CardTitle>
            <div className="p-1.5 sm:p-2 bg-orange-100 rounded-lg flex-shrink-0">
              <Wrench className="h-3 w-3 sm:h-4 sm:w-4 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="text-xl sm:text-2xl font-bold text-gray-900">{totalMaintenances}</div>
            <p className="text-xs text-gray-500 mt-1 truncate">{totalMaintenances} {t('maintenance.requestsRegistered')}</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 sm:p-6">
            <CardTitle className="text-xs sm:text-sm font-medium text-gray-600 truncate pr-2">
              {t('maintenance.pendingRequests')}
            </CardTitle>
            <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg flex-shrink-0">
              <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="text-xl sm:text-2xl font-bold text-gray-900">{pendingMaintenances}</div>
            <p className="text-xs text-gray-500 mt-1 truncate">{pendingMaintenances} {t('maintenance.toProcess')}</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 sm:p-6">
            <CardTitle className="text-xs sm:text-sm font-medium text-gray-600 truncate pr-2">
              {t('maintenance.urgentRequests')}
            </CardTitle>
            <div className="p-1.5 sm:p-2 bg-red-100 rounded-lg flex-shrink-0">
              <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4 text-red-600" />
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="text-xl sm:text-2xl font-bold text-gray-900">{urgentMaintenances}</div>
            <p className="text-xs text-gray-500 mt-1 truncate">{urgentMaintenances} {t('maintenance.priorities')}</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 sm:p-6">
            <CardTitle className="text-xs sm:text-sm font-medium text-gray-600 truncate pr-2">
              {t('maintenance.completedRequests')}
            </CardTitle>
            <div className="p-1.5 sm:p-2 bg-green-100 rounded-lg flex-shrink-0">
              <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="text-xl sm:text-2xl font-bold text-gray-900">{completedMaintenances}</div>
            <p className="text-xs text-gray-500 mt-1 truncate">{completedMaintenances} {t('maintenance.completed')}</p>
          </CardContent>
        </Card>
      </div>

      {/* Maintenance List responsive */}
      <Card className="shadow-lg border-0">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b p-4 sm:p-6">
          <CardTitle className="text-lg sm:text-xl text-gray-800">{t('maintenance.maintenanceRequestsList')}</CardTitle>
        </CardHeader>
        <CardContent className="p-3 sm:p-6">
          {ownerMaintenances.length === 0 ? (
            <div className="text-center py-8 sm:py-12 bg-gradient-to-br from-gray-50 to-white rounded-lg border-2 border-dashed border-gray-200">
              <div className="p-3 sm:p-4 bg-gray-100 rounded-full w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 flex items-center justify-center">
                <Wrench className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400" />
              </div>
              <h3 className="text-base sm:text-lg font-medium text-gray-700 mb-2">{t('maintenance.noRequests')}</h3>
              <p className="text-sm text-gray-500 mb-4 px-4">{t('maintenance.noRequestsDescription')}</p>
              <Button 
                className="bg-orange-600 hover:bg-orange-700 text-white"
                onClick={() => setShowMaintenanceForm(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                {t('maintenance.newRequest')}
              </Button>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {ownerMaintenances.map((maintenance) => (
                <div key={maintenance.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 sm:p-6 border rounded-xl hover:shadow-md transition-all duration-200 bg-gradient-to-r from-white to-gray-50 space-y-3 sm:space-y-0">
                  <div className="flex items-start sm:items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
                    <div className="h-10 w-10 sm:h-14 sm:w-14 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Wrench className="h-5 w-5 sm:h-7 sm:w-7 text-orange-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm sm:text-lg font-semibold text-gray-800 truncate">{maintenance.description}</h3>
                      <p className="text-xs sm:text-sm text-gray-600 font-medium truncate">{maintenance.propertyId}</p>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mt-1 space-y-1 sm:space-y-0">
                        <p className="text-xs sm:text-sm text-gray-500 truncate">{t('maintenance.category')}: {maintenance.category}</p>
                        <p className="text-xs sm:text-sm text-gray-500 truncate">
                          {t('maintenance.requestDateLabel')}: {maintenance.createdAt?.toDate?.()?.toLocaleDateString() || 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end sm:text-right space-x-4 sm:space-x-0 sm:flex-col sm:space-y-2">
                    <Badge 
                      variant={
                        maintenance.status === 'Terminé' ? 'default' :
                        maintenance.priority === 'Élevée' ? 'destructive' : 'secondary'
                      }
                      className="text-xs"
                    >
                      {maintenance.status}
                    </Badge>
                    <p className="text-xs sm:text-sm text-gray-500 truncate">
                      {t('maintenance.priority')}: {maintenance.priority}
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
            <DialogTitle>{t('maintenance.newRequest')}</DialogTitle>
          </DialogHeader>
          <MaintenanceRequestForm />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminMaintenanceView;
