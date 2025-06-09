
import { useState } from 'react';
import { uploadFile, deleteFile, validateFileSize, validateFileType } from '@/services/fileUploadService';
import { useToast } from '@/hooks/use-toast';

interface UseDocumentUploadProps {
  folder: string;
  allowedTypes?: string[];
  maxSizeMB?: number;
}

export const useDocumentUpload = ({ 
  folder, 
  allowedTypes = ['image/*', 'application/pdf'],
  maxSizeMB = 10
}: UseDocumentUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const uploadDocument = async (file: File, customFilename?: string) => {
    try {
      setUploading(true);

      // Validation de la taille
      if (!validateFileSize(file, maxSizeMB)) {
        throw new Error(`Le fichier ne doit pas dépasser ${maxSizeMB} MB`);
      }

      // Validation du type (simplifié)
      const fileType = file.type;
      const isValidType = allowedTypes.some(type => {
        if (type.endsWith('/*')) {
          return fileType.startsWith(type.replace('/*', '/'));
        }
        return fileType === type;
      });

      if (!isValidType) {
        throw new Error('Type de fichier non autorisé');
      }

      const result = await uploadFile(file, folder, customFilename);
      
      toast({
        title: "Succès",
        description: "Document uploadé avec succès",
      });

      return result;
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Erreur lors de l'upload",
        variant: "destructive",
      });
      throw error;
    } finally {
      setUploading(false);
    }
  };

  const deleteDocument = async (filePath: string) => {
    try {
      await deleteFile(filePath);
      toast({
        title: "Succès",
        description: "Document supprimé avec succès",
      });
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la suppression",
        variant: "destructive",
      });
      throw error;
    }
  };

  return {
    uploadDocument,
    deleteDocument,
    uploading
  };
};
