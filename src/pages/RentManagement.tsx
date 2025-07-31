
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import MainLayout from '@/components/Layout/MainLayout';
import RentPaymentForm from '@/components/RentPaymentForm';
import NewRentMetrics from '@/components/RentManagement/NewRentMetrics';
import NewRentPaymentsList from '@/components/RentManagement/NewRentPaymentsList';
import MonthlyRentFilters from '@/components/RentManagement/MonthlyRentFilters';
import PaidRentsDisplay from '@/components/RentManagement/PaidRentsDisplay';
import { useFirebasePayments } from '@/hooks/useFirebasePayments';
import { useToast } from '@/hooks/use-toast';

const RentManagement = () => {
  const { t } = useTranslation();
  const { payments, loading, error, updatePayment, deletePayment, refetch, generateEmadPayments, cleanEmadDuplicates } = useFirebasePayments();
  const { toast } = useToast();
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 30000);
    return () => clearInterval(interval);
  }, [refetch]);

  const handleMarkAsPaid = async (paymentId: string) => {
    try {
      const payment = payments.find(p => p.id === paymentId);
      const amountToPay = payment?.contractRentAmount || payment?.rentAmount || 0;

      await updatePayment(paymentId, {
        status: 'Payé',
        paymentDate: new Date().toISOString().split('T')[0],
        paymentMethod: 'Virement',
        paidAmount: amountToPay
      });

      toast({
        title: t('common.success'),
        description: "Le paiement a été marqué comme payé.",
      });

      await refetch();
    } catch (err) {
      console.error('Erreur lors de la mise à jour:', err);
      toast({
        title: t('common.error'),
        description: "Erreur lors de la mise à jour du paiement.",
        variant: "destructive",
      });
    }
  };

  const handleDeletePayment = async (paymentId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce paiement ?')) {
      try {
        await deletePayment(paymentId);
        toast({
          title: t('common.success'),
          description: "Le paiement a été supprimé avec succès.",
        });
        await refetch();
      } catch (err) {
        console.error('Erreur lors de la suppression:', err);
        toast({
          title: t('common.error'),
          description: "Erreur lors de la suppression du paiement.",
          variant: "destructive",
        });
      }
    }
  };

  const handleGenerateEmadPayments = async () => {
    if (window.confirm('Voulez-vous nettoyer et régénérer tous les paiements d\'EMAD ADAM depuis le début de son contrat (mars 2025) ?')) {
      try {
        // D'abord nettoyer les doublons
        await cleanEmadDuplicates();
        
        // Puis générer les paiements corrects
        const createdPayments = await generateEmadPayments();
        
        toast({
          title: t('common.success'),
          description: `Paiements nettoyés et ${createdPayments.length} nouveaux paiements générés pour EMAD ADAM.`,
        });
      } catch (err) {
        console.error('Erreur lors de la génération:', err);
        toast({
          title: t('common.error'),
          description: "Erreur lors de la génération des paiements.",
          variant: "destructive",
        });
      }
    }
  };

  const handleCleanEmadPayments = async () => {
    if (window.confirm('Voulez-vous supprimer TOUS les paiements incorrects d\'EMAD ADAM visibles sur la page ?')) {
      try {
        await cleanEmadDuplicates();
        toast({
          title: t('common.success'),
          description: "Tous les paiements incorrects d'EMAD ADAM ont été supprimés.",
        });
      } catch (err) {
        console.error('Erreur lors de la suppression:', err);
        toast({
          title: t('common.error'),
          description: "Erreur lors de la suppression des paiements.",
          variant: "destructive",
        });
      }
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">{t('rentManagement.loading')}</div>
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

  // Filtrer les paiements pour le mois sélectionné
  const currentMonthPayments = payments.filter(payment => {
    const dueDate = new Date(payment.dueDate);
    return dueDate.getMonth() === selectedMonth.getMonth() && 
           dueDate.getFullYear() === selectedMonth.getFullYear();
  });

  // Déterminer si c'est le mois actuel ou un mois futur
  const now = new Date();
  const isCurrentMonth = selectedMonth.getMonth() === now.getMonth() && 
                         selectedMonth.getFullYear() === now.getFullYear();
  const isFutureMonth = selectedMonth > now;

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Paiements Mensuels - {selectedMonth.toLocaleDateString('fr-FR', { 
                month: 'long', 
                year: 'numeric' 
              })}
            </h1>
            <p className="text-base text-gray-600 mt-2">
              Basé sur les Contrats de Bail
            </p>
          </div>
          <div className="flex items-center gap-3">
            <RentPaymentForm />
          </div>
        </div>

        <MonthlyRentFilters 
          selectedMonth={selectedMonth}
          onMonthChange={setSelectedMonth}
        />

        <NewRentMetrics payments={currentMonthPayments} />

        {/* Affichage des loyers payés du mois sélectionné */}
        <PaidRentsDisplay
          payments={payments}
          selectedMonth={selectedMonth}
          title={
            isCurrentMonth 
              ? t('rentManagement.currentMonthRents')
              : t('rentManagement.selectedMonthRents')
          }
        />

        {/* Affichage des loyers payés des mois précédents */}
        <PaidRentsDisplay
          payments={payments}
          selectedMonth={selectedMonth}
          title={t('rentManagement.previousMonthsRents')}
          showPreviousMonths={true}
        />


        <NewRentPaymentsList
          payments={currentMonthPayments}
          onMarkAsPaid={handleMarkAsPaid}
          onDeletePayment={handleDeletePayment}
        />
      </div>
    </MainLayout>
  );
};

export default RentManagement;
