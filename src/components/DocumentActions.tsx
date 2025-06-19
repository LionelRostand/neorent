
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, Eye } from 'lucide-react';
import { DocumentData } from '@/hooks/useDocumentStorage';

interface DocumentActionsProps {
  document: DocumentData | undefined;
  onView: (document: DocumentData) => void;
  onDownload: (document: DocumentData) => void;
}

const DocumentActions: React.FC<DocumentActionsProps> = ({
  document,
  onView,
  onDownload
}) => {
  if (!document) return null;

  return (
    <div className="flex gap-2">
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => onView(document)}
      >
        <Eye className="h-4 w-4 mr-2" />
        Voir
      </Button>
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => onDownload(document)}
      >
        <Download className="h-4 w-4 mr-2" />
        Télécharger
      </Button>
    </div>
  );
};

export default DocumentActions;
