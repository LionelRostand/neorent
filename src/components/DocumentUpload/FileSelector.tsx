
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface FileSelectorProps {
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  uploading: boolean;
}

const FileSelector: React.FC<FileSelectorProps> = ({ onFileSelect, uploading }) => {
  return (
    <div className="w-full">
      <Label htmlFor="file-upload" className="block text-sm font-medium text-gray-700 mb-2">
        Choisir un fichier
      </Label>
      <Input
        id="file-upload"
        type="file"
        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
        onChange={onFileSelect}
        disabled={uploading}
        className="w-full cursor-pointer text-sm file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:font-medium file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
      />
      <p className="text-xs text-gray-500 mt-1 break-words">
        Taille max: 1.5 MB • Types autorisés: PDF, Images, Documents Word
      </p>
    </div>
  );
};

export default FileSelector;
