
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface DocumentType {
  key: string;
  icon: React.ComponentType<any>;
  label: string;
  color: string;
  required: boolean;
}

interface DocumentTypeSelectorProps {
  documentTypes: DocumentType[];
  selectedDocumentType: string;
  onDocumentTypeChange: (value: string) => void;
  uploading: boolean;
}

const DocumentTypeSelector: React.FC<DocumentTypeSelectorProps> = ({
  documentTypes,
  selectedDocumentType,
  onDocumentTypeChange,
  uploading
}) => {
  return (
    <div className="w-full">
      <Label htmlFor="document-type" className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
        Type de document
      </Label>
      <Select value={selectedDocumentType} onValueChange={onDocumentTypeChange} disabled={uploading}>
        <SelectTrigger className="w-full h-10 sm:h-11 text-xs sm:text-sm">
          <SelectValue 
            placeholder="Sélectionner un type de document" 
            className="text-xs sm:text-sm placeholder:text-xs placeholder:sm:text-sm"
          />
        </SelectTrigger>
        <SelectContent className="max-h-60">
          {documentTypes.map((docType) => (
            <SelectItem key={docType.key} value={docType.key} className="text-xs sm:text-sm">
              {docType.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default DocumentTypeSelector;
