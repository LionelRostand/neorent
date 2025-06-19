
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  FileText,
  Shield,
  ClipboardList,
  User,
  CreditCard,
  Home
} from 'lucide-react';
import { useDocumentStorage, DocumentData } from '@/hooks/useDocumentStorage';
import { useToast } from '@/hooks/use-toast';
import DocumentUploadSection from './DocumentUploadSection';
import DocumentTypesList from './DocumentTypesList';

interface DocumentManagerProps {
  roommateId?: string;
  tenantId?: string;
  tenantName?: string;
}

const DocumentManager: React.FC<DocumentManagerProps> = ({
  roommateId,
  tenantId,
  tenantName
}) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [documents, setDocuments] = useState<DocumentData[]>([]);
  
  const { 
    loading, 
    uploading, 
    uploadDocument, 
    getDocuments, 
    downloadDocument
  } = useDocumentStorage();

  const documentTypes = [
    { key: 'bail', icon: FileText, label: t('roommates.documentTypes.bail'), color: 'text-blue-600', required: true },
    { key: 'assurance', icon: Shield, label: t('roommates.documentTypes.assurance'), color: 'text-green-600', required: true },
    { key: 'etatLieuxEntree', icon: ClipboardList, label: t('roommates.documentTypes.etatLieuxEntree'), color: 'text-purple-600', required: true },
    { key: 'revenus', icon: CreditCard, label: t('roommates.documentTypes.revenus'), color: 'text-orange-600', required: true },
    { key: 'identite', icon: User, label: t('roommates.documentTypes.identite'), color: 'text-red-600', required: true },
    { key: 'rib', icon: CreditCard, label: t('roommates.documentTypes.rib'), color: 'text-teal-600', required: true },
    { key: 'garant', icon: User, label: t('roommates.documentTypes.garant'), color: 'text-indigo-600', required: false },
    { key: 'taxeHabitation', icon: Home, label: t('roommates.documentTypes.taxeHabitation'), color: 'text-gray-600', required: false },
    { key: 'etatLieuxSortie', icon: ClipboardList, label: t('roommates.documentTypes.etatLieuxSortie'), color: 'text-orange-600', required: false }
  ];

  useEffect(() => {
    loadDocuments();
  }, [roommateId, tenantId]);

  const loadDocuments = async () => {
    try {
      const docs = await getDocuments(tenantId, roommateId);
      setDocuments(docs);
    } catch (error) {
      console.error('Error loading documents:', error);
    }
  };

  const handleUpload = async (file: File, documentType: string) => {
    const result = await uploadDocument(
      file,
      documentType,
      tenantId,
      roommateId
    );
    
    // Reload documents
    await loadDocuments();
    
    return result;
  };

  const handleDownloadDocument = async (document: DocumentData) => {
    try {
      downloadDocument(document);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors du téléchargement",
        variant: "destructive",
      });
    }
  };

  const handleViewDocument = (document: DocumentData) => {
    try {
      const dataUrl = `data:${document.fileType};base64,${document.fileContent}`;
      window.open(dataUrl, '_blank');
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de l'ouverture du document",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <DocumentUploadSection
        documentTypes={documentTypes}
        onUpload={handleUpload}
        uploading={uploading}
      />

      <DocumentTypesList
        documentTypes={documentTypes}
        documents={documents}
        tenantName={tenantName}
        loading={loading}
        onViewDocument={handleViewDocument}
        onDownloadDocument={handleDownloadDocument}
      />
    </div>
  );
};

export default DocumentManager;
