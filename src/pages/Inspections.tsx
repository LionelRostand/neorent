
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

  const completedCount = inspections.filter(i => i.status === 'Terminé' || i.status === 'Completed').length;
  const inProgressCount = inspections.filter(i => i.status === 'En cours' || i.status === 'In Progress').length;
  const plannedCount = inspections.filter(i => i.status === 'Planifié' || i.status === 'Planned').length;
  const totalCount = inspections.length;

  const handleSubmit = async (data: any) => {
    try {
      await addInspection(data);
      toast({
        title: t('common.success'),
        description: t('inspections.addSuccess'),
      });
      console.log('État des lieux ajouté à la collection Rent_Inspections:', data);
    } catch (err) {
      console.error('Erreur lors de l\'ajout de l\'état des lieux:', err);
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
      await updateInspection(id, updates);
      toast({
        title: t('common.success'),
        description: t('inspections.updateSuccess'),
      });
      console.log('État des lieux modifié dans la collection Rent_Inspections:', { id, updates });
      setSelectedInspection({ ...selectedInspection, ...updates });
    } catch (err) {
      console.error('Erreur lors de la mise à jour de l\'état des lieux:', err);
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
        console.log('État des lieux supprimé de la collection Rent_Inspections:', id);
      } catch (err) {
        console.error('Erreur lors de la suppression de l\'état des lieux:', err);
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
          <div className="text-lg">{t('inspections.loading')}</div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-red-600">{t('common.error')}: {error}</div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
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
