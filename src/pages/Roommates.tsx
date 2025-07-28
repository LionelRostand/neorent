import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import MainLayout from '@/components/Layout/MainLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Mail, Phone, Home, UserCheck, CheckCircle, Clock, XCircle, Users, Edit, Trash2 } from 'lucide-react';
import MetricCard from '@/components/MetricCard';
import RoommateForm from '@/components/RoommateForm';
import RoommateDetailsModal from '@/components/RoommateDetailsModal';
import RoommateEditModal from '@/components/RoommateEditModal';
import RentAlert from '@/components/RentAlert';
import { useFirebaseRoommates } from '@/hooks/useFirebaseRoommates';
import { useFirebaseProperties } from '@/hooks/useFirebaseProperties';
import { useToast } from '@/hooks/use-toast';
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';

const Roommates = () => {
  const { t } = useTranslation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedRoommate, setSelectedRoommate] = useState(null);
  const [editingRoommate, setEditingRoommate] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { roommates, loading, error, addRoommate, updateRoommate, deleteRoommate, cleanupDuplicates } = useFirebaseRoommates();
  const { properties } = useFirebaseProperties();
  const { toast } = useToast();
  const { createUserAccount } = useFirebaseAuth();

  const activeCount = roommates.filter(r => r.status === 'Actif').length;
  const inactiveCount = roommates.filter(r => r.status === 'Inactif').length;
  const searchingCount = roommates.filter(r => r.status === 'En recherche').length;
  const totalCount = roommates.length;

  // Calculer les alertes de paiement
  const paymentAlerts = roommates
    .filter(r => r.status === 'Actif')
    .map(r => {
      const expected = Number(r.rentAmount) || 0;
      const paid = r.paidAmount || 0;
      
      // Une alerte n'est nécessaire QUE si un montant a été payé ET qu'il y a une différence
      // Si paidAmount est 0 ou undefined, cela signifie qu'aucun paiement n'a été enregistré
      // et il ne faut pas afficher d'alerte
      const hasRealPaymentIssue = paid > 0 && paid !== expected;
      
      return { 
        roommate: r, 
        expected, 
        paid, 
        hasIssue: hasRealPaymentIssue 
      };
    })
    .filter(alert => alert.hasIssue);

  console.log('🔍 Analyse des alertes de paiement:', roommates
    .filter(r => r.status === 'Actif')
    .map(r => ({
      nom: r.name,
      attendu: r.rentAmount,
      payé: r.paidAmount,
      aUneAlerte: (r.paidAmount || 0) > 0 && (r.paidAmount || 0) !== Number(r.rentAmount || 0)
    }))
  );

  const handleAddRoommate = async (data: any) => {
    try {
      const newRoommate = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        property: data.property,
        roomNumber: data.roomNumber,
        rentAmount: data.rentAmount,
        status: 'Actif',
        primaryTenant: data.primaryTenant,
        moveInDate: data.moveInDate,
        image: data.imageBase64 ? `data:image/jpeg;base64,${data.imageBase64}` : null,
      };

      // Création du compte Auth si mot de passe fourni
      if (data.password && data.password.trim().length >= 6) {
        try {
          const result = await createUserAccount(data.email, data.password);
          if (result.emailAlreadyExists) {
            console.warn('Email déjà utilisé, mais continuation de l\'ajout du colocataire');
          }
        } catch (authError: any) {
          console.warn('Erreur Auth ignorée:', authError);
          // Continuer même si la création du compte échoue
        }
      }

      await addRoommate(newRoommate);
      toast({
        title: t('common.success'),
        description: t('roommates.addSuccessDescription'),
      });
      console.log('Colocataire ajouté à la collection Rent_colocataires:', newRoommate);
    } catch (err) {
      console.error('Erreur lors de l\'ajout du colocataire:', err);
      toast({
        title: t('common.error'),
        description: t('roommates.addError'),
        variant: "destructive",
      });
    }
  };

  const handleUpdateRoommate = async (id: string, updates: any) => {
    try {
      // Remove password from updates for the database
      const { password, ...dbUpdates } = updates;
      
      await updateRoommate(id, dbUpdates);
      toast({
        title: "Succès",
        description: "Le colocataire a été modifié avec succès.",
      });
      console.log('Colocataire modifié dans la collection Rent_colocataires:', { id, updates: dbUpdates });
    } catch (err) {
      console.error('Erreur lors de la modification du colocataire:', err);
      toast({
        title: "Erreur",
        description: "Erreur lors de la modification du colocataire.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteRoommate = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce colocataire ?')) {
      try {
        await deleteRoommate(id);
        toast({
          title: "Succès",
          description: "Le colocataire a été supprimé avec succès.",
        });
        console.log('Colocataire supprimé de la collection Rent_colocataires:', id);
      } catch (err) {
        console.error('Erreur lors de la suppression du colocataire:', err);
        toast({
          title: "Erreur",
          description: "Erreur lors de la suppression du colocataire.",
          variant: "destructive",
        });
      }
    }
  };

  const handleViewDetails = (roommate: any) => {
    setSelectedRoommate(roommate);
    setIsDetailsModalOpen(true);
  };

  const handleEditRoommate = (roommate: any) => {
    setEditingRoommate(roommate);
    setIsEditModalOpen(true);
  };

  const handleCleanupDuplicates = async () => {
    try {
      const deletedCount = await cleanupDuplicates();
      if (deletedCount > 0) {
        toast({
          title: "Nettoyage terminé",
          description: `${deletedCount} doublons supprimés avec succès`,
          variant: "default",
        });
      } else {
        toast({
          title: "Aucun doublon",
          description: "Aucun doublon n'a été trouvé dans la base de données",
          variant: "default",
        });
      }
    } catch (error) {
      console.error('Error cleaning duplicates:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors du nettoyage des doublons",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">{t('roommates.loading')}</p>
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="space-y-6 sm:space-y-8">
          {/* Payment Alerts */}
          {paymentAlerts.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900">🚨 {t('roommates.paymentAlerts')}</h3>
              {paymentAlerts.map(alert => (
                <RentAlert
                  key={alert.roommate.id}
                  expectedAmount={alert.expected}
                  paidAmount={alert.paid}
                  tenantName={alert.roommate.name}
                />
              ))}
            </div>
          )}

          {/* En-tête avec titre et bouton d'ajout */}
          <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{t('roommates.management')}</h1>
                <p className="text-gray-600 mt-2 text-sm sm:text-base">{t('roommates.description')}</p>
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 w-full sm:w-auto">
                    <Plus className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                    <span className="text-sm sm:text-base">{t('roommates.addRoommate')}</span>
                  </Button>
                </DialogTrigger>
                <RoommateForm
                  onClose={() => setIsDialogOpen(false)}
                  onSubmit={handleAddRoommate}
                />
              </Dialog>
            </div>
          </div>

          {/* Métriques responsives */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            <MetricCard
              title={t('roommates.activeRoommates')}
              value={activeCount}
              description={`${activeCount} ${activeCount > 1 ? t('roommates.metrics.activeMultiple') : t('roommates.metrics.active')}`}
              icon={CheckCircle}
              iconBgColor="bg-green-500"
              borderColor="border-l-green-500"
            />
            <MetricCard
              title={t('roommates.searchingRoommates')}
              value={searchingCount}
              description={`${searchingCount} ${searchingCount > 1 ? t('roommates.metrics.searchingMultiple') : t('roommates.metrics.searching')}`}
              icon={Clock}
              iconBgColor="bg-yellow-500"
              borderColor="border-l-yellow-500"
            />
            <MetricCard
              title={t('roommates.inactiveRoommates')}
              value={inactiveCount}
              description={`${inactiveCount} ${inactiveCount > 1 ? t('roommates.metrics.inactiveMultiple') : t('roommates.metrics.inactive')}`}
              icon={XCircle}
              iconBgColor="bg-red-500"
              borderColor="border-l-red-500"
            />
            <MetricCard
              title={t('roommates.totalRoommates')}
              value={totalCount}
              description={`${totalCount} ${totalCount > 1 ? t('roommates.metrics.totalMultiple') : t('roommates.metrics.total')}`}
              icon={Users}
              iconBgColor="bg-blue-500"
              borderColor="border-l-blue-500"
            />
          </div>

          {/* Section Liste des Colocataires */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{t('roommates.roommateList')}</h2>
                <p className="text-gray-600 mt-1 text-sm sm:text-base">{t('roommates.description')}</p>
              </div>
            </div>
            
            <div className="p-3 sm:p-4 lg:p-6">
              {roommates.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-4 text-lg font-medium text-gray-900">{t('roommates.noRoommates')}</h3>
                  <p className="mt-2 text-gray-500">{t('roommates.noRoommatesDescription')}</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-5">
                  {roommates.map((roommate) => (
                    <Card key={roommate.id} className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-500 bg-white">
                      <CardContent className="p-3 sm:p-4">
                        <div className="space-y-3">
                          {/* Header with avatar, name, and actions */}
                          <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-2 min-w-0 flex-1">
                              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
                                {roommate.image ? (
                                  <img 
                                    src={roommate.image} 
                                    alt={roommate.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <UserCheck className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                                )}
                              </div>
                              <div className="min-w-0 flex-1">
                                <h3 className="font-semibold text-sm sm:text-base text-gray-900 truncate">{roommate.name}</h3>
                                <p className="text-xs text-gray-500 truncate">{roommate.property}</p>
                              </div>
                            </div>
                            <div className="flex flex-col items-end space-y-1 ml-2">
                              <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-xs px-2 py-0.5">
                                {roommate.status}
                              </Badge>
                              <div className="flex space-x-1">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleEditRoommate(roommate)}
                                  className="h-6 w-6 p-0 border-gray-200 hover:border-gray-300"
                                >
                                  <Edit className="h-3 w-3" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDeleteRoommate(roommate.id)}
                                  className="h-6 w-6 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 border-gray-200 hover:border-red-300"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                          
                          {/* Contact info */}
                          <div className="space-y-2">
                            <div className="flex items-center text-gray-600 text-xs">
                              <Mail className="mr-2 h-3 w-3 text-blue-500 flex-shrink-0" />
                              <span className="truncate">{roommate.email}</span>
                            </div>
                            <div className="flex items-center text-gray-600 text-xs">
                              <Phone className="mr-2 h-3 w-3 text-green-500 flex-shrink-0" />
                              <span className="truncate">{roommate.phone}</span>
                            </div>
                            <div className="flex items-center text-gray-600 text-xs">
                              <Home className="mr-2 h-3 w-3 text-orange-500 flex-shrink-0" />
                              <span className="truncate">
                                {t('roommates.roomNumber')} {roommate.roomNumber} - <span className="font-medium text-blue-600">{roommate.rentAmount}€/{t('roommates.monthlyRent')}</span>
                              </span>
                            </div>
                            <div className="flex items-center text-gray-600 text-xs">
                              <UserCheck className="mr-2 h-3 w-3 text-purple-500 flex-shrink-0" />
                              <span className="truncate">{t('roommateForm.primaryTenant')}: {roommate.primaryTenant}</span>
                            </div>
                          </div>
                          
                          {/* Action buttons */}
                          <div className="flex flex-col space-y-1.5 pt-2 border-t border-gray-100">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="w-full h-7 text-xs hover:bg-blue-50 hover:border-blue-300"
                              onClick={() => handleViewDetails(roommate)}
                            >
                              {t('roommates.viewDetails')}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>

          <RoommateDetailsModal
            roommate={selectedRoommate}
            isOpen={isDetailsModalOpen}
            onClose={() => setIsDetailsModalOpen(false)}
            onUpdateRoommate={handleUpdateRoommate}
          />

          <RoommateEditModal
            roommate={editingRoommate}
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            onSave={handleUpdateRoommate}
            properties={properties}
          />
        </div>
      </div>
    </MainLayout>
  );
};

export default Roommates;
