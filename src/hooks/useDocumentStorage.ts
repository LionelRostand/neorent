
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
    setUploading(true);
    try {
      const base64Content = await convertFileToBase64(file);
      
      // Créer l'objet document en s'assurant qu'on n'ajoute pas de valeurs undefined
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
      }

      // Ajouter roommateId seulement s'il est défini
      if (roommateId) {
        documentData.roommateId = roommateId;
      }

      console.log('Saving document to Firestore:', documentData);

      const docRef = await addDoc(collection(db, 'documents'), documentData);
      
      return {
        id: docRef.id,
        ...documentData
      };
    } catch (error) {
      console.error('Erreur lors de l\'upload:', error);
      throw new Error('Erreur lors de l\'upload du document');
    } finally {
      setUploading(false);
    }
  };

  const getDocuments = async (tenantId?: string, roommateId?: string): Promise<DocumentData[]> => {
    setLoading(true);
    try {
      let q;
      if (tenantId) {
        q = query(collection(db, 'documents'), where('tenantId', '==', tenantId));
      } else if (roommateId) {
        q = query(collection(db, 'documents'), where('roommateId', '==', roommateId));
      } else {
        throw new Error('TenantId ou RoommateId requis');
      }

      const querySnapshot = await getDocs(q);
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

  const deleteDocument = async (documentId: string) => {
    try {
      await deleteDoc(doc(db, 'documents', documentId));
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      throw new Error('Erreur lors de la suppression du document');
    }
  };

  const updateDocumentStatus = async (documentId: string, status: string) => {
    try {
      await updateDoc(doc(db, 'documents', documentId), {
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
