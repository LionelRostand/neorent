
import React, { useEffect } from 'react';
import MainLayout from '@/components/Layout/MainLayout';
import RentPaymentForm from '@/components/RentPaymentForm';
import RentMetrics from '@/components/RentManagement/RentMetrics';
import RentPaymentsList from '@/components/RentManagement/RentPaymentsList';
import { useFirebasePayments } from '@/hooks/useFirebasePayments';
import { useToast } from '@/hooks/use-toast';

const RentManagement = () => {
  const { payments, loading, error, updatePayment, deletePayment, refetch } = useFirebasePayments();
  const { toast } = useToast();

  // Auto-refresh data every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 30000);

    return () => clearInterval(interval);
  }, [refetch]);

  const handleMarkAsPaid = async (paymentId: string) => {
    try {
      await updatePayment(paymentId, {
        status: 'Payé',
        paymentDate: new Date().toISOString().split('T')[0],
        paymentMethod: 'Virement'
      });
      toast({
        title: "Succès",
        description: "Le paiement a été marqué comme payé.",
      });
      console.log('Paiement marqué comme payé dans Rent_Payments:', paymentId);
      // Refresh data after update
      await refetch();
    } catch (err) {
      console.error('Erreur lors de la mise à jour du paiement:', err);
      toast({
        title: "Erreur",
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
          title: "Succès",
          description: "Le paiement a été supprimé avec succès.",
        });
        console.log('Paiement supprimé de Rent_Payments:', paymentId);
        // Refresh data after deletion
        await refetch();
      } catch (err) {
        console.error('Erreur lors de la suppression du paiement:', err);
        toast({
          title: "Erreur",
          description: "Erreur lors de la suppression du paiement.",
          variant: "destructive",
        });
      }
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Chargement des paiements...</div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-red-600">Erreur: {error}</div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Gestion des Loyers</h1>
            <p className="text-sm sm:text-base text-gray-600 mt-2">Suivi des paiements mensuels des locataires et colocataires</p>
          </div>
          <div className="flex-shrink-0">
            <RentPaymentForm />
          </div>
        </div>

        <RentMetrics payments={payments} />

        <RentPaymentsList
          payments={payments}
          onMarkAsPaid={handleMarkAsPaid}
          onDeletePayment={handleDeletePayment}
        />
      </div>
    </MainLayout>
  );
};

export default RentManagement;
