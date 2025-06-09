
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DocumentViewer from './DocumentViewer';
import TenantGeneralInfo from './TenantDetails/TenantGeneralInfo';
import TenantDocumentsTab from './TenantDetails/TenantDocumentsTab';

interface Tenant {
  id: number;
  name: string;
  email: string;
  phone: string;
  property: string;
  rentAmount: string;
  nextPayment: string;
  status: string;
  leaseStart: string;
  image: string | null;
}

interface TenantDetailsModalProps {
  tenant: Tenant | null;
  isOpen: boolean;
  onClose: () => void;
}

const TenantDetailsModal: React.FC<TenantDetailsModalProps> = ({ 
  tenant, 
  isOpen, 
  onClose 
}) => {
  const [selectedDocument, setSelectedDocument] = useState<{name: string, type: string} | null>(null);
  const [isDocumentViewerOpen, setIsDocumentViewerOpen] = useState(false);

  if (!tenant) return null;

  const handleViewDocument = (documentName: string, documentType: string) => {
    setSelectedDocument({ name: documentName, type: documentType });
    setIsDocumentViewerOpen(true);
  };

  const handleDownloadDocument = (documentName: string) => {
    // Simuler le téléchargement
    const link = document.createElement('a');
    link.href = '/placeholder.svg'; // En production, utiliser l'URL réelle du document
    link.download = documentName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Détails du locataire</DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="general">Informations générales</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-6">
              <TenantGeneralInfo tenant={tenant} />
            </TabsContent>

            <TabsContent value="documents" className="space-y-6">
              <TenantDocumentsTab 
                onViewDocument={handleViewDocument}
                onDownloadDocument={handleDownloadDocument}
              />
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      <DocumentViewer
        isOpen={isDocumentViewerOpen}
        onClose={() => setIsDocumentViewerOpen(false)}
        documentName={selectedDocument?.name || ''}
        documentType={selectedDocument?.type || ''}
      />
    </>
  );
};

export default TenantDetailsModal;
