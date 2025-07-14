
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Upload, Download, Eye, Trash2, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import DocumentUploadComponent from '@/components/DocumentUploadComponent';

interface MediaFile {
  id: string;
  name: string;
  size: string;
  type: 'image' | 'document';
  url?: string;
  uploadDate: string;
}

const MediasTab = () => {
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([
    { 
      id: '1', 
      name: 'image-1.jpg', 
      size: '2.3 MB', 
      type: 'image',
      url: '/lovable-uploads/7945563f-9d15-452e-bdc5-e8a06aec9733.png',
      uploadDate: new Date().toISOString()
    },
    { 
      id: '2', 
      name: 'image-2.jpg', 
      size: '2.3 MB', 
      type: 'image',
      uploadDate: new Date().toISOString()
    },
    { 
      id: '3', 
      name: 'image-3.jpg', 
      size: '2.3 MB', 
      type: 'image',
      uploadDate: new Date().toISOString()
    },
    { 
      id: '4', 
      name: 'image-4.jpg', 
      size: '2.3 MB', 
      type: 'image',
      uploadDate: new Date().toISOString()
    }
  ]);
  
  const [selectedImage, setSelectedImage] = useState<MediaFile | null>(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showUploadDialog, setShowUploadDialog] = useState(false);

  const handleView = (file: MediaFile) => {
    setSelectedImage(file);
    setShowImageModal(true);
  };

  const handleDownload = (file: MediaFile) => {
    if (file.url) {
      const link = document.createElement('a');
      link.href = file.url;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success(`${file.name} téléchargé avec succès`);
    } else {
      toast.error('URL de téléchargement non disponible');
    }
  };

  const handleDelete = (fileId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce fichier ?')) {
      setMediaFiles(prev => prev.filter(file => file.id !== fileId));
      toast.success('Fichier supprimé avec succès');
    }
  };

  const handleUploadSuccess = (result: { url: string; path: string; size: number; type: string }) => {
    const newFile: MediaFile = {
      id: Date.now().toString(),
      name: result.path.split('/').pop() || 'nouveau-fichier',
      size: (result.size / 1024 / 1024).toFixed(1) + ' MB',
      type: result.type.startsWith('image/') ? 'image' : 'document',
      url: result.url,
      uploadDate: new Date().toISOString()
    };
    
    setMediaFiles(prev => [...prev, newFile]);
    setShowUploadDialog(false);
    toast.success('Fichier uploadé avec succès');
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-semibold text-gray-900">📁 Médiathèque</h2>
          <p className="text-gray-600 text-sm md:text-base">
            Organisez et gérez vos images et documents par catégories avec une intégration facile.
          </p>
        </div>
        <Button 
          onClick={() => setShowUploadDialog(true)}
          className="flex items-center gap-2 w-full sm:w-auto"
        >
          <Upload className="h-4 w-4" />
          Uploader des photos
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base md:text-lg">Fichiers Média ({mediaFiles.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {mediaFiles.map((file) => (
              <div key={file.id} className="border rounded-lg p-4 bg-white hover:shadow-md transition-shadow">
                <div className="aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                  {file.url ? (
                    <img 
                      src={file.url} 
                      alt={file.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <ImageIcon className="text-gray-400 h-12 w-12" />
                  )}
                </div>
                <h4 className="font-medium text-sm mb-1 truncate" title={file.name}>
                  {file.name}
                </h4>
                <p className="text-xs text-gray-500 mb-3">{file.size}</p>
                <div className="flex gap-1">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 p-1"
                    onClick={() => handleView(file)}
                    title="Voir"
                  >
                    <Eye className="h-3 w-3" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 p-1"
                    onClick={() => handleDownload(file)}
                    title="Télécharger"
                  >
                    <Download className="h-3 w-3" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 p-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleDelete(file.id)}
                    title="Supprimer"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          {mediaFiles.length === 0 && (
            <div className="text-center py-12">
              <ImageIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">Aucun fichier média pour le moment</p>
              <Button onClick={() => setShowUploadDialog(true)}>
                <Upload className="h-4 w-4 mr-2" />
                Uploader le premier fichier
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upload Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Uploader des photos d'appartement</DialogTitle>
          </DialogHeader>
          <DocumentUploadComponent
            folder="property-images"
            onUploadSuccess={handleUploadSuccess}
            allowedTypes={['image/*']}
            maxSizeMB={5}
            label="Choisir une photo"
            accept="image/*"
          />
        </DialogContent>
      </Dialog>

      {/* Image Preview Modal */}
      <Dialog open={showImageModal} onOpenChange={setShowImageModal}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>{selectedImage?.name}</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center items-center max-h-[70vh] overflow-hidden">
            {selectedImage?.url ? (
              <img 
                src={selectedImage.url} 
                alt={selectedImage.name}
                className="max-w-full max-h-full object-contain rounded-lg"
              />
            ) : (
              <div className="flex flex-col items-center justify-center p-8 text-gray-500">
                <ImageIcon className="h-16 w-16 mb-4" />
                <p>Aperçu non disponible</p>
              </div>
            )}
          </div>
          <div className="flex justify-center gap-2 pt-4">
            <Button 
              variant="outline"
              onClick={() => selectedImage && handleDownload(selectedImage)}
            >
              <Download className="h-4 w-4 mr-2" />
              Télécharger
            </Button>
            <Button 
              variant="outline"
              onClick={() => {
                if (selectedImage) {
                  handleDelete(selectedImage.id);
                  setShowImageModal(false);
                }
              }}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Supprimer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MediasTab;
