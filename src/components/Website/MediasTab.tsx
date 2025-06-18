
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Download, Eye, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const MediasTab = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [mediaFiles] = useState([
    { id: '1', name: 'image-1.jpg', size: '2.3 MB', type: 'image' },
    { id: '2', name: 'image-2.jpg', size: '2.3 MB', type: 'image' },
    { id: '3', name: 'image-3.jpg', size: '2.3 MB', type: 'image' },
    { id: '4', name: 'image-4.jpg', size: '2.3 MB', type: 'image' }
  ]);

  const handleUpload = async () => {
    setIsUploading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('Files uploaded successfully!');
    } catch (error) {
      toast.error('Error uploading files');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-semibold text-gray-900">📁 Media Library</h2>
          <p className="text-gray-600 text-sm md:text-base">
            Organize and manage your images and documents by categories with easy integration.
          </p>
        </div>
        <Button 
          onClick={handleUpload}
          disabled={isUploading}
          className="flex items-center gap-2 w-full sm:w-auto"
        >
          <Upload className="h-4 w-4" />
          {isUploading ? 'Uploading...' : 'Upload'}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base md:text-lg">Media Files</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {mediaFiles.map((file) => (
              <div key={file.id} className="border rounded-lg p-4">
                <div className="aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                  <div className="text-gray-400 text-4xl">📷</div>
                </div>
                <h4 className="font-medium text-sm mb-1">{file.name}</h4>
                <p className="text-xs text-gray-500 mb-3">{file.size}</p>
                <div className="flex gap-1">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Eye className="h-3 w-3" />
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Download className="h-3 w-3" />
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 text-red-600">
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MediasTab;
