
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
}

export interface DocumentUploadParams {
  file: File;
  documentType: string;
  tenantId?: string;
  roommateId?: string;
}
