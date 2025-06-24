
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, ClipboardList, Calendar, AlertTriangle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useOwnerData } from '@/hooks/useOwnerData';

interface AdminInspectionsViewProps {
  currentProfile: any;
}

const AdminInspectionsView: React.FC<AdminInspectionsViewProps> = ({ currentProfile }) => {
  const { t } = useTranslation();
  const { inspections } = useOwnerData(currentProfile);

  const totalInspections = inspections.length;
  const pendingInspections = inspections.filter(i => i.status === 'En attente').length;
  const urgentInspections = inspections.filter(i => i.status === 'Urgent').length;
  const completedInspections = inspections.filter(i => i.status === 'Terminé').length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Inspections</h1>
            <p className="text-gray-600 mt-1">Gérez vos inspections de propriétés</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle inspection
          </Button>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Inspections</CardTitle>
              <ClipboardList className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalInspections}</div>
              <p className="text-xs text-muted-foreground">{totalInspections} inspections enregistrées</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">En Attente</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingInspections}</div>
              <p className="text-xs text-muted-foreground">{pendingInspections} à planifier</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Urgentes</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{urgentInspections}</div>
              <p className="text-xs text-muted-foreground">{urgentInspections} à traiter</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Terminées</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedInspections}</div>
              <p className="text-xs text-muted-foreground">{completedInspections} complétées</p>
            </CardContent>
          </Card>
        </div>

        {/* Inspections List */}
        <Card>
          <CardHeader>
            <CardTitle>Liste des Inspections</CardTitle>
          </CardHeader>
          <CardContent>
            {inspections.length === 0 ? (
              <div className="text-center py-8">
                <ClipboardList className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Aucune inspection trouvée</p>
                <p className="text-sm text-gray-400">Commencez par planifier votre première inspection</p>
              </div>
            ) : (
              <div className="space-y-4">
                {inspections.map((inspection) => (
                  <div key={inspection.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center space-x-4">
                      <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center">
                        <ClipboardList className="h-6 w-6 text-red-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{inspection.property}</h3>
                        <p className="text-sm text-gray-600">{inspection.type}</p>
                        <p className="text-sm text-gray-500">
                          Prévu le {inspection.date}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge 
                        variant={
                          inspection.status === 'Urgent' ? 'destructive' :
                          inspection.status === 'Terminé' ? 'default' : 'secondary'
                        }
                      >
                        {inspection.status}
                      </Badge>
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

export default AdminInspectionsView;
