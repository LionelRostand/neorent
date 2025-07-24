
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, PenTool } from 'lucide-react';
import { useAdminTenantAccess } from '@/hooks/useAdminTenantAccess';
import { useFirebaseContracts } from '@/hooks/useFirebaseContracts';
import { useRoommateData } from '@/hooks/useRoommateData';
import { useAuth } from '@/hooks/useAuth';
import DocumentManager from '@/components/DocumentManager';
import GeneratedDocuments from './GeneratedDocuments';

const DocumentsSection: React.FC = () => {
  const { t } = useTranslation();
  const { getCurrentProfile, getCurrentUserType } = useAdminTenantAccess();
  const { contracts, loading } = useFirebaseContracts();
  const { user } = useAuth();
  const { roommateProfile } = useRoommateData(user?.email || null);
  
  const currentProfile = roommateProfile || getCurrentProfile();
  const currentUserType = getCurrentUserType();
  const isRoommate = currentUserType === 'colocataire';
  
  // Vérifier si le contrat est signé en utilisant les données Firebase
  const signedContract = contracts.find(contract => 
    contract.status === 'Signé' && 
    contract.tenant === currentProfile?.name
  );
  
  // Utiliser uniquement les contrats réellement signés dans Firebase
  const activeContract = signedContract;
  const isContractSigned = !isRoommate || !!activeContract;

  console.log('DocumentsSection - isRoommate:', isRoommate);
  console.log('DocumentsSection - activeContract:', activeContract);
  console.log('DocumentsSection - isContractSigned:', isContractSigned);
  console.log('DocumentsSection - currentProfile:', currentProfile);

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

  // Show real documents using DocumentManager for signed contracts or non-roommates
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

      {/* Documents générés automatiquement par l'application */}
      <GeneratedDocuments />

      {/* Gestionnaire de documents uploadés par l'utilisateur */}
      <DocumentManager
        roommateId={currentProfile?.id?.toString() || user?.uid}
        tenantId={currentProfile?.id?.toString()}
        tenantName={currentProfile?.name}
      />
    </div>
  );
};

export default DocumentsSection;
