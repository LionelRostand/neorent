
import { collection, addDoc, updateDoc, deleteDoc, doc, query, where, getDocs, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { DocumentData } from '@/types/document';
import { compressFile } from '@/utils/fileCompression';

export const saveDocumentToFirestore = async (
  file: File, 
  documentType: string, 
  roommateId: string,
  tenantId?: string
): Promise<{ docId: string; compressedSize: number }> => {
  console.log('📁 Début compression et sauvegarde directe en Firestore');
  console.log('📤 Taille originale du fichier:', file.size, 'bytes');

  try {
    // Compression du fichier
    console.log('🗜️ Compression du fichier...');
    const compressedData = await compressFile(file);
    const compressedSize = compressedData.length;
    console.log('✅ Fichier compressé, taille:', compressedSize, 'caractères');

    // Création des métadonnées du document
    const documentData = {
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
      compressedSize: compressedSize,
      compressedData: compressedData, // Données binaires compressées
      documentType: documentType,
      roommateId: roommateId,
      tenantId: tenantId || undefined,
      uploadDate: new Date().toISOString(),
      status: 'Uploadé',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    console.log('💾 Sauvegarde des métadonnées et données dans Firestore...');
    console.log('📊 Données à sauvegarder:', {
      ...documentData,
      compressedData: `[${compressedSize} caractères compressés]` // Pour le log seulement
    });
    
    const docRef = await addDoc(
      collection(db, 'rent_documents'), 
      documentData
    );
    
    console.log('✅ Document sauvegardé avec succès! ID:', docRef.id);
    return { docId: docRef.id, compressedSize };
  } catch (error) {
    console.error('❌ Erreur lors de la sauvegarde:', error);
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
        compressedData: data.compressedData as string || '', // Nouvelles données
        compressedSize: data.compressedSize as number || 0
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
