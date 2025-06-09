
import React, { useState } from 'react';
import MainLayout from '@/components/Layout/MainLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  User, 
  Home, 
  Calendar,
  DollarSign,
  AlertTriangle,
  Edit,
  Trash2
} from 'lucide-react';
import MetricCard from '@/components/MetricCard';
import RentPaymentForm from '@/components/RentPaymentForm';
import { useFirebasePayments } from '@/hooks/useFirebasePayments';
import { useToast } from '@/hooks/use-toast';

const RentManagement = () => {
  const { payments, loading, error, updatePayment, deletePayment } = useFirebasePayments();
  const { toast } = useToast();

  const paidCount = payments.filter(p => p.status === 'Payé').length;
  const lateCount = payments.filter(p => p.status === 'En retard').length;
  const pendingCount = payments.filter(p => p.status === 'En attente').length;
  const totalAmount = payments.reduce((sum, p) => sum + p.rentAmount, 0);

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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Payé':
        return <Badge className="bg-green-100 text-green-800">Payé</Badge>;
      case 'En retard':
        return <Badge variant="destructive">En retard</Badge>;
      case 'En attente':
        return <Badge className="bg-yellow-100 text-yellow-800">En attente</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Payé':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'En retard':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'En attente':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-600" />;
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

        {/* Métriques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Loyers Payés"
            value={paidCount}
            description={`${paidCount} paiement${paidCount > 1 ? 's' : ''} reçu${paidCount > 1 ? 's' : ''}`}
            icon={CheckCircle}
            iconBgColor="bg-green-500"
            borderColor="border-l-green-500"
          />
          <MetricCard
            title="En Retard"
            value={lateCount}
            description={`${lateCount} paiement${lateCount > 1 ? 's' : ''} en retard`}
            icon={XCircle}
            iconBgColor="bg-red-500"
            borderColor="border-l-red-500"
          />
          <MetricCard
            title="En Attente"
            value={pendingCount}
            description={`${pendingCount} paiement${pendingCount > 1 ? 's' : ''} attendu${pendingCount > 1 ? 's' : ''}`}
            icon={Clock}
            iconBgColor="bg-yellow-500"
            borderColor="border-l-yellow-500"
          />
          <MetricCard
            title="Total Mensuel"
            value={`${totalAmount}€`}
            description="Total des loyers mensuels"
            icon={DollarSign}
            iconBgColor="bg-blue-500"
            borderColor="border-l-blue-500"
          />
        </div>

        {/* Titre Liste */}
        <div className="pt-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Statut des Paiements - Janvier 2024</h2>
        </div>

        {/* Liste des paiements */}
        <div className="grid grid-cols-1 gap-4">
          {payments.map((payment) => (
            <Card key={payment.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      {getStatusIcon(payment.status)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-lg font-semibold text-gray-900">{payment.tenantName}</h3>
                        <Badge variant="outline" className="text-xs">
                          {payment.tenantType}
                        </Badge>
                      </div>
                      <div className="mt-1 space-y-1">
                        <div className="flex items-center text-sm text-gray-600">
                          <Home className="mr-2 h-4 w-4" />
                          {payment.property}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <DollarSign className="mr-2 h-4 w-4" />
                          Loyer: {payment.rentAmount}€
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="mr-2 h-4 w-4" />
                          Échéance: {new Date(payment.dueDate).toLocaleDateString('fr-FR')}
                        </div>
                        {payment.paymentDate && (
                          <div className="flex items-center text-sm text-gray-600">
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Payé le: {new Date(payment.paymentDate).toLocaleDateString('fr-FR')}
                            {payment.paymentMethod && ` (${payment.paymentMethod})`}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleDeletePayment(payment.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    {getStatusBadge(payment.status)}
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">{payment.rentAmount}€</p>
                    </div>
                  </div>
                </div>
                
                {payment.status !== 'Payé' && (
                  <div className="mt-4 pt-4 border-t flex justify-end space-x-2">
                    <Button variant="outline" size="sm">
                      Envoyer rappel
                    </Button>
                    <Button 
                      size="sm" 
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => handleMarkAsPaid(payment.id)}
                    >
                      Marquer comme payé
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default RentManagement;
