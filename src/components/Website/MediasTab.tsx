
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Upload, Eye, Trash2, Image } from 'lucide-react';

const MediasTab = () => {
  const mediaFiles = [
    { id: 1, name: 'image-1.jpg', size: '2.3 MB', type: 'image' },
    { id: 2, name: 'image-2.jpg', size: '2.3 MB', type: 'image' },
    { id: 3, name: 'image-3.jpg', size: '2.3 MB', type: 'image' },
    { id: 4, name: 'image-4.jpg', size: '2.3 MB', type: 'image' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900">🖼️ Bibliothèque de médias</h2>
        <Button className="flex items-center gap-2">
          <Upload className="h-4 w-4" />
          Télécharger
        </Button>
      </div>
      <p className="text-gray-600">Organiser et gérer vos images et documents par catégories avec intégration facile.</p>

      <div className="grid grid-cols-4 gap-4">
        {mediaFiles.map((file) => (
          <Card key={file.id} className="p-4">
            <div className="aspect-square bg-gray-100 rounded-lg mb-2 flex items-center justify-center">
              <Image className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="font-medium text-sm">{file.name}</h3>
            <p className="text-xs text-gray-500">{file.size}</p>
            <div className="flex gap-1 mt-2">
              <Button variant="ghost" size="sm">
                <Eye className="h-3 w-3" />
              </Button>
              <Button variant="ghost" size="sm">
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MediasTab;
