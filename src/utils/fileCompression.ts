
// Utilitaire pour compresser les fichiers en binaire avec validation de taille
export const compressFile = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    // Vérifier la taille du fichier avant compression (limite à 3MB pour éviter les problèmes)
    const maxFileSize = 3 * 1024 * 1024; // 3MB pour être plus sûr
    if (file.size > maxFileSize) {
      reject(new Error(`Fichier trop volumineux (${(file.size / 1024 / 1024).toFixed(2)}MB). Limite: 3MB`));
      return;
    }

    const reader = new FileReader();
    
    reader.onload = () => {
      try {
        const arrayBuffer = reader.result as ArrayBuffer;
        
        if (!arrayBuffer) {
          reject(new Error('Impossible de lire le fichier'));
          return;
        }

        const uint8Array = new Uint8Array(arrayBuffer);
        
        // Vérifier que les données ne sont pas trop volumineuses pour btoa
        if (uint8Array.length > 2 * 1024 * 1024) { // 2MB max pour le buffer
          reject(new Error('Fichier trop volumineux pour la compression. Choisissez un fichier plus petit.'));
          return;
        }
        
        // Conversion en base64 par chunks pour éviter les erreurs de stack
        let base64String = '';
        const chunkSize = 8192; // 8KB par chunk
        
        for (let i = 0; i < uint8Array.length; i += chunkSize) {
          const chunk = uint8Array.slice(i, i + chunkSize);
          const chunkString = String.fromCharCode.apply(null, Array.from(chunk));
          base64String += btoa(chunkString);
        }
        
        // Vérifier la taille après compression (limite Firestore: ~500KB pour être sûr)
        const maxCompressedSize = 500000; // 500KB pour être très sûr
        if (base64String.length > maxCompressedSize) {
          reject(new Error(`Fichier compressé trop volumineux (${(base64String.length / 1024).toFixed(2)}KB). Veuillez choisir un fichier plus petit (max 2MB).`));
          return;
        }
        
        console.log('✅ Compression réussie:', {
          tailleOriginale: (file.size / 1024).toFixed(2) + 'KB',
          tailleCompresse: (base64String.length / 1024).toFixed(2) + 'KB'
        });
        
        resolve(base64String);
      } catch (error) {
        console.error('Erreur lors de la compression:', error);
        
        // Messages d'erreur spécifiques
        if (error.message && error.message.includes('Invalid character')) {
          reject(new Error('Format de fichier non supporté pour la compression'));
        } else if (error.message && error.message.includes('string too long')) {
          reject(new Error('Fichier trop volumineux. Veuillez choisir un fichier plus petit.'));
        } else {
          reject(new Error('Erreur lors de la compression du fichier. Essayez avec un fichier plus petit.'));
        }
      }
    };
    
    reader.onerror = () => {
      console.error('Erreur FileReader:', reader.error);
      reject(new Error('Erreur lors de la lecture du fichier'));
    };
    
    reader.onabort = () => {
      reject(new Error('Lecture du fichier interrompue'));
    };
    
    // Utiliser readAsArrayBuffer pour un meilleur contrôle
    reader.readAsArrayBuffer(file);
  });
};

export const decompressFile = (compressedData: string, fileName: string, fileType: string): Blob => {
  try {
    if (!compressedData || compressedData.length === 0) {
      throw new Error('Données compressées vides');
    }

    // Décodage base64 par chunks pour éviter les erreurs
    let binaryString = '';
    const chunkSize = 8192;
    
    for (let i = 0; i < compressedData.length; i += chunkSize) {
      const chunk = compressedData.slice(i, i + chunkSize);
      binaryString += atob(chunk);
    }
    
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
