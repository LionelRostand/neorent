
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, PenTool } from 'lucide-react';
import { useAdminTenantAccess } from '@/hooks/useAdminTenantAccess';

const DocumentUpload = () => {
  const { getCurrentProfile, getCurrentUserType } = useAdminTenantAccess();
  const currentProfile = getCurrentProfile();
  const currentUserType = getCurrentUserType();
  const isRoommate = currentUserType === 'colocataire';
  
  // Check if contract is signed for roommates
  const isContractSigned = !isRoommate || currentProfile?.contractStatus === 'Signé';

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
                <h3 className="text-xl font-semibold text-gray-600">Téléversement non disponible</h3>
                <p className="text-gray-500 max-w-md">
                  Le téléversement de documents sera disponible après la signature de votre contrat de colocation.
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

  // Show upload interface for signed contracts or non-roommates
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Téléversement de documents
        </h2>
        <p className="text-gray-600">
          Téléversez vos documents importants liés à votre bail.
        </p>
      </div>

      <Card className="border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors">
        <CardContent className="p-8 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Glissez-déposez vos fichiers ici</h3>
              <p className="text-gray-500">
                ou cliquez pour sélectionner des fichiers
              </p>
              <p className="text-sm text-gray-400">
                Formats supportés : PDF, JPG, PNG, DOC, DOCX (max. 10 Mo)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentUpload;
