
// Utilitaire pour compresser les fichiers en binaire
export const compressFile = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = () => {
      try {
        const arrayBuffer = reader.result as ArrayBuffer;
        const uint8Array = new Uint8Array(arrayBuffer);
        
        // Conversion en base64 pour stockage en Firestore
        const base64String = btoa(String.fromCharCode(...uint8Array));
        resolve(base64String);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => reject(reader.error);
    reader.readAsArrayBuffer(file);
  });
};

export const decompressFile = (compressedData: string, fileName: string, fileType: string): Blob => {
  try {
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
