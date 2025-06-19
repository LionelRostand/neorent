import { useState } from 'react';
import { DocumentData, DocumentUploadParams } from '@/types/document';
import { 
  saveDocumentToFirestore,
  getDocumentsFromFirestore,
  deleteDocumentFromFirestore,
  updateDocumentStatusInFirestore,
  getDocumentById
} from '@/services/documentFirebaseService';
import { validateDocumentUpload } from '@/utils/documentValidation';
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
    console.log('=== DÉBUT UPLOAD DOCUMENT (SANS COMPRESSION) ===');
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

      console.log('📋 Validation OK, début conversion et upload...');
      setUploadProgress(10);

      console.log('🔄 Conversion et sauvegarde directe en Firestore...');
      
      // Nettoyer les valeurs avant l'envoi
      const cleanTenantId = tenantId && tenantId !== 'undefined' ? tenantId : undefined;
      
      const { docId, fileSize } = await saveDocumentToFirestore(
        file, 
        documentType, 
        roommateId!, 
        cleanTenantId
      );
      setUploadProgress(100);
      
      const savedDocument: DocumentData = {
        id: docId,
        fileName: file.name,
        fileType: file.type,
        fileSize: fileSize,
        downloadURL: '', // Pas d'URL car stocké directement
        storagePath: '', // Pas de chemin car pas dans Storage
        documentType,
        tenantId: cleanTenantId,
        roommateId,
        uploadDate: new Date().toISOString(),
        status: 'Uploadé'
      };

      console.log('📋 Document final retourné:', savedDocument);
      console.log('=== FIN UPLOAD DOCUMENT (SUCCÈS) ===');
      return savedDocument;
    } catch (error) {
      console.error('❌ ERREUR lors de l\'upload:', error);
      console.error('Type d\'erreur:', error.constructor.name);
      console.error('Message d\'erreur:', error.message);
      
      // Gestion spécifique des erreurs
      let errorMessage = 'Erreur lors de l\'upload du document';
      
      if (error.message.includes('network')) {
        errorMessage = 'Erreur de réseau. Vérifiez votre connexion.';
      } else if (error.message.includes('timeout')) {
        errorMessage = 'Timeout lors de l\'upload. Le fichier est peut-être trop volumineux.';
      } else if (error.message.includes('RoommateId')) {
        errorMessage = 'ID du colocataire manquant. Veuillez rafraîchir la page.';
      } else if (error.message.includes('Firestore')) {
        errorMessage = 'Erreur de sauvegarde. Veuillez réessayer.';
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
