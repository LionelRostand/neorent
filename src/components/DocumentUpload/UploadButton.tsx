
import React from 'react';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';

interface UploadButtonProps {
  onUpload: () => void;
  disabled: boolean;
  uploading: boolean;
}

const UploadButton: React.FC<UploadButtonProps> = ({
  onUpload,
  disabled,
  uploading
}) => {
  return (
    <Button
      onClick={onUpload}
      disabled={disabled}
      className="w-full h-10 text-sm sm:text-base"
    >
      {uploading ? (
        <>
          <Upload className="h-4 w-4 mr-2 animate-spin" />
          <span className="hidden sm:inline">Upload en cours...</span>
          <span className="sm:hidden">Upload...</span>
        </>
      ) : (
        <>
          <Upload className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Uploader le document</span>
          <span className="sm:hidden">Uploader</span>
        </>
      )}
    </Button>
  );
};

export default UploadButton;
