import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { firebaseStorageService, DocumentMetadata } from '@/services/firebaseStorageService';
import { useToast } from './use-toast';

export const useFirebaseDocuments = () => {
  const [documents, setDocuments] = useState<DocumentMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const { userProfile } = useAuth();
  const { toast } = useToast();

  // Charger les documents du locataire
  const fetchDocuments = async () => {
    if (!userProfile?.id) return;
    
    try {
      setLoading(true);
      const docs = await firebaseStorageService.getTenantDocuments(userProfile.id);
      setDocuments(docs);
    } catch (error) {
      console.error('Erreur lors du chargement des documents:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les documents",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [userProfile?.id]);

  // Uploader un document
  const uploadDocument = async (
    file: File,
    fileType: DocumentMetadata['fileType'],
    metadata?: DocumentMetadata['metadata']
  ): Promise<DocumentMetadata | null> => {
    if (!userProfile?.id || !userProfile?.name) return null;

    try {
      setUploading(true);
      const uploadedDoc = await firebaseStorageService.uploadPDF(
        file,
        userProfile.id,
        file.name,
        fileType,
        metadata
      );

      // Ajouter le document à la liste locale
      setDocuments(prev => [uploadedDoc, ...prev]);
      
      toast({
        title: "Document uploadé",
        description: `${file.name} a été uploadé avec succès`
      });

      return uploadedDoc;
    } catch (error) {
      console.error('Erreur lors de l\'upload:', error);
      toast({
        title: "Erreur d'upload",
        description: "Impossible d'uploader le document",
        variant: "destructive"
      });
      return null;
    } finally {
      setUploading(false);
    }
  };

  // Générer et uploader une quittance
  const generateReceipt = async (receiptData: {
    amount: number;
    period: string;
    paymentDate: string;
    method: string;
    reference?: string;
  }): Promise<DocumentMetadata | null> => {
    if (!userProfile?.id || !userProfile?.name) return null;

    try {
      setUploading(true);
      const receipt = await firebaseStorageService.generateAndUploadReceipt(
        userProfile.id,
        userProfile.name,
        receiptData
      );

      // Ajouter la quittance à la liste locale
      setDocuments(prev => [receipt, ...prev]);
      
      toast({
        title: "Quittance générée",
        description: `Quittance pour ${receiptData.period} générée avec succès`
      });

      return receipt;
    } catch (error) {
      console.error('Erreur lors de la génération:', error);
      toast({
        title: "Erreur de génération",
        description: "Impossible de générer la quittance",
        variant: "destructive"
      });
      return null;
    } finally {
      setUploading(false);
    }
  };

  // Télécharger un document
  const downloadDocument = async (documentId: string) => {
    try {
      await firebaseStorageService.downloadDocument(documentId);
    } catch (error) {
      toast({
        title: "Erreur de téléchargement",
        description: "Impossible de télécharger le document",
        variant: "destructive"
      });
    }
  };

  // Supprimer un document
  const deleteDocument = async (documentId: string) => {
    try {
      await firebaseStorageService.deleteDocument(documentId);
      
      // Retirer le document de la liste locale
      setDocuments(prev => prev.filter(doc => doc.id !== documentId));
      
      toast({
        title: "Document supprimé",
        description: "Le document a été supprimé avec succès"
      });
    } catch (error) {
      toast({
        title: "Erreur de suppression",
        description: "Impossible de supprimer le document",
        variant: "destructive"
      });
    }
  };

  // Filtrer les documents par type
  const getDocumentsByType = (type: DocumentMetadata['fileType']) => {
    return documents.filter(doc => doc.fileType === type);
  };

  // Obtenir l'espace de stockage utilisé
  const getStorageUsage = () => {
    return documents.reduce((total, doc) => total + doc.size, 0);
  };

  return {
    documents,
    loading,
    uploading,
    uploadDocument,
    generateReceipt,
    downloadDocument,
    deleteDocument,
    getDocumentsByType,
    getStorageUsage,
    refetch: fetchDocuments
  };
};