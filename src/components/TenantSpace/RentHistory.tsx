
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, PenTool, Calendar, Euro, Download, Receipt } from 'lucide-react';
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

  // Generate payment history from contract signature date to July 2025
  const generatePaymentHistory = () => {
    const contractStartDate = signedContract ? new Date(signedContract.startDate) : new Date('2025-01-06');
    const endDate = new Date('2025-07-31');
    const payments = [];
    
    const rentAmount = signedContract ? parseInt(signedContract.amount.replace(/[€\/mois]/g, '')) : 450;
    const charges = 50;
    
    let currentDate = new Date(contractStartDate);
    let paymentId = 1;
    
    while (currentDate <= endDate) {
      const month = currentDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
      const monthCapitalized = month.charAt(0).toUpperCase() + month.slice(1);
      
      // Due date is the 5th of each month
      const dueDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 5);
      
      // Paid date is usually 1-3 days before due date for past months, null for future months
      let paidDate = null;
      let status = 'En attente';
      
      const now = new Date();
      if (currentDate < now) {
        const paidDay = Math.floor(Math.random() * 3) + 2; // 2-4 days before due date
        paidDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), paidDay);
        status = 'Payé';
      } else if (currentDate.getMonth() === now.getMonth() && currentDate.getFullYear() === now.getFullYear()) {
        // Current month - 50% chance it's paid
        if (Math.random() > 0.5) {
          paidDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 3);
          status = 'Payé';
        }
      }
      
      payments.push({
        id: paymentId++,
        month: monthCapitalized,
        dueDate: dueDate.toISOString().split('T')[0],
        paidDate: paidDate ? paidDate.toISOString().split('T')[0] : null,
        amount: rentAmount,
        charges: charges,
        totalAmount: rentAmount + charges,
        status: status
      });
      
      // Move to next month
      currentDate.setMonth(currentDate.getMonth() + 1);
    }
    
    return payments.reverse(); // Most recent first
  };

  const paymentHistory = generatePaymentHistory();

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
    // Simuler le téléchargement d'une quittance
    console.log('Téléchargement de la quittance pour:', payment.month);
    
    // Créer un blob avec du contenu de quittance simulé
    const receiptContent = `
QUITTANCE DE LOYER

Mois: ${payment.month}
Locataire: ${currentProfile?.name}
Montant du loyer: ${payment.amount}€
Charges: ${payment.charges}€
Total payé: ${payment.totalAmount}€
Date de paiement: ${payment.paidDate ? new Date(payment.paidDate).toLocaleDateString('fr-FR') : 'Non payé'}

Cette quittance fait foi du paiement du loyer pour la période concernée.
    `;
    
    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `quittance-${payment.month.toLowerCase().replace(' ', '-')}.txt`;
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
          Historique depuis la signature du contrat ({signedContract ? new Date(signedContract.startDate).toLocaleDateString('fr-FR') : '06/01/2025'}) jusqu'en juillet 2025.
        </p>
      </div>

      <div className="grid gap-4">
        {paymentHistory.map((payment) => (
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
                
                {payment.paidDate && (
                  <div className="flex items-center text-gray-600">
                    <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                    <span className="font-medium mr-1">Payé le:</span>
                    <span>{new Date(payment.paidDate).toLocaleDateString('fr-FR')}</span>
                  </div>
                )}
                
                <div className="flex items-center text-gray-600">
                  <Euro className="h-4 w-4 mr-2 text-gray-400" />
                  <span className="font-medium mr-1">Total:</span>
                  <span className="font-semibold text-green-600">{payment.totalAmount}€</span>
                  <span className="text-xs text-gray-500 ml-1">({payment.amount}€ + {payment.charges}€)</span>
                </div>
              </div>

              {payment.status === 'Payé' && (
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
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RentHistory;
