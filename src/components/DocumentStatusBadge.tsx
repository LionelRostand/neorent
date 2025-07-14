
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface DocumentStatusBadgeProps {
  documentType: string;
  required: boolean;
  documentExists: boolean;
}

const DocumentStatusBadge: React.FC<DocumentStatusBadgeProps> = ({
  documentType,
  required,
  documentExists
}) => {
  if (documentExists) {
    return (
      <Badge className="bg-green-100 text-green-800 text-xs sm:text-sm w-full sm:w-auto justify-center sm:justify-start">
        <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
        <span className="hidden sm:inline">Uploadé</span>
        <span className="sm:hidden">✓</span>
      </Badge>
    );
  }

  if (required) {
    return (
      <Badge className="bg-red-100 text-red-800 text-xs sm:text-sm w-full sm:w-auto justify-center sm:justify-start">
        <XCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
        <span className="hidden sm:inline">Requis</span>
        <span className="sm:hidden">Requis</span>
      </Badge>
    );
  }

  return (
    <Badge className="bg-gray-100 text-gray-600 text-xs sm:text-sm w-full sm:w-auto justify-center sm:justify-start">
      <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
      <span className="hidden sm:inline">Optionnel</span>
      <span className="sm:hidden">Opt.</span>
    </Badge>
  );
};

export default DocumentStatusBadge;
