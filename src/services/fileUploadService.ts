
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '@/lib/firebase';

export interface UploadResult {
  url: string;
  path: string;
  size: number;
  type: string;
}

export const uploadFile = async (
  file: File,
  folder: string,
  filename?: string
): Promise<UploadResult> => {
  try {
    const timestamp = Date.now();
    const finalFilename = filename || `${timestamp}_${file.name}`;
    const filePath = `${folder}/${finalFilename}`;
    
    const storageRef = ref(storage, filePath);
    
    console.log(`Uploading file to Firebase Storage: ${filePath}`);
    const snapshot = await uploadBytes(storageRef, file);
    
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    console.log(`File uploaded successfully: ${downloadURL}`);
    
    return {
      url: downloadURL,
      path: filePath,
      size: file.size,
      type: file.type
    };
  } catch (error) {
    console.error('Error uploading file:', error);
    throw new Error('Erreur lors de l\'upload du fichier');
  }
};

export const deleteFile = async (filePath: string): Promise<void> => {
  try {
    const storageRef = ref(storage, filePath);
    await deleteObject(storageRef);
    console.log(`File deleted successfully: ${filePath}`);
  } catch (error) {
    console.error('Error deleting file:', error);
    throw new Error('Erreur lors de la suppression du fichier');
  }
};

// Fonction pour convertir un fichier en base64 (pour stockage en DB si vraiment nécessaire)
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Enlever le préfixe data:image/...;base64,
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = error => reject(error);
  });
};

// Fonction pour limiter la taille des fichiers
export const validateFileSize = (file: File, maxSizeMB: number = 10): boolean => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
};

// Fonction pour valider le type de fichier
export const validateFileType = (file: File, allowedTypes: string[]): boolean => {
  return allowedTypes.includes(file.type);
};
