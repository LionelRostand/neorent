
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import MainLayout from '@/components/Layout/MainLayout';
import InspectionsHeader from '@/components/Inspections/InspectionsHeader';
import InspectionsMetrics from '@/components/Inspections/InspectionsMetrics';
import InspectionsList from '@/components/Inspections/InspectionsList';
import InspectionDetailsModal from '@/components/InspectionDetailsModal';
import InspectionEditModal from '@/components/InspectionEditModal';
import { useFirebaseInspections } from '@/hooks/useFirebaseInspections';
import { useToast } from '@/hooks/use-toast';

const Inspections = () => {
  const { t } = useTranslation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { inspections, loading, error, addInspection, updateInspection, deleteInspection } = useFirebaseInspections();
  const [selectedInspection, setSelectedInspection] = useState(null);
  const [editingInspection, setEditingInspection] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { toast } = useToast();

  const completedCount = inspections.filter(i => i.status === t('inspections.completed')).length;
  const inProgressCount = inspections.filter(i => i.status === t('inspections.inProgress')).length;
  const plannedCount = inspections.filter(i => i.status === t('inspections.planned')).length;
  const totalCount = inspections.length;

  const handleSubmit = async (data: any) => {
    try {
      await addInspection(data);
      toast({
        title: t('common.success'),
        description: t('inspections.addSuccess'),
      });
      console.log('Inspection added to Rent_Inspections collection:', data);
    } catch (err) {
      console.error('Error adding inspection:', err);
      toast({
        title: t('common.error'),
        description: t('inspections.addError'),
        variant: "destructive",
      });
    }
  };

  const handleViewDetails = (inspection: any) => {
    setSelectedInspection(inspection);
    setIsDetailsModalOpen(true);
  };

  const handleEditInspection = (inspection: any) => {
    setEditingInspection(inspection);
    setIsEditModalOpen(true);
  };

  const handleUpdateInspection = async (id: string, updates: any) => {
    try {
      // Try to update directly in Firebase without local state validation
      // The Firebase hook will handle existence validation
      await updateInspection(id, updates);
      toast({
        title: t('common.success'),
        description: t('inspections.updateSuccess'),
      });
      console.log('Inspection updated in Rent_Inspections collection:', { id, updates });
      setSelectedInspection({ ...selectedInspection, ...updates });
    } catch (err) {
      console.error('Error updating inspection:', err);
      toast({
        title: t('common.error'),
        description: t('inspections.updateError'),
        variant: "destructive",
      });
    }
  };

  const handleUpdateInspectionFromDetails = async (inspection: any) => {
    if (inspection && inspection.id) {
      const { id, ...updates } = inspection;
      await handleUpdateInspection(id, updates);
    }
  };

  const handleDeleteInspection = async (id: string) => {
    if (window.confirm(t('inspections.confirmDelete'))) {
      try {
        await deleteInspection(id);
        toast({
          title: t('common.success'),
          description: t('inspections.deleteSuccess'),
        });
        console.log('Inspection deleted from Rent_Inspections collection:', id);
      } catch (err) {
        console.error('Error deleting inspection:', err);
        toast({
          title: t('common.error'),
          description: t('inspections.deleteError'),
          variant: "destructive",
        });
      }
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-base sm:text-lg">{t('inspections.loading')}</div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-base sm:text-lg text-red-600 text-center px-4">{t('common.error')}: {error}</div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-4 sm:space-y-6 p-4 sm:p-0">
        <InspectionsHeader
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
          onAddInspection={handleSubmit}
        />

        <InspectionsMetrics
          completedCount={completedCount}
          inProgressCount={inProgressCount}
          plannedCount={plannedCount}
          totalCount={totalCount}
        />

        <InspectionsList
          inspections={inspections}
          onViewDetails={handleViewDetails}
          onEditInspection={handleEditInspection}
          onDeleteInspection={handleDeleteInspection}
        />

        <InspectionDetailsModal
          inspection={selectedInspection}
          isOpen={isDetailsModalOpen}
          onClose={() => {
            setIsDetailsModalOpen(false);
            setSelectedInspection(null);
          }}
          onUpdate={handleUpdateInspectionFromDetails}
        />

        <InspectionEditModal
          inspection={editingInspection}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleUpdateInspection}
        />
      </div>
    </MainLayout>
  );
};

export default Inspections;
