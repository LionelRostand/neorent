
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, PenTool, Calendar, Euro, Download } from 'lucide-react';
import { useAdminTenantAccess } from '@/hooks/useAdminTenantAccess';
import { useFirebaseContracts } from '@/hooks/useFirebaseContracts';

const RentHistory = () => {
  const { getCurrentProfile, getCurrentUserType } = useAdminTenantAccess();
  const { contracts, loading } = useFirebaseContracts();
  const currentProfile = getCurrentProfile();
  const currentUserType = getCurrentUserType();
  const isRoommate = currentUserType === 'colocataire';
  
  // Vérifier si le contrat est signé en utilisant les données Firebase
  const signedContract = contracts.find(contract => 
    contract.status === 'Signé' && 
    contract.tenant === currentProfile?.name
  );
  
  const isContractSigned = !isRoommate || !!signedContract;

  console.log('RentHistory - isRoommate:', isRoommate);
  console.log('RentHistory - signedContract:', signedContract);
  console.log('RentHistory - isContractSigned:', isContractSigned);

  // Show loading state while contracts are being fetched
  if (loading && isRoommate) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-gray-500">Vérification du contrat...</p>
      </div>
    );
  }

  // Show empty state for roommates with unsigned contracts
  if (isRoommate && !isContractSigned) {
    return (
      <div className="space-y-6">
        <Card className="border-2 border-dashed border-gray-300 bg-gray-50">
          <CardContent className="p-8 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                <FileText className="h-8 w-8 text-gray-400" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-gray-600">Historique non disponible</h3>
                <p className="text-gray-500 max-w-md">
                  L'historique des paiements sera disponible après la signature de votre contrat de colocation.
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400 mt-4">
                <PenTool className="h-4 w-4" />
                <span>Contrat en attente de signature</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Mock payment history data for signed contracts or non-roommates
  const mockPayments = [
    {
      id: 1,
      month: 'Janvier 2025',
      dueDate: '2025-01-05',
      paidDate: '2025-01-03',
      amount: signedContract ? parseInt(signedContract.amount.replace(/[€\/mois]/g, '')) : 450,
      status: 'Payé'
    },
    {
      id: 2,
      month: 'Décembre 2024',
      dueDate: '2024-12-05',
      paidDate: '2024-12-04',
      amount: signedContract ? parseInt(signedContract.amount.replace(/[€\/mois]/g, '')) : 450,
      status: 'Payé'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Payé':
        return <Badge className="bg-green-100 text-green-800">✓ Payé</Badge>;
      case 'En attente':
        return <Badge className="bg-yellow-100 text-yellow-800">⏳ En attente</Badge>;
      case 'En retard':
        return <Badge className="bg-red-100 text-red-800">⚠️ En retard</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Historique des paiements
        </h2>
        <p className="text-gray-600">
          Consultez l'historique de vos paiements de loyer.
        </p>
      </div>

      <div className="grid gap-4">
        {mockPayments.map((payment) => (
          <Card key={payment.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  {payment.month}
                </div>
                {getStatusBadge(payment.status)}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                  <span className="font-medium mr-1">Échéance:</span>
                  <span>{new Date(payment.dueDate).toLocaleDateString('fr-FR')}</span>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                  <span className="font-medium mr-1">Payé le:</span>
                  <span>{new Date(payment.paidDate).toLocaleDateString('fr-FR')}</span>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <Euro className="h-4 w-4 mr-2 text-gray-400" />
                  <span className="font-medium mr-1">Montant:</span>
                  <span className="font-semibold text-green-600">{payment.amount}€</span>
                </div>
              </div>

              {payment.status === 'Payé' && (
                <div className="flex justify-end">
                  <button className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700">
                    <Download className="h-4 w-4" />
                    Télécharger le reçu
                  </button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RentHistory;
