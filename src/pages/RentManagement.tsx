
import React from 'react';
import MainLayout from '@/components/Layout/MainLayout';
import RentPaymentForm from '@/components/RentPaymentForm';
import RentMetrics from '@/components/RentManagement/RentMetrics';
import RentPaymentsList from '@/components/RentManagement/RentPaymentsList';
import { useFirebasePayments } from '@/hooks/useFirebasePayments';
import { useToast } from '@/hooks/use-toast';

const RentManagement = () => {
  const { payments, loading, error, updatePayment, deletePayment } = useFirebasePayments();
  const { toast } = useToast();

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
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestion des Loyers</h1>
            <p className="text-gray-600 mt-2">Suivi des paiements mensuels des locataires et colocataires</p>
          </div>
          <RentPaymentForm />
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
