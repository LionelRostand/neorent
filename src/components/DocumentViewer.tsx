
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
  documentUrl?: string; // En production, ce serait une URL réelle
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({
  isOpen,
  onClose,
  documentName,
  documentType,
  documentUrl
}) => {
  const handleDownload = () => {
    // Simuler le téléchargement - en production, utiliser l'URL réelle
    const link = document.createElement('a');
    link.href = documentUrl || '/placeholder.svg';
    link.download = documentName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
          {isImageFile(documentName) ? (
            <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg border">
              <div className="text-center">
                <Image className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600 mb-4">Aperçu de l'image</p>
                <p className="text-sm text-gray-500">{documentName}</p>
                {/* En production, afficher l'image réelle :
                <img 
                  src={documentUrl} 
                  alt={documentName}
                  className="max-w-full max-h-96 object-contain"
                />
                */}
              </div>
            </div>
          ) : isPdfFile(documentName) ? (
            <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg border">
              <div className="text-center">
                <FileText className="h-16 w-16 mx-auto mb-4 text-red-500" />
                <p className="text-gray-600 mb-4">Aperçu PDF</p>
                <p className="text-sm text-gray-500 mb-4">{documentName}</p>
                <p className="text-xs text-gray-400">
                  Le visualiseur PDF sera intégré en production
                </p>
                {/* En production, utiliser un visualiseur PDF comme react-pdf :
                <embed 
                  src={documentUrl} 
                  type="application/pdf"
                  width="100%" 
                  height="400px" 
                />
                */}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg border">
              <div className="text-center">
                <FileText className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600 mb-4">Aperçu du document</p>
                <p className="text-sm text-gray-500 mb-4">{documentName}</p>
                <p className="text-xs text-gray-400">
                  Type: {getFileExtension(documentName).toUpperCase()}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="pt-4 border-t">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <span>Type: {documentType}</span>
            <span>Taille: {Math.floor(Math.random() * 2000 + 500)} KB</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentViewer;
