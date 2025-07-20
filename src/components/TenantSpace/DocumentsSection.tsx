
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, PenTool } from 'lucide-react';
import { useAdminTenantAccess } from '@/hooks/useAdminTenantAccess';
import { useFirebaseContracts } from '@/hooks/useFirebaseContracts';

const DocumentsSection: React.FC = () => {
  const { t } = useTranslation();
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

  console.log('DocumentsSection - isRoommate:', isRoommate);
  console.log('DocumentsSection - signedContract:', signedContract);
  console.log('DocumentsSection - isContractSigned:', isContractSigned);

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
                <h3 className="text-xl font-semibold text-gray-600">Documents non disponibles</h3>
                <p className="text-gray-500 max-w-md">
                  Vos documents seront disponibles après la signature de votre contrat de colocation.
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

  // Show documents for signed contracts or non-roommates
  const mockDocuments = [
    {
      id: 1,
      name: 'Contrat de bail',
      type: 'PDF',
      size: '2.3 MB',
      uploadDate: '2024-01-15',
      category: 'Contract'
    },
    {
      id: 2,
      name: 'État des lieux entrée',
      type: 'PDF',
      size: '1.8 MB',
      uploadDate: '2024-01-15',
      category: 'Inspection'
    },
    {
      id: 3,
      name: 'Quittance de loyer - Janvier',
      type: 'PDF',
      size: '0.5 MB',
      uploadDate: '2024-02-01',
      category: 'Receipt'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {t('tenantSpace.documents.title')}
        </h2>
        <p className="text-gray-600">
          {t('tenantSpace.documents.description')}
        </p>
      </div>

      <div className="grid gap-4">
        {mockDocuments.map((document) => (
          <Card key={document.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{document.name}</h3>
                    <p className="text-sm text-gray-500">
                      {document.type} • {document.size} • {new Date(document.uploadDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DocumentsSection;
