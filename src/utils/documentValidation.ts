
import { DocumentUploadParams } from '@/types/document';

export const validateDocumentUpload = (params: DocumentUploadParams): void => {
  const { roommateId } = params;
  
  if (!roommateId) {
    console.error('❌ ERREUR: roommateId manquant');
    throw new Error('RoommateId requis pour sauvegarder le document');
  }
};

export const createDocumentMetadata = (
  file: File,
  documentType: string,
  downloadURL: string,
  storagePath: string,
  tenantId?: string,
  roommateId?: string
) => {
  const documentData: any = {
    fileName: file.name,
    fileType: file.type,
    fileSize: file.size,
    downloadURL,
    storagePath,
    documentType,
    uploadDate: new Date().toISOString(),
    status: 'Uploadé'
  };

  if (tenantId) {
    documentData.tenantId = tenantId;
    console.log('✅ TenantId ajouté:', tenantId);
  }

  if (roommateId) {
    documentData.roommateId = roommateId;
    console.log('✅ RoommateId ajouté:', roommateId);
  }

  console.log('📊 Document à sauvegarder:', documentData);
  return documentData;
};
