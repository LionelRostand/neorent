
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, Eye } from 'lucide-react';
import RoommateContractTemplate from '@/components/Contracts/RoommateContractTemplate';
import { useAdminTenantAccess } from '@/hooks/useAdminTenantAccess';

const RoommateContractView = () => {
  const { getCurrentProfile, getCurrentUserType } = useAdminTenantAccess();
  const currentProfile = getCurrentProfile();
  const currentUserType = getCurrentUserType();

  // Vérifier que c'est bien un colocataire
  if (currentUserType !== 'colocataire' || !currentProfile) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-gray-600">Contrat non disponible</p>
        </CardContent>
      </Card>
    );
  }

  const roommateData = {
    name: currentProfile.name || 'Nom non disponible',
    email: currentProfile.email || 'Email non disponible',
    phone: currentProfile.phone || 'Téléphone non disponible',
    property: currentProfile.property || 'Propriété non disponible',
    roomNumber: currentProfile.roomNumber || 'N/A',
    rentAmount: currentProfile.rentAmount || '450',
    moveInDate: currentProfile.moveInDate || '2025-01-06',
    primaryTenant: currentProfile.primaryTenant || 'Locataire principal'
  };

  const propertyData = {
    address: currentProfile.property || '123 Rue de la Paix, 75001 Paris',
    type: 'Colocation',
    surface: '15m² (chambre)',
    furnished: true
  };

  const handleDownloadContract = () => {
    // Logique pour télécharger le contrat en PDF
    console.log('Téléchargement du contrat pour:', roommateData.name);
    // Ici, vous pourriez intégrer jsPDF ou une autre solution de génération PDF
  };

  const handlePrintContract = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* En-tête avec actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Mon Contrat de Colocation
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handlePrintContract}>
                <Eye className="h-4 w-4 mr-2" />
                Imprimer
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownloadContract}>
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
              <p className="text-gray-900 font-semibold">{roommateData.rentAmount}€</p>
            </div>
            <div>
              <span className="font-medium text-gray-600">Date d'entrée:</span>
              <p className="text-gray-900">{new Date(roommateData.moveInDate).toLocaleDateString('fr-FR')}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contrat complet */}
      <div className="bg-white rounded-lg shadow-sm border print:shadow-none print:border-none">
        <RoommateContractTemplate 
          roommateData={roommateData}
          propertyData={propertyData}
        />
      </div>

      {/* Informations importantes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Informations importantes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="p-3 bg-blue-50 rounded-lg">
            <p className="font-medium text-blue-900 mb-1">Paiement du loyer</p>
            <p className="text-blue-800">Le loyer de {roommateData.rentAmount}€ est à payer avant le 5 de chaque mois.</p>
          </div>
          <div className="p-3 bg-green-50 rounded-lg">
            <p className="font-medium text-green-900 mb-1">Préavis de départ</p>
            <p className="text-green-800">Un préavis d'un mois est requis pour résilier le contrat.</p>
          </div>
          <div className="p-3 bg-amber-50 rounded-lg">
            <p className="font-medium text-amber-900 mb-1">Assurance obligatoire</p>
            <p className="text-amber-800">Une assurance multirisque habitation doit être souscrite et maintenue.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RoommateContractView;
