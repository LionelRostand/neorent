
// Utilitaire pour compresser les fichiers en binaire avec validation de taille
export const compressFile = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    // Vérifier la taille du fichier avant compression (limite à 5MB pour éviter les problèmes)
    const maxFileSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxFileSize) {
      reject(new Error(`Fichier trop volumineux (${(file.size / 1024 / 1024).toFixed(2)}MB). Limite: 5MB`));
      return;
    }

    const reader = new FileReader();
    
    reader.onload = () => {
      try {
        const arrayBuffer = reader.result as ArrayBuffer;
        const uint8Array = new Uint8Array(arrayBuffer);
        
        // Conversion en base64 pour stockage en Firestore
        const base64String = btoa(String.fromCharCode(...uint8Array));
        
        // Vérifier la taille après compression (limite Firestore: ~1MB par document)
        const maxCompressedSize = 800000; // 800KB pour être sûr
        if (base64String.length > maxCompressedSize) {
          reject(new Error(`Fichier compressé trop volumineux (${(base64String.length / 1024).toFixed(2)}KB). Veuillez choisir un fichier plus petit.`));
          return;
        }
        
        console.log('✅ Compression réussie:', {
          tailleOriginale: (file.size / 1024).toFixed(2) + 'KB',
          tailleCompresse: (base64String.length / 1024).toFixed(2) + 'KB'
        });
        
        resolve(base64String);
      } catch (error) {
        console.error('Erreur lors de la compression:', error);
        reject(new Error('Erreur lors de la compression du fichier'));
      }
    };
    
    reader.onerror = () => reject(new Error('Erreur lors de la lecture du fichier'));
    reader.readAsArrayBuffer(file);
  });
};

export const decompressFile = (compressedData: string, fileName: string, fileType: string): Blob => {
  try {
    if (!compressedData || compressedData.length === 0) {
      throw new Error('Données compressées vides');
    }

    // Décodage base64
    const binaryString = atob(compressedData);
    const bytes = new Uint8Array(binaryString.length);
    
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    
    return new Blob([bytes], { type: fileType });
  } catch (error) {
    console.error('Erreur lors de la décompression:', error);
    throw new Error('Erreur lors de la décompression du fichier');
  }
};
