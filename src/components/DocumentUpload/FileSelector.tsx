
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface FileSelectorProps {
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  uploading: boolean;
}

const FileSelector: React.FC<FileSelectorProps> = ({ onFileSelect, uploading }) => {
  return (
    <div>
      <Label htmlFor="file-upload">Choisir un fichier</Label>
      <Input
        id="file-upload"
        type="file"
        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
        onChange={onFileSelect}
        disabled={uploading}
        className="cursor-pointer"
      />
      <p className="text-xs text-gray-500 mt-1">
        Taille max: 3 MB • Types autorisés: PDF, Images, Documents Word
      </p>
    </div>
  );
};

export default FileSelector;
