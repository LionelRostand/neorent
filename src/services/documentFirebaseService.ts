
import { collection, addDoc, updateDoc, deleteDoc, doc, query, where, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { DocumentData } from '@/types/document';

export const uploadFileToStorage = async (file: File, roommateId: string): Promise<{ downloadURL: string; storagePath: string }> => {
  const timestamp = new Date().getTime();
  const storagePath = `roommates/${roommateId}/documents/${timestamp}_${file.name}`;
  
  console.log('📁 Chemin de stockage:', storagePath);

  console.log('📤 Upload vers Firebase Storage...');
  const storageRef = ref(storage, storagePath);
  const snapshot = await uploadBytes(storageRef, file);
  console.log('✅ Fichier uploadé vers Storage');

  console.log('🔗 Récupération de l\'URL de téléchargement...');
  const downloadURL = await getDownloadURL(snapshot.ref);
  console.log('✅ URL obtenue:', downloadURL);

  return { downloadURL, storagePath };
};

export const saveDocumentMetadata = async (documentData: any, roommateId: string): Promise<string> => {
  const collectionPath = `Rent_colocataires/${roommateId}/documents`;
  console.log('📁 Chemin de la collection Firestore:', collectionPath);

  console.log('💾 Sauvegarde des métadonnées dans Firestore...');
  const docRef = await addDoc(
    collection(db, 'Rent_colocataires', roommateId, 'documents'), 
    documentData
  );
  
  console.log('✅ Métadonnées sauvegardées avec succès! ID:', docRef.id);
  return docRef.id;
};

export const getDocumentsFromFirestore = async (roommateId: string): Promise<DocumentData[]> => {
  const querySnapshot = await getDocs(
    collection(db, 'Rent_colocataires', roommateId, 'documents')
  );
  
  const documents: DocumentData[] = [];
  
  querySnapshot.docs.forEach(doc => {
    const data = doc.data() as Record<string, any>;
    
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
};

export const deleteDocumentFromStorage = async (storagePath: string): Promise<void> => {
  const storageRef = ref(storage, storagePath);
  await deleteObject(storageRef);
  console.log('✅ Fichier supprimé de Storage');
};

export const deleteDocumentFromFirestore = async (documentId: string, roommateId: string): Promise<void> => {
  await deleteDoc(doc(db, 'Rent_colocataires', roommateId, 'documents', documentId));
  console.log('✅ Document supprimé de Firestore');
};

export const updateDocumentStatusInFirestore = async (documentId: string, roommateId: string, status: string): Promise<void> => {
  await updateDoc(doc(db, 'Rent_colocataires', roommateId, 'documents', documentId), {
    status,
    updatedAt: new Date().toISOString()
  });
};

export const getDocumentById = async (documentId: string, roommateId: string): Promise<any | null> => {
  const querySnapshot = await getDocs(
    query(
      collection(db, 'Rent_colocataires', roommateId, 'documents'),
      where('__name__', '==', documentId)
    )
  );

  if (!querySnapshot.empty) {
    return querySnapshot.docs[0].data();
  }
  return null;
};
