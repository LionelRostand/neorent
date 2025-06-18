
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import MainLayout from '@/components/Layout/MainLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Plus, ClipboardList, Calendar, User, Building2, CheckCircle, Clock, XCircle, FileCheck, Edit, Trash2 } from 'lucide-react';
import MetricCard from '@/components/MetricCard';
import InspectionForm from '@/components/InspectionForm';
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
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t('inspections.title')}</h1>
            <p className="text-gray-600 mt-2">{t('inspections.subtitle')}</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="mr-2 h-4 w-4" />
                {t('inspections.addInspection')}
              </Button>
            </DialogTrigger>
            <InspectionForm
              onClose={() => setIsDialogOpen(false)}
              onSubmit={handleSubmit}
            />
          </Dialog>
        </div>

        {/* Métriques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title={t('inspections.completed')}
            value={completedCount}
            description={t('inspections.completedInspections')}
            icon={CheckCircle}
            iconBgColor="bg-green-500"
            borderColor="border-l-green-500"
          />
          <MetricCard
            title={t('inspections.inProgress')}
            value={inProgressCount}
            description={t('inspections.inProgressInspections')}
            icon={Clock}
            iconBgColor="bg-yellow-500"
            borderColor="border-l-yellow-500"
          />
          <MetricCard
            title={t('inspections.planned')}
            value={plannedCount}
            description={t('inspections.plannedInspections')}
            icon={XCircle}
            iconBgColor="bg-red-500"
            borderColor="border-l-red-500"
          />
          <MetricCard
            title={t('common.total')}
            value={totalCount}
            description={t('inspections.totalInspections')}
            icon={FileCheck}
            iconBgColor="bg-blue-500"
            borderColor="border-l-blue-500"
          />
        </div>

        {/* Titre Liste */}
        <div className="pt-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('inspections.listTitle')}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {inspections.map((inspection) => (
            <Card key={inspection.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900">{inspection.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{inspection.type}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge 
                        variant={inspection.status === 'Terminé' || inspection.status === 'Completed' ? 'default' : 
                               inspection.status === 'En cours' || inspection.status === 'In Progress' ? 'secondary' : 'outline'}
                        className={
                          inspection.status === 'Terminé' || inspection.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                          inspection.status === 'En cours' || inspection.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-blue-100 text-blue-800'
                        }
                      >
                        {inspection.status}
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditInspection(inspection)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteInspection(inspection.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-600 text-sm">
                      <User className="mr-2 h-4 w-4" />
                      {inspection.tenant}
                    </div>
                    <div className="flex items-center text-gray-600 text-sm">
                      <Building2 className="mr-2 h-4 w-4" />
                      {inspection.property}
                    </div>
                    <div className="flex items-center text-gray-600 text-sm">
                      <Calendar className="mr-2 h-4 w-4" />
                      {new Date(inspection.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center text-gray-600 text-sm">
                      <ClipboardList className="mr-2 h-4 w-4" />
                      {t('inspections.inspector')}: {inspection.inspector}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 pt-4 border-t">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleViewDetails(inspection)}
                    >
                      {t('inspections.viewDetails')}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleEditInspection(inspection)}
                    >
                      {t('inspections.editInspection')}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

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
