
import { DocumentData } from '@/types/document';

export const downloadDocumentFile = (documentData: DocumentData): void => {
  try {
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
