
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, CheckCircle, Calendar, AlertTriangle, FileCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">{t('inspections.title')}</h1>
          <p className="text-gray-600 mt-1">Gérez vos états des lieux et leurs informations</p>
        </div>
        <Button 
          onClick={() => setShowInspectionForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          {t('inspections.addInspection')}
        </Button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total États des Lieux</CardTitle>
            <FileCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalInspections}</div>
            <p className="text-xs text-muted-foreground">
              {totalInspections} états des lieux enregistrés
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">États des Lieux Terminés</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedInspections}</div>
            <p className="text-xs text-muted-foreground">
              {completedInspections} états des lieux terminés
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">États des Lieux Planifiés</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{plannedInspections}</div>
            <p className="text-xs text-muted-foreground">
              {plannedInspections} états des lieux planifiés
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">États des Lieux En Cours</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inProgressInspections}</div>
            <p className="text-xs text-muted-foreground">
              {inProgressInspections} états des lieux en cours
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="text-center py-8 text-gray-500">
        {t('inspections.list')}
      </div>

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
