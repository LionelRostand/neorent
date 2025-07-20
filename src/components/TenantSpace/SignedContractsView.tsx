
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, Eye, CheckCircle, Calendar, Euro, User, Building2 } from 'lucide-react';
import { useFirebaseContracts } from '@/hooks/useFirebaseContracts';
import { useAdminTenantAccess } from '@/hooks/useAdminTenantAccess';
import { generateContractPDF } from '@/services/contractPdfService';
import { useToast } from '@/hooks/use-toast';

const SignedContractsView = () => {
  const { contracts, loading } = useFirebaseContracts();
  const { getCurrentProfile } = useAdminTenantAccess();
  const currentProfile = getCurrentProfile();
  const { toast } = useToast();

  // Filtrer les contrats signés pour le locataire actuel
  const signedContracts = contracts.filter(contract => 
    contract.status === 'Signé' && 
    contract.tenant === currentProfile?.name
  );

  const handleDownloadContract = (contract: any) => {
    try {
      generateContractPDF(contract);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-gray-500">Chargement des contrats...</p>
      </div>
    );
  }

  if (signedContracts.length === 0) {
    return (
      <Card className="border-2 border-dashed border-gray-300 bg-gray-50">
        <CardContent className="p-8 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
              <FileText className="h-8 w-8 text-gray-400" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-gray-600">Aucun contrat signé</h3>
              <p className="text-gray-500">
                Vos contrats signés apparaîtront ici une fois qu'ils seront validés.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Mes Contrats Signés</h2>
        <Badge className="bg-green-100 text-green-800">
          {signedContracts.length} contrat{signedContracts.length > 1 ? 's' : ''} signé{signedContracts.length > 1 ? 's' : ''}
        </Badge>
      </div>

      <div className="grid gap-6">
        {signedContracts.map((contract) => (
          <Card key={contract.id} className="border-l-4 border-l-green-500">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-green-600" />
                  {contract.title}
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <Badge className="bg-green-100 text-green-800">
                  {contract.status}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center text-gray-600">
                  <User className="h-4 w-4 mr-2 text-gray-400" />
                  <span className="font-medium mr-1">Locataire:</span>
                  <span>{contract.tenant}</span>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <Building2 className="h-4 w-4 mr-2 text-gray-400" />
                  <span className="font-medium mr-1">Propriété:</span>
                  <span>{contract.property}</span>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <Euro className="h-4 w-4 mr-2 text-gray-400" />
                  <span className="font-medium mr-1">Montant:</span>
                  <span className="font-semibold text-green-600">{contract.amount}€/mois</span>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                  <span className="font-medium mr-1">Période:</span>
                  <span>Du {new Date(contract.startDate).toLocaleDateString('fr-FR')} au {new Date(contract.endDate).toLocaleDateString('fr-FR')}</span>
                </div>
              </div>

              {contract.signedDate && (
                <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 text-green-800">
                    <CheckCircle className="h-4 w-4" />
                    <span className="font-medium">Contrat signé le {new Date(contract.signedDate).toLocaleDateString('fr-FR')}</span>
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-4 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.print()}
                  className="flex items-center"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Imprimer
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleDownloadContract(contract)}
                  className="flex items-center bg-green-600 hover:bg-green-700"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Télécharger PDF
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SignedContractsView;
