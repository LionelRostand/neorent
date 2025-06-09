
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, FileText, Image } from 'lucide-react';

interface DocumentViewerProps {
  isOpen: boolean;
  onClose: () => void;
  documentName: string;
  documentType: string;
  documentUrl?: string;
  documentSize?: number;
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({
  isOpen,
  onClose,
  documentName,
  documentType,
  documentUrl,
  documentSize
}) => {
  const handleDownload = () => {
    if (documentUrl) {
      const link = document.createElement('a');
      link.href = documentUrl;
      link.download = documentName;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const getFileExtension = (filename: string) => {
    return filename.split('.').pop()?.toLowerCase() || '';
  };

  const isImageFile = (filename: string) => {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
    return imageExtensions.includes(getFileExtension(filename));
  };

  const isPdfFile = (filename: string) => {
    return getFileExtension(filename) === 'pdf';
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Taille inconnue';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold truncate pr-4">
              {documentName}
            </DialogTitle>
            <Button
              onClick={handleDownload}
              className="bg-blue-600 hover:bg-blue-700 flex-shrink-0"
              size="sm"
            >
              <Download className="h-4 w-4 mr-2" />
              Télécharger
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          {isImageFile(documentName) && documentUrl ? (
            <div className="flex items-center justify-center bg-gray-50 rounded-lg border">
              <img 
                src={documentUrl} 
                alt={documentName}
                className="max-w-full max-h-96 object-contain rounded"
                onError={(e) => {
                  console.error('Error loading image:', e);
                }}
              />
            </div>
          ) : isPdfFile(documentName) && documentUrl ? (
            <div className="h-96 bg-gray-50 rounded-lg border">
              <iframe
                src={`${documentUrl}#toolbar=0`}
                className="w-full h-full rounded-lg"
                title={documentName}
              />
            </div>
          ) : documentUrl ? (
            <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg border">
              <div className="text-center">
                <FileText className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600 mb-4">Prévisualisation du document</p>
                <p className="text-sm text-gray-500 mb-4">{documentName}</p>
                <p className="text-xs text-gray-400">
                  Type: {getFileExtension(documentName).toUpperCase()}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg border">
              <div className="text-center">
                <FileText className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600 mb-4">Document non disponible</p>
                <p className="text-sm text-gray-500">{documentName}</p>
              </div>
            </div>
          )}
        </div>

        <div className="pt-4 border-t">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <span>Type: {documentType}</span>
            <span>Taille: {formatFileSize(documentSize)}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentViewer;
