
import { collection, addDoc, updateDoc, deleteDoc, doc, query, where, getDocs, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { DocumentData } from '@/types/document';

const convertFileToBase64 = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = () => {
      try {
        const result = reader.result as string;
        // Extraire seulement la partie base64 (après la virgule)
        const base64Data = result.split(',')[1];
        resolve(base64Data);
      } catch (error) {
        reject(new Error('Erreur lors de la conversion en base64'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Erreur lors de la lecture du fichier'));
    };
    
    reader.readAsDataURL(file);
  });
};

export const saveDocumentToFirestore = async (
  file: File, 
  documentType: string, 
  roommateId: string,
  tenantId?: string
): Promise<{ docId: string; fileSize: number }> => {
  console.log('📁 Début sauvegarde directe en Firestore (sans compression)');
  console.log('📤 Taille originale du fichier:', file.size, 'bytes');

  try {
    // Validation préalable de la taille - limite à 1.5MB pour fichier original
    const maxFileSize = 1.5 * 1024 * 1024; // 1.5MB
    if (file.size > maxFileSize) {
      throw new Error(`Fichier trop volumineux (${(file.size / 1024 / 1024).toFixed(2)}MB). Veuillez choisir un fichier plus petit (max 1.5MB).`);
    }

    // Validation du type de fichier
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Type de fichier non autorisé. Types acceptés: PDF, JPG, PNG, DOC, DOCX');
    }

    // Conversion en base64 sans compression
    console.log('🔄 Conversion du fichier en base64...');
    const base64Data = await convertFileToBase64(file);
    console.log('✅ Fichier converti, taille base64:', base64Data.length, 'caractères');

    // Validation de la taille finale (Firestore limite ~1MB par document)
    const maxBase64Size = 700000; // 700KB pour être sûr
    if (base64Data.length > maxBase64Size) {
      throw new Error(`Fichier trop volumineux après conversion (${(base64Data.length / 1024).toFixed(2)}KB). Veuillez choisir un fichier plus petit (max 1.5MB).`);
    }

    // Création des métadonnées du document
    const documentData: any = {
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
      base64Data: base64Data,
      documentType: documentType,
      roommateId: roommateId,
      uploadDate: new Date().toISOString(),
      status: 'Uploadé',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Ajouter tenantId seulement s'il est défini
    if (tenantId && tenantId !== 'undefined') {
      documentData.tenantId = tenantId;
    }

    console.log('💾 Sauvegarde des données dans Firestore...');
    console.log('📊 Taille des données à sauvegarder:', {
      metadonnees: JSON.stringify({...documentData, base64Data: '[DONNEES_BASE64]'}).length,
      donneesBase64: base64Data.length,
      totalApproximatif: (JSON.stringify({...documentData, base64Data: '[DONNEES_BASE64]'}).length + base64Data.length) + ' caractères'
    });
    
    const docRef = await addDoc(
      collection(db, 'rent_documents'), 
      documentData
    );
    
    console.log('✅ Document sauvegardé avec succès! ID:', docRef.id);
    return { docId: docRef.id, fileSize: file.size };
  } catch (error) {
    console.error('❌ Erreur lors de la sauvegarde:', error);
    
    // Messages d'erreur plus spécifiques
    if (error.message.includes('trop volumineux')) {
      throw error; // Conserver notre message personnalisé
    } else if (error.message.includes('Type de fichier')) {
      throw error; // Conserver le message de validation de type
    } else if (error.message.includes('conversion')) {
      throw new Error(`Erreur de conversion: ${error.message}`);
    }
    
    throw new Error(`Erreur Firestore: ${error.message}`);
  }
};

export const getDocumentsFromFirestore = async (roommateId: string): Promise<DocumentData[]> => {
  const q = query(
    collection(db, 'rent_documents'),
    where('roommateId', '==', roommateId)
  );
  
  const querySnapshot = await getDocs(q);
  
  const documents: DocumentData[] = [];
  
  querySnapshot.docs.forEach(doc => {
    const data = doc.data() as Record<string, any>;
    
    if (data.fileName && data.fileType && data.documentType) {
      documents.push({
        id: doc.id,
        fileName: data.fileName as string,
        fileType: data.fileType as string,
        fileSize: data.fileSize as number || 0,
        downloadURL: '', // Pas d'URL car stocké directement
        storagePath: '', // Pas de chemin car pas dans Storage
        documentType: data.documentType as string,
        tenantId: data.tenantId as string || undefined,
        roommateId: data.roommateId as string || undefined,
        uploadDate: data.uploadDate as string || new Date().toISOString(),
        status: data.status as string || 'Uploadé',
        // Nouvelle propriété pour les données base64
        base64Data: data.base64Data as string || data.compressedData as string || '', // Fallback pour anciens documents
        compressedSize: data.base64Data ? data.base64Data.length : (data.compressedSize as number || 0)
      });
    }
  });
  
  return documents;
};

export const deleteDocumentFromFirestore = async (documentId: string): Promise<void> => {
  await deleteDoc(doc(db, 'rent_documents', documentId));
  console.log('✅ Document supprimé de Firestore');
};

export const updateDocumentStatusInFirestore = async (documentId: string, roommateId: string, status: string): Promise<void> => {
  await updateDoc(doc(db, 'rent_documents', documentId), {
    status,
    updatedAt: new Date().toISOString()
  });
};

export const getDocumentById = async (documentId: string): Promise<any | null> => {
  const docRef = doc(db, 'rent_documents', documentId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data();
  }
  return null;
};

// Fonctions obsolètes conservées pour compatibilité (ne seront plus utilisées)
export const uploadFileToStorage = async (file: File, roommateId: string): Promise<{ downloadURL: string; storagePath: string }> => {
  throw new Error('Cette fonction est obsolète - utiliser saveDocumentToFirestore');
};

export const saveDocumentMetadata = async (documentData: any, roommateId: string): Promise<string> => {
  throw new Error('Cette fonction est obsolète - utiliser saveDocumentToFirestore');
};

export const deleteDocumentFromStorage = async (storagePath: string): Promise<void> => {
  console.log('⚠️ Pas de suppression Storage nécessaire - document stocké en Firestore');
};
