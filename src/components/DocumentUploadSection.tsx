
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Upload, File, X, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface DocumentType {
  key: string;
  icon: React.ComponentType<any>;
  label: string;
  color: string;
  required: boolean;
}

interface DocumentUploadSectionProps {
  documentTypes: DocumentType[];
  onUpload: (file: File, documentType: string) => Promise<void>;
  uploading: boolean;
  uploadProgress?: number;
}

const DocumentUploadSection: React.FC<DocumentUploadSectionProps> = ({
  documentTypes,
  onUpload,
  uploading,
  uploadProgress = 0
}) => {
  const { t } = useTranslation();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedDocumentType, setSelectedDocumentType] = useState<string>('');
  const [uploadError, setUploadError] = useState<string>('');

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setUploadError('');
      
      // Validation de la taille (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        setUploadError('Le fichier ne doit pas dépasser 10 MB');
        setSelectedFile(null);
        return;
      }
      
      console.log('📎 Fichier sélectionné:', {
        name: file.name,
        size: file.size,
        sizeMB: (file.size / 1024 / 1024).toFixed(2) + ' MB',
        type: file.type
      });
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !selectedDocumentType) {
      setUploadError('Veuillez sélectionner un fichier et un type de document');
      return;
    }

    try {
      setUploadError('');
      console.log('🚀 Début upload:', selectedFile.name, 'Type:', selectedDocumentType);
      
      await onUpload(selectedFile, selectedDocumentType);
      
      // Reset après succès
      setSelectedFile(null);
      setSelectedDocumentType('');
      const input = document.getElementById('file-upload') as HTMLInputElement;
      if (input) input.value = '';
      
    } catch (error) {
      console.error('❌ Erreur upload:', error);
      setUploadError(error instanceof Error ? error.message : 'Erreur lors de l\'upload');
    }
  };

  const clearSelectedFile = () => {
    setSelectedFile(null);
    setUploadError('');
    const input = document.getElementById('file-upload') as HTMLInputElement;
    if (input) input.value = '';
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  // Fonction pour annuler l'upload en cours
  const cancelUpload = () => {
    setSelectedFile(null);
    setSelectedDocumentType('');
    setUploadError('');
    const input = document.getElementById('file-upload') as HTMLInputElement;
    if (input) input.value = '';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Uploader un document
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Sélection du type de document */}
        <div>
          <Label htmlFor="document-type">Type de document</Label>
          <Select value={selectedDocumentType} onValueChange={setSelectedDocumentType} disabled={uploading}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un type de document" />
            </SelectTrigger>
            <SelectContent>
              {documentTypes.map((docType) => (
                <SelectItem key={docType.key} value={docType.key}>
                  {docType.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Sélection du fichier */}
        <div>
          <Label htmlFor="file-upload">Choisir un fichier</Label>
          <Input
            id="file-upload"
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
            onChange={handleFileSelect}
            disabled={uploading}
            className="cursor-pointer"
          />
          <p className="text-xs text-gray-500 mt-1">
            Taille max: 10 MB • Types autorisés: PDF, Images, Documents Word
          </p>
        </div>

        {/* Affichage du fichier sélectionné */}
        {selectedFile && (
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <File className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm font-medium">{selectedFile.name}</p>
                <p className="text-xs text-gray-500">{formatFileSize(selectedFile.size)}</p>
              </div>
            </div>
            <Button
              onClick={clearSelectedFile}
              disabled={uploading}
              size="sm"
              variant="outline"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Affichage des erreurs */}
        {uploadError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{uploadError}</AlertDescription>
          </Alert>
        )}

        {/* Barre de progression */}
        {uploading && (
          <div className="space-y-2">
            <Progress value={uploadProgress} className="w-full" />
            <p className="text-xs text-center text-gray-500">
              Upload en cours... {uploadProgress}%
            </p>
            <div className="flex justify-center">
              <Button
                onClick={cancelUpload}
                size="sm"
                variant="outline"
                className="text-red-600 hover:text-red-800"
              >
                Annuler l'upload
              </Button>
            </div>
          </div>
        )}

        {/* Bouton d'upload */}
        <Button
          onClick={handleUpload}
          disabled={!selectedFile || !selectedDocumentType || uploading}
          className="w-full"
        >
          {uploading ? (
            <>
              <Upload className="h-4 w-4 mr-2 animate-spin" />
              Upload en cours...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              Uploader le document
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default DocumentUploadSection;
