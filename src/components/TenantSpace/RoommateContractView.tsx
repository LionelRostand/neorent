
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, CheckCircle, Calendar, Euro, User, Building2, Download, Eye } from 'lucide-react';
import { useAdminTenantAccess } from '@/hooks/useAdminTenantAccess';
import { useFirebaseContracts } from '@/hooks/useFirebaseContracts';
import { generateContractPDF } from '@/services/contractPdfService';
import { useToast } from '@/hooks/use-toast';
import { useTenantSpaceData } from '@/hooks/useTenantSpaceData';
import RoommateContractTemplate from '../Contracts/RoommateContractTemplate';

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
      <div className="text-center py-8">
        <p className="text-gray-500">Cette section est réservée aux colocataires.</p>
      </div>
    );
  }

  // Afficher l'état de chargement
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
                  Votre contrat de colocation n'a pas encore été signé. Une fois signé, vous pourrez le consulter ici.
                </p>
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
      // Créer un objet compatible avec ContractData
      const contractForPDF = {
        ...activeContract,
        title: activeContract.title || 'Contrat de Colocation',
        type: activeContract.type || 'Colocation',
        jurisdiction: activeContract.jurisdiction || 'Paris',
        provider: activeContract.provider || 'Gestionnaire'
      };
      
      generateContractPDF(contractForPDF);
      
      toast({
        title: "Contrat téléchargé",
        description: "Votre contrat a été téléchargé en PDF.",
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

  return (
    <div className="space-y-6">
      {/* En-tête avec informations du contrat */}
      <Card className="border-l-4 border-l-green-500">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-green-600" />
              Contrat de Colocation
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <Badge className="bg-green-100 text-green-800">
              Signé
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center text-gray-600">
              <User className="h-4 w-4 mr-2 text-gray-400" />
              <span className="font-medium mr-1">Colocataire:</span>
              <span>{roommateData.name}</span>
            </div>
            
            <div className="flex items-center text-gray-600">
              <Building2 className="h-4 w-4 mr-2 text-gray-400" />
              <span className="font-medium mr-1">Propriété:</span>
              <span>{activeContract.property}</span>
            </div>
            
            <div className="flex items-center text-gray-600">
              <Euro className="h-4 w-4 mr-2 text-gray-400" />
              <span className="font-medium mr-1">Loyer:</span>
              <span className="font-semibold text-green-600">{roommateData.rentAmount}€/mois</span>
            </div>
            
            <div className="flex items-center text-gray-600">
              <Calendar className="h-4 w-4 mr-2 text-gray-400" />
              <span className="font-medium mr-1">Entrée:</span>
              <span>{new Date(activeContract.startDate).toLocaleDateString('fr-FR')}</span>
            </div>
          </div>

          {/* Status de signature */}
          <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center gap-2 text-green-800">
              <CheckCircle className="h-4 w-4" />
              <span className="font-medium">Contrat signé le {new Date().toLocaleDateString('fr-FR')}</span>
            </div>
            <p className="text-sm text-green-700 mt-1">
              Votre contrat de colocation a été signé par toutes les parties.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4 border-t">
            <Button variant="outline" size="sm" onClick={() => window.print()}>
              <Eye className="h-4 w-4 mr-2" />
              Imprimer
            </Button>
            <Button size="sm" onClick={handleDownloadContract} className="bg-green-600 hover:bg-green-700">
              <Download className="h-4 w-4 mr-2" />
              Télécharger PDF
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Template du contrat pour impression */}
      <div className="print:block hidden">
        <RoommateContractTemplate 
          roommateData={roommateData}
          propertyData={propertyData}
          signatures={activeContract.signatures || {}}
        />
      </div>
    </div>
  );
};

export default RoommateContractView;
