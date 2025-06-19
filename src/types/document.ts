
export interface DocumentData {
  id?: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  downloadURL: string;
  documentType: string;
  tenantId?: string;
  roommateId?: string;
  uploadDate: string;
  status: string;
  storagePath?: string;
  // Nouvelles propriétés pour le stockage binaire compressé
  compressedData?: string;
  compressedSize?: number;
}

export interface DocumentUploadParams {
  file: File;
  documentType: string;
  tenantId?: string;
  roommateId?: string;
}
