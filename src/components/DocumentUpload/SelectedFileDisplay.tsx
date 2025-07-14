
import React from 'react';
import { Button } from '@/components/ui/button';
import { File, X } from 'lucide-react';

interface SelectedFileDisplayProps {
  selectedFile: File;
  onClearFile: () => void;
  uploading: boolean;
}

const SelectedFileDisplay: React.FC<SelectedFileDisplayProps> = ({
  selectedFile,
  onClearFile,
  uploading
}) => {
  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 bg-gray-50 rounded-lg gap-3 sm:gap-0">
      <div className="flex items-center space-x-3 min-w-0 flex-1">
        <File className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500 flex-shrink-0" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium truncate" title={selectedFile.name}>
            {selectedFile.name}
          </p>
          <p className="text-xs text-gray-500">{formatFileSize(selectedFile.size)}</p>
        </div>
      </div>
      <Button
        onClick={onClearFile}
        disabled={uploading}
        size="sm"
        variant="outline"
        className="flex-shrink-0 w-full sm:w-auto"
      >
        <X className="h-4 w-4" />
        <span className="ml-1 sm:hidden">Supprimer</span>
      </Button>
    </div>
  );
};

export default SelectedFileDisplay;
