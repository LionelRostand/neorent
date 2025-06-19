
import { useState } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, query, where, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';

export interface DocumentData {
  id?: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  downloadURL: string; // URL de téléchargement Firebase Storage
  documentType: string;
  tenantId?: string;
  roommateId?: string;
  uploadDate: string;
  status: string;
  storagePath?: string; // Chemin dans Firebase Storage
}

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
      if (!roommateId) {
        console.error('❌ ERREUR: roommateId manquant');
        throw new Error('RoommateId requis pour sauvegarder le document');
      }

      // Créer un chemin unique pour le fichier dans Storage
      const timestamp = new Date().getTime();
      const storagePath = `roommates/${roommateId}/documents/${timestamp}_${file.name}`;
      
      console.log('📁 Chemin de stockage:', storagePath);

      // Upload vers Firebase Storage
      console.log('📤 Upload vers Firebase Storage...');
      const storageRef = ref(storage, storagePath);
      const snapshot = await uploadBytes(storageRef, file);
      console.log('✅ Fichier uploadé vers Storage');

      // Obtenir l'URL de téléchargement
      console.log('🔗 Récupération de l\'URL de téléchargement...');
      const downloadURL = await getDownloadURL(snapshot.ref);
      console.log('✅ URL obtenue:', downloadURL);
      
      // Créer l'objet document pour Firestore
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

      // Ajouter tenantId et roommateId si définis
      if (tenantId) {
        documentData.tenantId = tenantId;
        console.log('✅ TenantId ajouté:', tenantId);
      }

      if (roommateId) {
        documentData.roommateId = roommateId;
        console.log('✅ RoommateId ajouté:', roommateId);
      }

      console.log('📊 Document à sauvegarder:', documentData);

      const collectionPath = `Rent_colocataires/${roommateId}/documents`;
      console.log('📁 Chemin de la collection Firestore:', collectionPath);

      // Stocker les métadonnées dans Firestore
      console.log('💾 Sauvegarde des métadonnées dans Firestore...');
      const docRef = await addDoc(
        collection(db, 'Rent_colocataires', roommateId, 'documents'), 
        documentData
      );
      
      console.log('✅ Métadonnées sauvegardées avec succès! ID:', docRef.id);
      
      const savedDocument = {
        id: docRef.id,
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

      // Récupérer les documents de la sous-collection du colocataire
      const querySnapshot = await getDocs(
        collection(db, 'Rent_colocataires', roommateId, 'documents')
      );
      
      const documents: DocumentData[] = [];
      
      querySnapshot.docs.forEach(doc => {
        const data = doc.data() as Record<string, any>;
        
        // Vérifier que les champs requis existent
        if (data.fileName && data.fileType && data.documentType && data.downloadURL) {
          documents.push({
            id: doc.id,
            fileName: data.fileName as string,
            fileType: data.fileType as string,
            fileSize: data.fileSize as number || 0,
            downloadURL: data.downloadURL as string,
            storagePath: data.storagePath as string || '',
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
      // Utiliser l'URL de téléchargement de Firebase Storage
      const link = window.document.createElement('a');
      link.href = documentData.downloadURL;
      link.download = documentData.fileName;
      link.target = '_blank';
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
      // Récupérer les informations du document pour obtenir le chemin de stockage
      const docSnapshot = await getDocs(
        query(
          collection(db, 'Rent_colocataires', roommateId, 'documents'),
          where('__name__', '==', documentId)
        )
      );

      if (!docSnapshot.empty) {
        const docData = docSnapshot.docs[0].data();
        
        // Supprimer le fichier de Storage si le chemin existe
        if (docData.storagePath) {
          const storageRef = ref(storage, docData.storagePath);
          await deleteObject(storageRef);
          console.log('✅ Fichier supprimé de Storage');
        }
      }

      // Supprimer le document de Firestore
      await deleteDoc(doc(db, 'Rent_colocataires', roommateId, 'documents', documentId));
      console.log('✅ Document supprimé de Firestore');
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
