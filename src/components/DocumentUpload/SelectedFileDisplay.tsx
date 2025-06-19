
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
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <div className="flex items-center space-x-3">
        <File className="h-5 w-5 text-gray-500" />
        <div>
          <p className="text-sm font-medium">{selectedFile.name}</p>
          <p className="text-xs text-gray-500">{formatFileSize(selectedFile.size)}</p>
        </div>
      </div>
      <Button
        onClick={onClearFile}
        disabled={uploading}
        size="sm"
        variant="outline"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default SelectedFileDisplay;
