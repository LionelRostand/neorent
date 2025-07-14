
import React from 'react';
import { Button } from '@/components/ui/button';
import { Eye, Download } from 'lucide-react';
import { DocumentData } from '@/types/document';

interface DocumentActionsProps {
  document?: DocumentData;
  onView: (document: DocumentData) => void;
  onDownload: (document: DocumentData) => void;
}

const DocumentActions: React.FC<DocumentActionsProps> = ({
  document,
  onView,
  onDownload
}) => {
  if (!document) {
    return (
      <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
        <Button 
          disabled 
          size="sm" 
          variant="outline"
          className="w-full sm:w-auto text-xs sm:text-sm px-2 sm:px-3"
        >
          <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
          <span className="hidden sm:inline">Voir</span>
          <span className="sm:hidden">Voir</span>
        </Button>
        <Button 
          disabled 
          size="sm" 
          variant="outline"
          className="w-full sm:w-auto text-xs sm:text-sm px-2 sm:px-3"
        >
          <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
          <span className="hidden sm:inline">Télécharger</span>
          <span className="sm:hidden">Télécharger</span>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
      <Button
        onClick={() => onView(document)}
        size="sm"
        variant="outline"
        className="w-full sm:w-auto text-xs sm:text-sm px-2 sm:px-3 hover:bg-blue-50"
      >
        <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
        <span className="hidden sm:inline">Voir</span>
        <span className="sm:hidden">Voir</span>
      </Button>
      <Button
        onClick={() => onDownload(document)}
        size="sm"
        variant="outline"
        className="w-full sm:w-auto text-xs sm:text-sm px-2 sm:px-3 hover:bg-green-50"
      >
        <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
        <span className="hidden sm:inline">Télécharger</span>
        <span className="sm:hidden">Télécharger</span>
      </Button>
    </div>
  );
};

export default DocumentActions;
