
import { useState } from 'react';
import { DocumentData, DocumentUploadParams } from '@/types/document';
import { 
  uploadFileToStorage, 
  saveDocumentMetadata, 
  getDocumentsFromFirestore,
  deleteDocumentFromStorage,
  deleteDocumentFromFirestore,
  updateDocumentStatusInFirestore,
  getDocumentById
} from '@/services/documentFirebaseService';
import { validateDocumentUpload, createDocumentMetadata } from '@/utils/documentValidation';
import { downloadDocumentFile } from '@/utils/documentDownload';

export const useDocumentStorage = () => {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const uploadDocument = async (
    file: File, 
    documentType: string, 
    tenantId?: string, 
    roommateId?: string
  ): Promise<DocumentData> => {
    console.log('=== DÉBUT UPLOAD DOCUMENT ===');
    console.log('Paramètres reçus:', { 
      fileName: file.name, 
      fileSize: file.size,
      documentType, 
      tenantId, 
      roommateId 
    });

    setUploading(true);
    try {
      const uploadParams: DocumentUploadParams = { file, documentType, tenantId, roommateId };
      validateDocumentUpload(uploadParams);

      const { downloadURL, storagePath } = await uploadFileToStorage(file, roommateId!);
      
      const documentData = createDocumentMetadata(
        file, 
        documentType, 
        downloadURL, 
        storagePath, 
        tenantId, 
        roommateId
      );

      const docId = await saveDocumentMetadata(documentData, roommateId!);
      
      const savedDocument = {
        id: docId,
        ...documentData
      };

      console.log('📋 Document final retourné:', savedDocument);
      return savedDocument;
    } catch (error) {
      console.error('❌ ERREUR lors de l\'upload:', error);
      console.error('Détails de l\'erreur:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
      throw new Error(`Erreur lors de l'upload du document: ${error.message}`);
    } finally {
      setUploading(false);
      console.log('=== FIN UPLOAD DOCUMENT ===');
    }
  };

  const getDocuments = async (tenantId?: string, roommateId?: string): Promise<DocumentData[]> => {
    setLoading(true);
    try {
      if (!roommateId) {
        throw new Error('RoommateId requis pour récupérer les documents');
      }

      return await getDocumentsFromFirestore(roommateId);
    } catch (error) {
      console.error('Erreur lors de la récupération des documents:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const downloadDocument = (documentData: DocumentData) => {
    downloadDocumentFile(documentData);
  };

  const deleteDocument = async (documentId: string, roommateId?: string) => {
    try {
      const docData = await getDocumentById(documentId);
      
      if (docData?.storagePath) {
        await deleteDocumentFromStorage(docData.storagePath);
      }

      await deleteDocumentFromFirestore(documentId);
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      throw new Error('Erreur lors de la suppression du document');
    }
  };

  const updateDocumentStatus = async (documentId: string, roommateId: string, status: string) => {
    try {
      await updateDocumentStatusInFirestore(documentId, roommateId, status);
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      throw new Error('Erreur lors de la mise à jour du statut');
    }
  };

  return {
    loading,
    uploading,
    uploadDocument,
    getDocuments,
    downloadDocument,
    deleteDocument,
    updateDocumentStatus
  };
};
