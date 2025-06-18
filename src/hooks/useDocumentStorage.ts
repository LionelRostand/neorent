
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
      
      const documentData: Omit<DocumentData, 'id'> = {
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        fileContent: base64Content,
        documentType,
        tenantId,
        roommateId,
        uploadDate: new Date().toISOString(),
        status: 'Uploadé'
      };

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
      const documents = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as DocumentData[];
      
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
