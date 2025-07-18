
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog } from '@/components/ui/dialog';
import InspectionForm from '@/components/InspectionForm';
import InspectionDetailsModal from '@/components/InspectionDetailsModal';
import { useOwnerQuickActions } from '@/hooks/useOwnerQuickActions';
import { useAuth } from '@/hooks/useAuth';
import { useFormButtonConfig } from '@/hooks/useFormButtonConfig';
import { useOwnerData } from '@/hooks/useOwnerData';
import { useFirebaseInspections } from '@/hooks/useFirebaseInspections';
import AdminInspectionsHeader from './AdminInspections/AdminInspectionsHeader';
import AdminInspectionsMetrics from './AdminInspections/AdminInspectionsMetrics';
import AdminInspectionsTable from './AdminInspections/AdminInspectionsTable';

interface AdminInspectionsViewProps {
  currentProfile?: any;
}

const AdminInspectionsView: React.FC<AdminInspectionsViewProps> = ({ currentProfile }) => {
  const { t } = useTranslation();
  const { userProfile } = useAuth();
  const profile = currentProfile || userProfile;
  const { handleInspectionSubmit } = useOwnerQuickActions(profile);
  const { getButtonConfig } = useFormButtonConfig();
  
  // Utiliser les données filtrées par propriétaire
  const { inspections } = useOwnerData(profile);
  
  const { deleteInspection } = useFirebaseInspections();
  const [showInspectionForm, setShowInspectionForm] = useState(false);
  const [selectedInspection, setSelectedInspection] = useState(null);
  const [showInspectionDetails, setShowInspectionDetails] = useState(false);

  console.log('AdminInspectionsView - Using profile:', profile);
  console.log('AdminInspectionsView - Filtered inspections:', inspections);

  const inspectionButtonConfig = getButtonConfig('inspection');

  // Calculer les métriques basées sur les inspections filtrées
  const totalInspections = inspections?.length || 0;
  const completedInspections = inspections?.filter(i => 
    i.status === t('inspections.completed') || 
    i.status === 'Terminé' || 
    i.status === 'Completed'
  ).length || 0;
  const plannedInspections = inspections?.filter(i => 
    i.status === t('inspections.planned') || 
    i.status === 'Planifié' || 
    i.status === 'Planned'
  ).length || 0;
  const inProgressInspections = inspections?.filter(i => 
    i.status === t('inspections.inProgress') || 
    i.status === 'En cours' || 
    i.status === 'In Progress'
  ).length || 0;

  const handleViewInspection = (inspection: any) => {
    setSelectedInspection(inspection);
    setShowInspectionDetails(true);
  };

  const handleDeleteInspection = async (inspection: any) => {
    try {
      await deleteInspection(inspection.id);
      console.log('Inspection supprimée avec succès:', inspection.title);
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'inspection:', error);
      alert(t('inspections.deleteError'));
    }
  };

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
      <AdminInspectionsHeader onNewInspection={() => setShowInspectionForm(true)} />

      <AdminInspectionsMetrics
        totalInspections={totalInspections}
        completedInspections={completedInspections}
        plannedInspections={plannedInspections}
        inProgressInspections={inProgressInspections}
      />

      <AdminInspectionsTable 
        inspections={inspections || []} 
        onViewInspection={handleViewInspection}
        onDeleteInspection={handleDeleteInspection}
      />

      <Dialog open={showInspectionForm} onOpenChange={setShowInspectionForm}>
        <InspectionForm 
          onClose={() => setShowInspectionForm(false)}
          onSubmit={handleInspectionSubmit}
          buttonConfig={inspectionButtonConfig}
        />
      </Dialog>

      {selectedInspection && (
        <InspectionDetailsModal
          inspection={selectedInspection}
          isOpen={showInspectionDetails}
          onClose={() => {
            setShowInspectionDetails(false);
            setSelectedInspection(null);
          }}
        />
      )}
    </div>
  );
};

export default AdminInspectionsView;
