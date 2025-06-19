
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
      className="w-full"
    >
      {uploading ? (
        <>
          <Upload className="h-4 w-4 mr-2 animate-spin" />
          Upload en cours...
        </>
      ) : (
        <>
          <Upload className="h-4 w-4 mr-2" />
          Uploader le document
        </>
      )}
    </Button>
  );
};

export default UploadButton;
