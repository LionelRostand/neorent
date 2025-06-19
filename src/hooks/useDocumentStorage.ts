import { useState } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface DocumentData {
  id?: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  fileContent: string; // Base64 encoded
  documentType: string;
  tenantId?: string;
  roommateId?: string;
  uploadDate: string;
  status: string;
}

export const useDocumentStorage = () => {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // Enlever le préfixe data:type;base64,
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = error => reject(error);
    });
  };

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
      if (!roommateId) {
        console.error('❌ ERREUR: roommateId manquant');
        throw new Error('RoommateId requis pour sauvegarder le document');
      }

      console.log('📄 Conversion du fichier en base64...');
      const base64Content = await convertFileToBase64(file);
      console.log('✅ Conversion réussie, taille base64:', base64Content.length);
      
      // Créer l'objet document
      const documentData: any = {
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        fileContent: base64Content,
        documentType,
        uploadDate: new Date().toISOString(),
        status: 'Uploadé'
      };

      // Ajouter tenantId seulement s'il est défini
      if (tenantId) {
        documentData.tenantId = tenantId;
        console.log('✅ TenantId ajouté:', tenantId);
      }

      // Ajouter roommateId seulement s'il est défini
      if (roommateId) {
        documentData.roommateId = roommateId;
        console.log('✅ RoommateId ajouté:', roommateId);
      }

      console.log('📊 Document à sauvegarder:', {
        ...documentData,
        fileContent: `[BASE64 DATA - ${base64Content.length} chars]`
      });

      const collectionPath = `Rent_colocataires/${roommateId}/documents`;
      console.log('📁 Chemin de la collection:', collectionPath);

      // Vérifier que la collection parent existe
      console.log('🔍 Vérification de la connexion à Firebase...');
      
      // Stocker dans la sous-collection documents du colocataire
      console.log('💾 Tentative de sauvegarde dans Firestore...');
      const docRef = await addDoc(
        collection(db, 'Rent_colocataires', roommateId, 'documents'), 
        documentData
      );
      
      console.log('✅ Document sauvegardé avec succès! ID:', docRef.id);
      
      const savedDocument = {
        id: docRef.id,
        ...documentData
      };

      console.log('📋 Document final retourné:', {
        ...savedDocument,
        fileContent: `[BASE64 DATA - ${base64Content.length} chars]`
      });

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

      // Récupérer les documents de la sous-collection du colocataire
      const querySnapshot = await getDocs(
        collection(db, 'Rent_colocataires', roommateId, 'documents')
      );
      
      const documents: DocumentData[] = [];
      
      querySnapshot.docs.forEach(doc => {
        const data = doc.data() as Record<string, any>;
        
        // Vérifier que les champs requis existent
        if (data.fileName && data.fileType && data.documentType) {
          documents.push({
            id: doc.id,
            fileName: data.fileName as string,
            fileType: data.fileType as string,
            fileSize: data.fileSize as number || 0,
            fileContent: data.fileContent as string || '',
            documentType: data.documentType as string,
            tenantId: data.tenantId as string || undefined,
            roommateId: data.roommateId as string || undefined,
            uploadDate: data.uploadDate as string || new Date().toISOString(),
            status: data.status as string || 'Uploadé'
          });
        }
      });
      
      return documents;
    } catch (error) {
      console.error('Erreur lors de la récupération des documents:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const downloadDocument = (documentData: DocumentData) => {
    try {
      // Reconstruire le data URL
      const dataUrl = `data:${documentData.fileType};base64,${documentData.fileContent}`;
      
      // Créer un lien de téléchargement
      const link = window.document.createElement('a');
      link.href = dataUrl;
      link.download = documentData.fileName;
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
      throw new Error('Erreur lors du téléchargement du document');
    }
  };

  const deleteDocument = async (documentId: string, roommateId: string) => {
    try {
      await deleteDoc(doc(db, 'Rent_colocataires', roommateId, 'documents', documentId));
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      throw new Error('Erreur lors de la suppression du document');
    }
  };

  const updateDocumentStatus = async (documentId: string, roommateId: string, status: string) => {
    try {
      await updateDoc(doc(db, 'Rent_colocataires', roommateId, 'documents', documentId), {
        status,
        updatedAt: new Date().toISOString()
      });
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
