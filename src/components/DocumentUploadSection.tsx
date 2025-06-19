
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Upload, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DocumentType {
  key: string;
  label: string;
}

interface DocumentUploadSectionProps {
  documentTypes: DocumentType[];
  onUpload: (file: File, documentType: string) => Promise<void>;
  uploading: boolean;
}

const DocumentUploadSection: React.FC<DocumentUploadSectionProps> = ({
  documentTypes,
  onUpload,
  uploading
}) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [selectedDocumentType, setSelectedDocumentType] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  // Simulate upload progress
  useEffect(() => {
    if (uploading) {
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 95) {
            return prev;
          }
          return prev + Math.random() * 10;
        });
      }, 100);

      return () => clearInterval(interval);
    } else {
      setUploadProgress(0);
    }
  }, [uploading]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !selectedDocumentType) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un fichier et un type de document",
        variant: "destructive",
      });
      return;
    }

    try {
      setUploadProgress(0);
      await onUpload(selectedFile, selectedDocumentType);
      
      setUploadProgress(100);
      setSelectedFile(null);
      setSelectedDocumentType('');
      
      // Reset input
      const input = document.getElementById('file-upload') as HTMLInputElement;
      if (input) input.value = '';
      
      toast({
        title: "Succès",
        description: "Document uploadé avec succès",
      });
    } catch (error) {
      console.error('Upload failed:', error);
      setUploadProgress(0);
    }
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Upload className="h-5 w-5" />
          <h3 className="text-lg font-semibold">{t('roommates.uploadNewDocument')}</h3>
        </div>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="document-type">{t('roommates.documentType')}</Label>
            <Select value={selectedDocumentType} onValueChange={setSelectedDocumentType}>
              <SelectTrigger>
                <SelectValue placeholder={t('roommates.selectType')} />
              </SelectTrigger>
              <SelectContent>
                {documentTypes.map((type) => (
                  <SelectItem key={type.key} value={type.key}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="file-upload">{t('roommates.fileMaxSize')}</Label>
            <Input
              id="file-upload"
              type="file"
              accept="image/*,application/pdf"
              onChange={handleFileSelect}
              disabled={uploading}
              className="cursor-pointer"
            />
            <p className="text-xs text-gray-500 mt-1">
              Taille max: 10 MB • Types autorisés: Images, PDF
            </p>
          </div>

          {selectedFile && (
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <FileText className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm font-medium">{selectedFile.name}</p>
                  <p className="text-xs text-gray-500">{formatFileSize(selectedFile.size)}</p>
                </div>
              </div>
              <Button
                onClick={handleUpload}
                disabled={uploading || !selectedDocumentType}
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
            </div>
          )}

          {uploading && (
            <div className="space-y-2">
              <Progress value={uploadProgress} className="w-full" />
              <p className="text-xs text-center text-gray-500">Upload en cours... {Math.round(uploadProgress)}%</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentUploadSection;
