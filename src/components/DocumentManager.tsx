
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  Download, 
  Eye, 
  Trash2, 
  FileText, 
  Shield,
  ClipboardList,
  User,
  CreditCard,
  Home,
  AlertCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useDocumentStorage, DocumentData } from '@/hooks/useDocumentStorage';

interface DocumentManagerProps {
  tenantId?: string;
  roommateId?: string;
  tenantName: string;
}

const DocumentManager: React.FC<DocumentManagerProps> = ({
  tenantId,
  roommateId,
  tenantName
}) => {
  const [documents, setDocuments] = useState<DocumentData[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedDocumentType, setSelectedDocumentType] = useState('');
  
  const { toast } = useToast();
  const { 
    loading, 
    uploading, 
    uploadDocument, 
    getDocuments, 
    downloadDocument, 
    deleteDocument,
    updateDocumentStatus 
  } = useDocumentStorage();

  const documentTypes = [
    { value: 'bail', label: 'Contrat de bail', icon: FileText, required: true },
    { value: 'assurance', label: 'Assurance habitation', icon: Shield, required: true },
    { value: 'etatLieuxEntree', label: 'État des lieux d\'entrée', icon: ClipboardList, required: true },
    { value: 'revenus', label: 'Justificatifs de revenus', icon: CreditCard, required: true },
    { value: 'identite', label: 'Pièce d\'identité', icon: User, required: true },
    { value: 'rib', label: 'RIB', icon: CreditCard, required: true },
    { value: 'garant', label: 'Documents garant', icon: User, required: false },
    { value: 'taxeHabitation', label: 'Taxe d\'habitation', icon: Home, required: false },
    { value: 'etatLieuxSortie', label: 'État des lieux de sortie', icon: ClipboardList, required: false }
  ];

  useEffect(() => {
    loadDocuments();
  }, [tenantId, roommateId]);

  const loadDocuments = async () => {
    try {
      const docs = await getDocuments(tenantId, roommateId);
      setDocuments(docs);
    } catch (error) {
      console.error('Erreur lors du chargement des documents:', error);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Vérifier la taille (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "Fichier trop volumineux",
          description: "Le fichier ne doit pas dépasser 10MB.",
          variant: "destructive",
        });
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !selectedDocumentType) {
      toast({
        title: "Informations manquantes",
        description: "Veuillez sélectionner un fichier et un type de document.",
        variant: "destructive",
      });
      return;
    }

    try {
      await uploadDocument(selectedFile, selectedDocumentType, tenantId, roommateId);
      
      toast({
        title: "Document uploadé",
        description: "Le document a été uploadé avec succès.",
      });
      
      setSelectedFile(null);
      setSelectedDocumentType('');
      loadDocuments();
    } catch (error) {
      toast({
        title: "Erreur d'upload",
        description: "Erreur lors de l'upload du document.",
        variant: "destructive",
      });
    }
  };

  const handleDownload = async (document: DocumentData) => {
    try {
      downloadDocument(document);
      toast({
        title: "Téléchargement en cours",
        description: `Téléchargement de ${document.fileName}`,
      });
    } catch (error) {
      toast({
        title: "Erreur de téléchargement",
        description: "Erreur lors du téléchargement du document.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (documentId: string, fileName: string) => {
    if (window.confirm(`Supprimer le document ${fileName} ?`)) {
      try {
        await deleteDocument(documentId);
        toast({
          title: "Document supprimé",
          description: "Le document a été supprimé avec succès.",
        });
        loadDocuments();
      } catch (error) {
        toast({
          title: "Erreur de suppression",
          description: "Erreur lors de la suppression du document.",
          variant: "destructive",
        });
      }
    }
  };

  const getDocumentByType = (type: string) => {
    return documents.find(doc => doc.documentType === type);
  };

  return (
    <div className="space-y-6">
      {/* Section d'upload */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Uploader un nouveau document
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Type de document</label>
            <select
              value={selectedDocumentType}
              onChange={(e) => setSelectedDocumentType(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">Sélectionner un type</option>
              {documentTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Fichier (max 10MB)</label>
            <Input
              type="file"
              onChange={handleFileSelect}
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
            />
          </div>
          
          {selectedFile && (
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-sm">
                <strong>Fichier sélectionné:</strong> {selectedFile.name}
              </p>
              <p className="text-xs text-gray-600">
                Taille: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          )}
          
          <Button 
            onClick={handleUpload} 
            disabled={!selectedFile || !selectedDocumentType || uploading}
            className="w-full"
          >
            {uploading ? 'Upload en cours...' : 'Uploader le document'}
          </Button>
        </CardContent>
      </Card>

      {/* Liste des documents */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Documents de {tenantName}</h3>
        
        {documentTypes.map((docType) => {
          const document = getDocumentByType(docType.value);
          const Icon = docType.icon;
          
          return (
            <Card key={docType.value}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Icon className="h-6 w-6 text-blue-600" />
                    <div>
                      <h4 className="font-medium flex items-center gap-2">
                        {docType.label}
                        {docType.required && <Badge variant="outline" className="text-xs">Requis</Badge>}
                      </h4>
                      {document ? (
                        <p className="text-sm text-gray-600">
                          {document.fileName} • {(document.fileSize / 1024).toFixed(2)} KB
                          <br />
                          Uploadé le {new Date(document.uploadDate).toLocaleDateString('fr-FR')}
                        </p>
                      ) : (
                        <p className="text-sm text-gray-500">Aucun document uploadé</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {document ? (
                      <>
                        <Badge className="bg-green-100 text-green-800">
                          ✓ {document.status}
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownload(document)}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Télécharger
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(document.id!, document.fileName)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Supprimer
                        </Button>
                      </>
                    ) : (
                      docType.required && (
                        <Badge className="bg-red-100 text-red-800">
                          ❌ Manquant
                        </Badge>
                      )
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {loading && (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Chargement des documents...</p>
        </div>
      )}
    </div>
  );
};

export default DocumentManager;
