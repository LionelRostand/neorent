
import { DocumentData } from '@/types/document';
import { decompressFile } from '@/utils/fileCompression';
import { getDocumentById } from '@/services/documentFirebaseService';

export const downloadDocumentFile = async (documentData: DocumentData): Promise<void> => {
  try {
    // Si le document a des données compressées, les utiliser
    if (documentData.compressedData) {
      console.log('📁 Téléchargement depuis données compressées');
      const blob = decompressFile(documentData.compressedData, documentData.fileName, documentData.fileType);
      createDownloadLink(blob, documentData.fileName);
    } else if (documentData.id) {
      // Récupérer les données compressées depuis Firestore
      console.log('📁 Récupération des données compressées depuis Firestore');
      const docData = await getDocumentById(documentData.id);
      
      if (docData?.compressedData) {
        const blob = decompressFile(docData.compressedData, documentData.fileName, documentData.fileType);
        createDownloadLink(blob, documentData.fileName);
      } else {
        throw new Error('Données du document non trouvées');
      }
    } else if (documentData.downloadURL) {
      // Fallback pour les anciens documents avec URL
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
