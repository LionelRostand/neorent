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
      if (!tenantId && !roommateId) {
        console.log('❌ No tenantId or roommateId provided for document loading');
        return;
      }
      
      console.log('🔄 Chargement des documents pour:', { tenantId, roommateId });
      const docs = await getDocuments(tenantId, roommateId);
      console.log('📄 Documents chargés:', docs.length, 'documents trouvés');
      docs.forEach((doc, index) => {
        console.log(`  Document ${index + 1}:`, {
          id: doc.id,
          fileName: doc.fileName,
          documentType: doc.documentType,
          uploadDate: doc.uploadDate
        });
      });
      setDocuments(docs);
    } catch (error) {
      console.error('❌ Error loading documents:', error);
    }
  };

  const handleUpload = async (file: File, documentType: string): Promise<void> => {
    console.log('🚀 === DÉBUT HANDLEUPLOAD ===');
    console.log('Paramètres handleUpload:', {
      fileName: file.name,
      fileSize: file.size,
      documentType,
      tenantId,
      roommateId,
      tenantName
    });

    try {
      if (!tenantId && !roommateId) {
        console.error('❌ Aucun ID disponible pour l\'upload');
        toast({
          title: "Erreur",
          description: "Aucun locataire ou colocataire sélectionné",
          variant: "destructive",
        });
        return;
      }

      if (!roommateId) {
        console.error('❌ RoommateId manquant pour l\'upload');
        toast({
          title: "Erreur",
          description: "ID du colocataire manquant",
          variant: "destructive",
        });
        return;
      }

      console.log('📤 Appel de uploadDocument avec:', { 
        tenantId: tenantId || 'undefined', 
        roommateId: roommateId || 'undefined', 
        documentType,
        fileName: file.name 
      });

      const uploadedDoc = await uploadDocument(
        file,
        documentType,
        tenantId || undefined,
        roommateId || undefined
      );
      
      console.log('✅ Upload terminé, document retourné:', uploadedDoc.id);
      
      await loadDocuments();
      
      toast({
        title: "Succès",
        description: "Document uploadé avec succès",
      });

      console.log('🚀 === FIN HANDLEUPLOAD (SUCCÈS) ===');
    } catch (error) {
      console.error('❌ Upload failed in handleUpload:', error);
      console.error('Détails de l\'erreur:', {
        name: error.name,
        message: error.message
      });
      toast({
        title: "Erreur",
        description: `Erreur lors de l'upload: ${error.message}`,
        variant: "destructive",
      });
      console.log('🚀 === FIN HANDLEUPLOAD (ERREUR) ===');
    }
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
      // Utiliser l'URL de téléchargement Firebase Storage
      window.open(document.downloadURL, '_blank');
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
