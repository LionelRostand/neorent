
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
    <div>
      <Label htmlFor="document-type">Type de document</Label>
      <Select value={selectedDocumentType} onValueChange={onDocumentTypeChange} disabled={uploading}>
        <SelectTrigger>
          <SelectValue placeholder="Sélectionner un type de document" />
        </SelectTrigger>
        <SelectContent>
          {documentTypes.map((docType) => (
            <SelectItem key={docType.key} value={docType.key}>
              {docType.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default DocumentTypeSelector;
