
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog } from '@/components/ui/dialog';
import InspectionForm from '@/components/InspectionForm';
import InspectionDetailsModal from '@/components/InspectionDetailsModal';
import { useOwnerQuickActions } from '@/hooks/useOwnerQuickActions';
import { useAuth } from '@/hooks/useAuth';
import { useFormButtonConfig } from '@/hooks/useFormButtonConfig';
import { useOwnerData } from '@/hooks/useOwnerData';
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
  const { inspections } = useOwnerData(profile);
  const [showInspectionForm, setShowInspectionForm] = useState(false);
  const [selectedInspection, setSelectedInspection] = useState(null);
  const [showInspectionDetails, setShowInspectionDetails] = useState(false);

  const inspectionButtonConfig = getButtonConfig('inspection');

  const totalInspections = inspections?.length || 0;
  const completedInspections = inspections?.filter(i => i.status === t('inspections.completed')).length || 0;
  const plannedInspections = inspections?.filter(i => i.status === t('inspections.planned')).length || 0;
  const inProgressInspections = inspections?.filter(i => i.status === t('inspections.inProgress')).length || 0;

  const handleViewInspection = (inspection: any) => {
    setSelectedInspection(inspection);
    setShowInspectionDetails(true);
  };

  return (
    <div className="p-6 space-y-6">
      <AdminInspectionsHeader onNewInspection={() => setShowInspectionForm(true)} />

      <AdminInspectionsMetrics
        totalInspections={totalInspections}
        completedInspections={completedInspections}
        plannedInspections={plannedInspections}
        inProgressInspections={inProgressInspections}
      />

      <AdminInspectionsTable 
        inspections={inspections} 
        onViewInspection={handleViewInspection}
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
