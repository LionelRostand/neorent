
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Upload, Eye, Trash2, Image as ImageIcon, Download, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const MediasTab = () => {
  const [mediaFiles, setMediaFiles] = useState([
    { id: 1, name: 'image-1.jpg', size: '2.3 MB', type: 'image', url: '/placeholder.svg' },
    { id: 2, name: 'image-2.jpg', size: '2.3 MB', type: 'image', url: '/placeholder.svg' },
    { id: 3, name: 'image-3.jpg', size: '2.3 MB', type: 'image', url: '/placeholder.svg' },
    { id: 4, name: 'image-4.jpg', size: '2.3 MB', type: 'image', url: '/placeholder.svg' }
  ]);
  
  const [viewingImage, setViewingImage] = useState<{id: number, name: string, url: string} | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const { toast } = useToast();

  const handleViewImage = (file: typeof mediaFiles[0]) => {
    setViewingImage(file);
    setIsViewerOpen(true);
  };

  const handleDeleteImage = (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette image ?')) {
      setMediaFiles(prev => prev.filter(file => file.id !== id));
      toast({
        title: "Image supprimée",
        description: "L'image a été supprimée avec succès.",
      });
    }
  };

  const handleDownloadImage = (file: typeof mediaFiles[0]) => {
    const link = document.createElement('a');
    link.href = file.url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Téléchargement",
      description: `${file.name} a été téléchargé.`,
    });
  };

  const handleUpload = () => {
    toast({
      title: "Fonctionnalité à venir",
      description: "L'upload d'images sera bientôt disponible.",
    });
  };

  return (
    <>
      <div className="space-y-4 md:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl md:text-2xl font-semibold text-gray-900">🖼️ Bibliothèque de médias</h2>
            <p className="text-gray-600 text-sm md:text-base mt-1">
              Organiser et gérer vos images et documents par catégories avec intégration facile.
            </p>
          </div>
          <Button onClick={handleUpload} className="flex items-center gap-2 w-full sm:w-auto">
            <Upload className="h-4 w-4" />
            Télécharger
          </Button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
          {mediaFiles.map((file) => (
            <Card key={file.id} className="p-3 md:p-4 hover:shadow-lg transition-shadow">
              <div className="aspect-square bg-gray-100 rounded-lg mb-2 flex items-center justify-center overflow-hidden">
                <img 
                  src={file.url} 
                  alt={file.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                  }}
                />
                <ImageIcon className="h-8 w-8 md:h-12 md:w-12 text-gray-400 hidden" />
              </div>
              
              <h3 className="font-medium text-xs md:text-sm truncate" title={file.name}>
                {file.name}
              </h3>
              <p className="text-xs text-gray-500 mb-2">{file.size}</p>
              
              <div className="flex flex-col gap-1">
                <div className="flex gap-1">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 w-6 p-0 hover:bg-blue-100"
                    onClick={() => handleViewImage(file)}
                    title="Visualiser"
                  >
                    <Eye className="h-3 w-3 text-blue-600" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 w-6 p-0 hover:bg-green-100"
                    onClick={() => handleDownloadImage(file)}
                    title="Télécharger"
                  >
                    <Download className="h-3 w-3 text-green-600" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 w-6 p-0 hover:bg-red-100"
                    onClick={() => handleDeleteImage(file.id)}
                    title="Supprimer"
                  >
                    <Trash2 className="h-3 w-3 text-red-600" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {mediaFiles.length === 0 && (
          <div className="text-center py-12">
            <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">Aucun média</h3>
            <p className="mt-2 text-gray-500">Commencez par télécharger vos premières images.</p>
            <Button onClick={handleUpload} className="mt-4">
              <Upload className="mr-2 h-4 w-4" />
              Télécharger des images
            </Button>
          </div>
        )}
      </div>

      {/* Image Viewer Modal */}
      <Dialog open={isViewerOpen} onOpenChange={setIsViewerOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0">
          <DialogHeader className="p-4 pb-0">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-lg font-semibold">
                {viewingImage?.name}
              </DialogTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => viewingImage && handleDownloadImage(viewingImage as any)}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Télécharger
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsViewerOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </DialogHeader>
          
          <div className="p-4 pt-0">
            {viewingImage && (
              <div className="flex items-center justify-center bg-gray-50 rounded-lg p-4">
                <img
                  src={viewingImage.url}
                  alt={viewingImage.name}
                  className="max-w-full max-h-[70vh] object-contain rounded"
                />
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MediasTab;
