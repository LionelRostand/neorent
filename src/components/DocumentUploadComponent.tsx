
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { useDocumentUpload } from '@/hooks/useDocumentUpload';
import { Upload, File, X } from 'lucide-react';

interface DocumentUploadComponentProps {
  folder: string;
  onUploadSuccess: (result: { url: string; path: string; size: number; type: string }) => void;
  allowedTypes?: string[];
  maxSizeMB?: number;
  label?: string;
  accept?: string;
}

const DocumentUploadComponent: React.FC<DocumentUploadComponentProps> = ({
  folder,
  onUploadSuccess,
  allowedTypes = ['image/*', 'application/pdf'],
  maxSizeMB = 10,
  label = "Choisir un fichier",
  accept = "image/*,application/pdf"
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { uploadDocument, uploading } = useDocumentUpload({ 
    folder, 
    allowedTypes, 
    maxSizeMB 
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      const result = await uploadDocument(selectedFile);
      onUploadSuccess(result);
      setSelectedFile(null);
      
      // Reset input
      const input = document.getElementById('file-upload') as HTMLInputElement;
      if (input) input.value = '';
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  const clearSelectedFile = () => {
    setSelectedFile(null);
    const input = document.getElementById('file-upload') as HTMLInputElement;
    if (input) input.value = '';
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="file-upload">{label}</Label>
        <Input
          id="file-upload"
          type="file"
          accept={accept}
          onChange={handleFileSelect}
          disabled={uploading}
          className="cursor-pointer"
        />
        <p className="text-xs text-gray-500 mt-1">
          Taille max: {maxSizeMB} MB • Types autorisés: Images, PDF
        </p>
      </div>

      {selectedFile && (
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <File className="h-5 w-5 text-gray-500" />
            <div>
              <p className="text-sm font-medium">{selectedFile.name}</p>
              <p className="text-xs text-gray-500">{formatFileSize(selectedFile.size)}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              onClick={handleUpload}
              disabled={uploading}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700"
            >
              {uploading ? (
                <>
                  <Upload className="h-4 w-4 mr-2 animate-spin" />
                  Upload...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload
                </>
              )}
            </Button>
            <Button
              onClick={clearSelectedFile}
              disabled={uploading}
              size="sm"
              variant="outline"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {uploading && (
        <div className="space-y-2">
          <Progress value={100} className="w-full" />
          <p className="text-xs text-center text-gray-500">Upload en cours...</p>
        </div>
      )}
    </div>
  );
};

export default DocumentUploadComponent;
