
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload } from 'lucide-react';
import DocumentTypeSelector from './DocumentUpload/DocumentTypeSelector';
import FileSelector from './DocumentUpload/FileSelector';
import SelectedFileDisplay from './DocumentUpload/SelectedFileDisplay';
import ErrorAlert from './DocumentUpload/ErrorAlert';
import UploadProgress from './DocumentUpload/UploadProgress';
import UploadButton from './DocumentUpload/UploadButton';

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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedDocumentType, setSelectedDocumentType] = useState<string>('');
  const [uploadError, setUploadError] = useState<string>('');

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setUploadError('');
      
      const maxFileSize = 1.5 * 1024 * 1024; // 1.5MB
      if (file.size > maxFileSize) {
        setUploadError(`Le fichier ne doit pas dépasser 1.5 MB (actuellement: ${(file.size / 1024 / 1024).toFixed(2)} MB)`);
        setSelectedFile(null);
        return;
      }

      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        setUploadError('Type de fichier non autorisé. Types acceptés: PDF, JPG, PNG, DOC, DOCX');
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

  const cancelUpload = () => {
    setSelectedFile(null);
    setSelectedDocumentType('');
    setUploadError('');
    const input = document.getElementById('file-upload') as HTMLInputElement;
    if (input) input.value = '';
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
          <Upload className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="text-sm sm:text-base">Uploader un document</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 p-4 sm:p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type de document
            </label>
            <DocumentTypeSelector
              documentTypes={documentTypes}
              selectedDocumentType={selectedDocumentType}
              onDocumentTypeChange={setSelectedDocumentType}
              uploading={uploading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Choisir un fichier
            </label>
            <FileSelector
              onFileSelect={handleFileSelect}
              uploading={uploading}
            />
            <p className="text-xs text-gray-500 mt-1">
              Taille max: 1.5 MB • Types autorisés: PDF, Images, Documents Word
            </p>
          </div>

          {selectedFile && (
            <SelectedFileDisplay
              selectedFile={selectedFile}
              onClearFile={clearSelectedFile}
              uploading={uploading}
            />
          )}

          <ErrorAlert error={uploadError} />

          {uploading && (
            <UploadProgress
              uploadProgress={uploadProgress}
              onCancelUpload={cancelUpload}
            />
          )}

          <UploadButton
            onUpload={handleUpload}
            disabled={!selectedFile || !selectedDocumentType || uploading}
            uploading={uploading}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentUploadSection;
