
import { DocumentData } from '@/types/document';
import { getDocumentById } from '@/services/documentFirebaseService';

const base64ToBlob = (base64Data: string, fileType: string): Blob => {
  try {
    // Décoder le base64
    const binaryString = atob(base64Data);
    const bytes = new Uint8Array(binaryString.length);
    
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    
    return new Blob([bytes], { type: fileType });
  } catch (error) {
    console.error('Erreur lors de la conversion base64 vers blob:', error);
    throw new Error('Erreur lors de la conversion du fichier');
  }
};

export const downloadDocumentFile = async (documentData: DocumentData): Promise<void> => {
  try {
    // Si le document a des données base64, les utiliser
    if (documentData.base64Data) {
      console.log('📁 Téléchargement depuis données base64');
      const blob = base64ToBlob(documentData.base64Data, documentData.fileType);
      createDownloadLink(blob, documentData.fileName);
    } else if (documentData.compressedData) {
      // Fallback pour anciens documents compressés
      console.log('📁 Téléchargement depuis données compressées (ancien format)');
      const blob = base64ToBlob(documentData.compressedData, documentData.fileType);
      createDownloadLink(blob, documentData.fileName);
    } else if (documentData.id) {
      // Récupérer les données depuis Firestore
      console.log('📁 Récupération des données depuis Firestore');
      const docData = await getDocumentById(documentData.id);
      
      if (docData?.base64Data) {
        const blob = base64ToBlob(docData.base64Data, documentData.fileType);
        createDownloadLink(blob, documentData.fileName);
      } else if (docData?.compressedData) {
        // Fallback pour anciens documents
        const blob = base64ToBlob(docData.compressedData, documentData.fileType);
        createDownloadLink(blob, documentData.fileName);
      } else {
        throw new Error('Données du document non trouvées');
      }
    } else if (documentData.downloadURL) {
      // Fallback pour les très anciens documents avec URL
      console.log('📁 Téléchargement depuis URL (ancien système)');
      const link = window.document.createElement('a');
      link.href = documentData.downloadURL;
      link.download = documentData.fileName;
      link.target = '_blank';
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);
    } else {
      throw new Error('Aucune source de données disponible pour le téléchargement');
    }
  } catch (error) {
    console.error('Erreur lors du téléchargement:', error);
    throw new Error('Erreur lors du téléchargement du document');
  }
};

const createDownloadLink = (blob: Blob, fileName: string): void => {
  const url = URL.createObjectURL(blob);
  const link = window.document.createElement('a');
  link.href = url;
  link.download = fileName;
  window.document.body.appendChild(link);
  link.click();
  window.document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
