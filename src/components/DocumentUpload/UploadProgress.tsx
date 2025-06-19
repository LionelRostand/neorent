
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
    <div className="space-y-2">
      <Progress value={uploadProgress} className="w-full" />
      <p className="text-xs text-center text-gray-500">
        Upload en cours... {uploadProgress}%
      </p>
      <div className="flex justify-center">
        <Button
          onClick={onCancelUpload}
          size="sm"
          variant="outline"
          className="text-red-600 hover:text-red-800"
        >
          Annuler l'upload
        </Button>
      </div>
    </div>
  );
};

export default UploadProgress;
