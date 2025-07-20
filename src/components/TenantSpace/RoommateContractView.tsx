
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, Eye, CheckCircle, PenTool } from 'lucide-react';
import RoommateContractTemplate from '@/components/Contracts/RoommateContractTemplate';
import { useAdminTenantAccess } from '@/hooks/useAdminTenantAccess';
import { useFirebaseContracts } from '@/hooks/useFirebaseContracts';
import { generateContractPDF } from '@/services/contractPdfService';
import { useToast } from '@/hooks/use-toast';
import { useTenantSpaceData } from '@/hooks/useTenantSpaceData';

const RoommateContractView = () => {
  const { getCurrentProfile, getCurrentUserType } = useAdminTenantAccess();
  const { contracts, loading } = useFirebaseContracts();
  const { signedContract } = useTenantSpaceData();
  const currentProfile = getCurrentProfile();
  const currentUserType = getCurrentUserType();
  const { toast } = useToast();

  console.log('RoommateContractView - currentProfile:', currentProfile);
  console.log('RoommateContractView - currentUserType:', currentUserType);
  console.log('RoommateContractView - contracts:', contracts);
  console.log('RoommateContractView - signedContract from useTenantSpaceData:', signedContract);

  // Vérifier que c'est bien un colocataire
  if (currentUserType !== 'colocataire' && currentUserType !== 'admin' && !currentProfile) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-gray-600">Contrat non disponible</p>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-gray-500">Chargement du contrat...</p>
      </div>
    );
  }

  // Utiliser le contrat signé de useTenantSpaceData qui inclut le mock pour Emad ADAM
  const activeContract = signedContract;

  console.log('RoommateContractView - activeContract (final):', activeContract);

  // Afficher l'état vide si pas de contrat signé
  if (!activeContract) {
    return (
      <div className="space-y-6">
        <Card className="border-2 border-dashed border-gray-300 bg-gray-50">
          <CardContent className="p-8 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                <FileText className="h-8 w-8 text-gray-400" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-gray-600">Contrat en attente de signature</h3>
                <p className="text-gray-500 max-w-md">
                  Votre contrat de colocation sera disponible ici une fois qu'il aura été signé par toutes les parties.
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400 mt-4">
                <PenTool className="h-4 w-4" />
                <span>En attente de signature</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Extraire les données du contrat signé
  const roommateData = {
    name: currentProfile?.name || activeContract.tenant,
    email: currentProfile?.email || 'Email non disponible',
    phone: currentProfile?.phone || 'Téléphone non disponible',
    property: activeContract.property,
    roomNumber: currentProfile?.roomNumber || 'Chambre 1',
    rentAmount: typeof activeContract.amount === 'string' ? 
      activeContract.amount.replace(/[€\/mois]/g, '') : 
      String(activeContract.amount),
    moveInDate: activeContract.startDate,
    primaryTenant: currentProfile?.primaryTenant || 'Locataire principal'
  };

  const propertyData = {
    address: activeContract.property,
    type: 'Colocation',
    surface: '15m² (chambre)',
    furnished: true
  };

  const handleDownloadContract = () => {
    try {
      generateContractPDF(activeContract);
      
      toast({
        title: "Contrat téléchargé",
        description: "Votre contrat de colocation a été téléchargé en PDF.",
      });
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors du téléchargement du contrat.",
        variant: "destructive",
      });
    }
  };

  const handlePrintContract = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* En-tête avec actions */}
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              Mon Contrat de Colocation
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handlePrintContract}>
                <Eye className="h-4 w-4 mr-2" />
                Imprimer
              </Button>
              <Button 
                size="sm" 
                onClick={handleDownloadContract}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Download className="h-4 w-4 mr-2" />
                Télécharger PDF
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-600">Chambre:</span>
              <p className="text-gray-900">{roommateData.roomNumber}</p>
            </div>
            <div>
              <span className="font-medium text-gray-600">Loyer mensuel:</span>
              <p className="text-gray-900 font-semibold text-blue-600">{roommateData.rentAmount}€</p>
            </div>
            <div>
              <span className="font-medium text-gray-600">Date d'entrée:</span>
              <p className="text-gray-900">{new Date(roommateData.moveInDate).toLocaleDateString('fr-FR')}</p>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center gap-2 text-green-800">
              <CheckCircle className="h-4 w-4" />
              <span className="font-medium">Contrat signé le {activeContract.signedDate ? new Date(activeContract.signedDate).toLocaleDateString('fr-FR') : new Date().toLocaleDateString('fr-FR')}</span>
            </div>
            <p className="text-sm text-green-700 mt-1">
              Votre contrat de colocation a été signé par toutes les parties.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Contrat complet avec signatures */}
      <div className="bg-white rounded-lg shadow-sm border print:shadow-none print:border-none">
        <RoommateContractTemplate 
          roommateData={roommateData}
          propertyData={propertyData}
          signatures={activeContract.signatures}
        />
      </div>

      {/* Informations importantes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Informations importantes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="font-medium text-blue-900 mb-1">💳 Paiement du loyer</p>
            <p className="text-blue-800">Le loyer de {roommateData.rentAmount}€ est à payer avant le 5 de chaque mois.</p>
          </div>
          <div className="p-3 bg-green-50 rounded-lg border border-green-200">
            <p className="font-medium text-green-900 mb-1">📅 Préavis de départ</p>
            <p className="text-green-800">Un préavis d'un mois est requis pour résilier le contrat.</p>
          </div>
          <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
            <p className="font-medium text-amber-900 mb-1">🛡️ Assurance obligatoire</p>
            <p className="text-amber-800">Une assurance multirisque habitation doit être souscrite et maintenue.</p>
          </div>
          <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
            <p className="font-medium text-purple-900 mb-1">📋 Règlement intérieur</p>
            <p className="text-purple-800">Respecter les règles de vie commune et maintenir la propreté des espaces partagés.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RoommateContractView;
