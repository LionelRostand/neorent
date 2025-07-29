import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { PenTool, FileText } from 'lucide-react';
import { useAdminTenantAccess } from '@/hooks/useAdminTenantAccess';
import { useFirebaseContracts } from '@/hooks/useFirebaseContracts';
import { useFirebasePayments } from '@/hooks/useFirebasePayments';
import { useTenantSpaceData } from '@/hooks/useTenantSpaceData';
import PaymentHistoryCard from './PaymentHistoryCard';

const RentHistory = () => {
  const { getCurrentProfile, getCurrentUserType } = useAdminTenantAccess();
  const { contracts, loading: contractsLoading } = useFirebaseContracts();
  const { payments, loading: paymentsLoading } = useFirebasePayments();
  const { signedContract, mockPropertyData, mockTenantData } = useTenantSpaceData();
  const currentProfile = getCurrentProfile();
  const currentUserType = getCurrentUserType();
  const isRoommate = currentUserType === 'colocataire';

  // Trouver le contrat actuel correspondant au profil
  const activeContract = signedContract;
  
  // Vérifier si le contrat est entièrement signé (locataire ET propriétaire)
  const isContractFullySigned = activeContract && 
    activeContract.signatures?.owner?.signatureDataUrl && 
    activeContract.signatures?.tenant?.signatureDataUrl;
  
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
        <p className="text-gray-500">Chargement de l'historique...</p>
      </div>
    );
  }

  // Show empty state for roommates with unsigned contracts
  if (isRoommate && !isContractFullySigned) {
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

  // Convertir les paiements Firebase au format attendu par PaymentHistoryCard
  const formattedPayments = tenantPayments.map(payment => ({
    id: payment.id || Math.random().toString(),
    date: payment.paymentDate || payment.dueDate,
    amount: payment.paidAmount || payment.rentAmount,
    method: (payment.paymentMethod === 'virement' ? 'bank-transfer' : 
            payment.paymentMethod === 'especes' ? 'cash' : 
            payment.paymentMethod === 'carte' ? 'online' : 'bank-transfer') as 'bank-transfer' | 'cash' | 'online' | 'check',
    reference: payment.notes || '',
    status: (payment.status === 'Payé' ? 'paid' : 
            payment.status === 'En attente de validation' ? 'processing' : 'declared') as 'paid' | 'processing' | 'declared' | 'failed',
    description: `Loyer ${new Date(payment.paymentDate || payment.dueDate).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}`
  }));

  return (
    <div className="space-y-6">
      <PaymentHistoryCard 
        payments={formattedPayments}
        tenantData={mockTenantData}
        propertyData={mockPropertyData}
      />
    </div>
  );
};

export default RentHistory;