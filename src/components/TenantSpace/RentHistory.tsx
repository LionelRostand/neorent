
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, PenTool, Calendar, Euro, Download, Receipt } from 'lucide-react';
import { useAdminTenantAccess } from '@/hooks/useAdminTenantAccess';
import { useFirebaseContracts } from '@/hooks/useFirebaseContracts';
import { useFirebasePayments } from '@/hooks/useFirebasePayments';
import { useTenantSpaceData } from '@/hooks/useTenantSpaceData';

const RentHistory = () => {
  const { getCurrentProfile, getCurrentUserType } = useAdminTenantAccess();
  const { contracts, loading: contractsLoading } = useFirebaseContracts();
  const { payments, loading: paymentsLoading } = useFirebasePayments();
  const { signedContract } = useTenantSpaceData();
  const currentProfile = getCurrentProfile();
  const currentUserType = getCurrentUserType();
  const isRoommate = currentUserType === 'colocataire';
  
  // Utiliser le contrat signé depuis useTenantSpaceData
  const activeContract = signedContract;
  
  // Vérifier que le contrat existe et qu'il est signé par les deux parties
  const isContractFullySigned = activeContract && 
    activeContract.signatures && 
    typeof activeContract.signatures === 'object' &&
    'owner' in activeContract.signatures &&
    'tenant' in activeContract.signatures &&
    activeContract.signatures.owner?.signatureDataUrl && 
    activeContract.signatures.tenant?.signatureDataUrl;
  
  const shouldShowHistory = !isRoommate || isContractFullySigned;

  // Filtrer les paiements pour ce locataire/colocataire
  const tenantPayments = payments.filter(payment => 
    payment.tenantName === currentProfile?.name && 
    payment.status === 'Payé'
  );

  console.log('RentHistory - isRoommate:', isRoommate);
  console.log('RentHistory - activeContract:', activeContract);
  console.log('RentHistory - isContractFullySigned:', isContractFullySigned);
  console.log('RentHistory - shouldShowHistory:', shouldShowHistory);
  console.log('RentHistory - tenantPayments:', tenantPayments);

  // Show loading state while data is being fetched
  if ((contractsLoading || paymentsLoading) && isRoommate) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-gray-500">Chargement de l'historique des paiements...</p>
      </div>
    );
  }

  // Show empty state for roommates with contracts not fully signed
  if (isRoommate && !shouldShowHistory) {
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
                  L'historique des paiements sera disponible après la signature complète de votre contrat de colocation par les deux parties.
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400 mt-4">
                <PenTool className="h-4 w-4" />
                <span>Contrat en attente de signature complète</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Si aucun paiement réel n'existe
  if (shouldShowHistory && tenantPayments.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Historique des paiements
          </h2>
          <p className="text-gray-600">
            Aucun paiement enregistré pour le moment.
          </p>
        </div>
        
        <Card className="border-2 border-dashed border-gray-300 bg-gray-50">
          <CardContent className="p-8 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                <Euro className="h-8 w-8 text-gray-400" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-gray-600">Aucun paiement trouvé</h3>
                <p className="text-gray-500 max-w-md">
                  Les paiements apparaîtront ici une fois qu'ils auront été enregistrés dans le système.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

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

  const handleDownloadReceipt = (payment: any) => {
    console.log('Téléchargement de la quittance pour:', payment.tenantName, payment.month);
    
    // Créer un blob avec du contenu de quittance réel
    const receiptContent = `
QUITTANCE DE LOYER

Mois: ${payment.paymentDate ? new Date(payment.paymentDate).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }) : 'Non spécifié'}
Locataire: ${payment.tenantName}
Montant du loyer: ${payment.rentAmount}€
Total payé: ${payment.paidAmount || payment.rentAmount}€
Date de paiement: ${payment.paymentDate ? new Date(payment.paymentDate).toLocaleDateString('fr-FR') : 'Non spécifié'}

Cette quittance fait foi du paiement du loyer pour la période concernée.
    `;
    
    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `quittance-${payment.tenantName?.replace(/\s+/g, '-')}-${payment.paymentDate ? new Date(payment.paymentDate).toISOString().slice(0, 7) : 'paiement'}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Historique des paiements
        </h2>
        <p className="text-gray-600">
          Historique des paiements réellement effectués ({tenantPayments.length} paiement{tenantPayments.length > 1 ? 's' : ''}).
        </p>
      </div>

      <div className="grid gap-4">
        {tenantPayments.map((payment, index) => {
          const paymentMonth = payment.paymentDate ? 
            new Date(payment.paymentDate).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }) : 
            'Non spécifié';
          const paymentMonthCapitalized = paymentMonth.charAt(0).toUpperCase() + paymentMonth.slice(1);
          
          return (
          <Card key={payment.id || index}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  {paymentMonthCapitalized}
                </div>
                {getStatusBadge(payment.status)}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                  <span className="font-medium mr-1">Payé le:</span>
                  <span>{payment.paymentDate ? new Date(payment.paymentDate).toLocaleDateString('fr-FR') : 'Non spécifié'}</span>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <Euro className="h-4 w-4 mr-2 text-gray-400" />
                  <span className="font-medium mr-1">Loyer:</span>
                  <span>{payment.rentAmount}€</span>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <Euro className="h-4 w-4 mr-2 text-gray-400" />
                  <span className="font-medium mr-1">Total:</span>
                  <span className="font-semibold text-green-600">{payment.paidAmount || payment.rentAmount}€</span>
                  <span className="text-xs text-gray-500 ml-1">({payment.rentAmount}€ + charges)</span>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleDownloadReceipt(payment)}
                  className="flex items-center gap-2"
                >
                  <Receipt className="h-4 w-4" />
                  Quittance de loyer
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleDownloadReceipt(payment)}
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Télécharger
                </Button>
              </div>
            </CardContent>
          </Card>
          );
        })}
      </div>
    </div>
  );
};

export default RentHistory;
