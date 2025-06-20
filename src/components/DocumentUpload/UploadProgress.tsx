
import React from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface UploadProgressProps {
  uploadProgress: number;
  onCancelUpload: () => void;
}

const UploadProgress: React.FC<UploadProgressProps> = ({
  uploadProgress,
  onCancelUpload
}) => {
  return (
    <div className="space-y-3">
      <Progress value={uploadProgress} className="w-full h-2" />
      <p className="text-xs text-center text-gray-500">
        Upload en cours... {uploadProgress}%
      </p>
      <div className="flex justify-center">
        <Button
          onClick={onCancelUpload}
          size="sm"
          variant="outline"
          className="text-red-600 hover:text-red-800 text-xs sm:text-sm px-3 py-1"
        >
          <span className="hidden sm:inline">Annuler l'upload</span>
          <span className="sm:hidden">Annuler</span>
        </Button>
      </div>
    </div>
  );
};

export default UploadProgress;
