
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, CheckCircle, Calendar, AlertTriangle, FileCheck, Edit, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog } from '@/components/ui/dialog';
import InspectionForm from '@/components/InspectionForm';
import { useOwnerQuickActions } from '@/hooks/useOwnerQuickActions';
import { useAuth } from '@/hooks/useAuth';
import { useFormButtonConfig } from '@/hooks/useFormButtonConfig';
import { useOwnerData } from '@/hooks/useOwnerData';

interface AdminInspectionsViewProps {
  currentProfile?: any;
}

const AdminInspectionsView: React.FC<AdminInspectionsViewProps> = ({ currentProfile }) => {
  const { t } = useTranslation();
  const { userProfile } = useAuth();
  const profile = currentProfile || userProfile;
  const { handleInspectionSubmit } = useOwnerQuickActions(profile);
  const { getButtonConfig } = useFormButtonConfig();
  const { inspections } = useOwnerData(profile);
  const [showInspectionForm, setShowInspectionForm] = useState(false);

  const inspectionButtonConfig = getButtonConfig('inspection');

  const totalInspections = inspections?.length || 0;
  const completedInspections = inspections?.filter(i => i.status === 'Terminé').length || 0;
  const plannedInspections = inspections?.filter(i => i.status === 'Planifié').length || 0;
  const inProgressInspections = inspections?.filter(i => i.status === 'En cours').length || 0;

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Terminé':
        return 'default';
      case 'En cours':
        return 'secondary';
      case 'Planifié':
        return 'outline';
      default:
        return 'outline';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header harmonisé avec la sidebar */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">États des Lieux</h1>
            <p className="text-indigo-100 mt-2">Gérez vos états des lieux et leurs informations</p>
          </div>
          <Button 
            onClick={() => setShowInspectionForm(true)}
            className="bg-white text-indigo-600 hover:bg-indigo-50 border-0 shadow-md"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouvel état des lieux
          </Button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-indigo-500 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total États des Lieux</CardTitle>
            <div className="p-2 bg-indigo-100 rounded-lg">
              <FileCheck className="h-4 w-4 text-indigo-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{totalInspections}</div>
            <p className="text-xs text-gray-500 mt-1">{totalInspections} états des lieux enregistrés</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">États des Lieux Terminés</CardTitle>
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{completedInspections}</div>
            <p className="text-xs text-gray-500 mt-1">{completedInspections} états des lieux terminés</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">États des Lieux Planifiés</CardTitle>
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{plannedInspections}</div>
            <p className="text-xs text-gray-500 mt-1">{plannedInspections} états des lieux planifiés</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">États des Lieux En Cours</CardTitle>
            <div className="p-2 bg-orange-100 rounded-lg">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{inProgressInspections}</div>
            <p className="text-xs text-gray-500 mt-1">{inProgressInspections} états des lieux en cours</p>
          </CardContent>
        </Card>
      </div>

      {/* Inspections Table */}
      <Card className="shadow-lg border-0">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b">
          <CardTitle className="text-xl text-gray-800">Liste des États des Lieux</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {inspections && inspections.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Titre</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Propriété</TableHead>
                  <TableHead>Locataire</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Inspecteur</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inspections.map((inspection) => (
                  <TableRow key={inspection.id}>
                    <TableCell className="font-medium">{inspection.title}</TableCell>
                    <TableCell>{inspection.type}</TableCell>
                    <TableCell>{inspection.property}</TableCell>
                    <TableCell>{inspection.tenant}</TableCell>
                    <TableCell>{new Date(inspection.date).toLocaleDateString()}</TableCell>
                    <TableCell>{inspection.inspector}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(inspection.status)}>
                        {inspection.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-white rounded-lg border-2 border-dashed border-gray-200">
              <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <FileCheck className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">Aucun état des lieux</h3>
              <p className="text-gray-500 mb-4">Commencez par créer votre premier état des lieux</p>
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Créer un état des lieux
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showInspectionForm} onOpenChange={setShowInspectionForm}>
        <InspectionForm 
          onClose={() => setShowInspectionForm(false)}
          onSubmit={handleInspectionSubmit}
          buttonConfig={inspectionButtonConfig}
        />
      </Dialog>
    </div>
  );
};

export default AdminInspectionsView;
