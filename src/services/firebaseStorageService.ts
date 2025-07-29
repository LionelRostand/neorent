import { ref, uploadBytes, getDownloadURL, deleteObject, listAll } from 'firebase/storage';
import { storage } from '@/lib/firebase';
import { addDoc, collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface DocumentMetadata {
  id?: string;
  tenantId: string;
  tenantName: string;
  fileName: string;
  fileType: 'receipt' | 'contract' | 'document' | 'invoice';
  storagePath: string;
  downloadURL: string;
  size: number;
  createdAt: Date;
  metadata?: {
    amount?: number;
    period?: string;
    paymentDate?: string;
    contractId?: string;
  };
}

class FirebaseStorageService {
  // Uploader un PDF en format binaire
  async uploadPDF(
    file: Blob | File, 
    tenantId: string, 
    fileName: string, 
    fileType: DocumentMetadata['fileType'],
    metadata?: DocumentMetadata['metadata']
  ): Promise<DocumentMetadata> {
    try {
      // Créer le chemin de stockage
      const timestamp = Date.now();
      const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
      const storagePath = `${fileType}s/${tenantId}/${timestamp}_${sanitizedFileName}`;
      
      // Référence Firebase Storage
      const storageRef = ref(storage, storagePath);
      
      // Upload du fichier binaire
      const snapshot = await uploadBytes(storageRef, file, {
        contentType: 'application/pdf',
        customMetadata: {
          tenantId,
          fileType,
          uploadedAt: new Date().toISOString()
        }
      });
      
      // Obtenir l'URL de téléchargement
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      // Créer les métadonnées pour Firestore
      const docMetadata: Omit<DocumentMetadata, 'id'> = {
        tenantId,
        tenantName: metadata?.contractId || 'Unknown',
        fileName: sanitizedFileName,
        fileType,
        storagePath,
        downloadURL,
        size: snapshot.metadata.size || 0,
        createdAt: new Date(),
        metadata
      };
      
      // Sauvegarder les métadonnées dans Firestore
      const docRef = await addDoc(collection(db, 'document_metadata'), docMetadata);
      
      return {
        id: docRef.id,
        ...docMetadata
      };
    } catch (error) {
      console.error('Erreur lors de l\'upload du PDF:', error);
      throw new Error('Échec de l\'upload du document');
    }
  }

  // Générer et uploader une quittance PDF
  async generateAndUploadReceipt(
    tenantId: string,
    tenantName: string,
    receiptData: {
      amount: number;
      period: string;
      paymentDate: string;
      method: string;
      reference?: string;
    }
  ): Promise<DocumentMetadata> {
    try {
      // Générer le PDF (utilise le service existant)
      const { generateReceiptPDF } = await import('./receiptPdfService');
      const pdfBlob = await generateReceiptPDF({
        tenant: {
          name: tenantName,
          address: 'Adresse du locataire',
          email: 'email@example.com'
        },
        property: {
          address: 'Adresse de la propriété',
          rent: receiptData.amount - 50,
          charges: 50
        },
        payment: {
          amount: receiptData.amount,
          date: receiptData.paymentDate, // Mapper paymentDate vers date
          method: receiptData.method,
          reference: receiptData.reference || '',
          period: receiptData.period
        }
      });
      
      const fileName = `quittance_${tenantName.replace(/\s+/g, '_')}_${receiptData.period.replace(/\s+/g, '_')}.pdf`;
      
      return await this.uploadPDF(
        pdfBlob,
        tenantId,
        fileName,
        'receipt',
        {
          amount: receiptData.amount,
          period: receiptData.period,
          paymentDate: receiptData.paymentDate
        }
      );
    } catch (error) {
      console.error('Erreur lors de la génération de la quittance:', error);
      throw new Error('Échec de la génération de la quittance');
    }
  }

  // Récupérer les documents d'un locataire
  async getTenantDocuments(tenantId: string): Promise<DocumentMetadata[]> {
    try {
      const q = query(
        collection(db, 'document_metadata'),
        where('tenantId', '==', tenantId)
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as DocumentMetadata[];
    } catch (error) {
      console.error('Erreur lors de la récupération des documents:', error);
      throw new Error('Échec de la récupération des documents');
    }
  }

  // Télécharger un document
  async downloadDocument(documentId: string): Promise<void> {
    try {
      const documents = await getDocs(
        query(collection(db, 'document_metadata'), where('__name__', '==', documentId))
      );
      
      if (documents.empty) {
        throw new Error('Document non trouvé');
      }
      
      const docData = documents.docs[0].data() as DocumentMetadata;
      
      // Ouvrir l'URL de téléchargement dans un nouvel onglet
      window.open(docData.downloadURL, '_blank');
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
      throw new Error('Échec du téléchargement');
    }
  }

  // Supprimer un document
  async deleteDocument(documentId: string): Promise<void> {
    try {
      // Récupérer les métadonnées
      const documents = await getDocs(
        query(collection(db, 'document_metadata'), where('__name__', '==', documentId))
      );
      
      if (documents.empty) {
        throw new Error('Document non trouvé');
      }
      
      const docData = documents.docs[0].data() as DocumentMetadata;
      
      // Supprimer le fichier de Storage
      const storageRef = ref(storage, docData.storagePath);
      await deleteObject(storageRef);
      
      // Supprimer les métadonnées de Firestore
      await deleteDoc(doc(db, 'document_metadata', documentId));
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      throw new Error('Échec de la suppression');
    }
  }

  // Obtenir l'espace de stockage utilisé par un locataire
  async getTenantStorageUsage(tenantId: string): Promise<number> {
    try {
      const documents = await this.getTenantDocuments(tenantId);
      return documents.reduce((total, doc) => total + doc.size, 0);
    } catch (error) {
      console.error('Erreur lors du calcul de l\'espace:', error);
      return 0;
    }
  }
}

export const firebaseStorageService = new FirebaseStorageService();