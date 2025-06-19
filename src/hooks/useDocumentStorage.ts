
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
  const [uploadProgress, setUploadProgress] = useState(0);

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
      fileSizeMB: (file.size / 1024 / 1024).toFixed(2) + ' MB',
      documentType, 
      tenantId, 
      roommateId 
    });

    setUploading(true);
    setUploadProgress(0);
    
    try {
      const uploadParams: DocumentUploadParams = { file, documentType, tenantId, roommateId };
      validateDocumentUpload(uploadParams);

      console.log('📋 Validation OK, début upload...');
      setUploadProgress(10);

      console.log('📤 Upload vers Firebase Storage...');
      const { downloadURL, storagePath } = await uploadFileToStorage(file, roommateId!);
      setUploadProgress(70);

      console.log('📋 Création des métadonnées...');
      const documentData = createDocumentMetadata(
        file, 
        documentType, 
        downloadURL, 
        storagePath, 
        tenantId, 
        roommateId
      );
      setUploadProgress(80);

      console.log('💾 Sauvegarde des métadonnées...');
      const docId = await saveDocumentMetadata(documentData, roommateId!);
      setUploadProgress(100);
      
      const savedDocument = {
        id: docId,
        ...documentData
      };

      console.log('📋 Document final retourné:', savedDocument);
      return savedDocument;
    } catch (error) {
      console.error('❌ ERREUR lors de l\'upload:', error);
      console.error('Type d\'erreur:', error.constructor.name);
      console.error('Message d\'erreur:', error.message);
      
      // Gestion spécifique des erreurs courantes
      let errorMessage = 'Erreur lors de l\'upload du document';
      
      if (error.message.includes('storage/unknown')) {
        errorMessage = 'Erreur de connexion au stockage. Veuillez réessayer.';
      } else if (error.message.includes('storage/quota-exceeded')) {
        errorMessage = 'Quota de stockage dépassé.';
      } else if (error.message.includes('storage/unauthorized')) {
        errorMessage = 'Accès non autorisé au stockage.';
      } else if (error.message.includes('network')) {
        errorMessage = 'Erreur de réseau. Vérifiez votre connexion.';
      } else if (error.message.includes('timeout')) {
        errorMessage = 'Timeout lors de l\'upload. Le fichier est peut-être trop volumineux.';
      }
      
      throw new Error(`${errorMessage}: ${error.message}`);
    } finally {
      setUploading(false);
      setUploadProgress(0);
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
    uploadProgress,
    uploadDocument,
    getDocuments,
    downloadDocument,
    deleteDocument,
    updateDocumentStatus
  };
};
