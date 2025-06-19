
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { 
  FileText,
  Shield,
  ClipboardList,
  User,
  CreditCard,
  Home,
  Download,
  Eye,
  Upload
} from 'lucide-react';
import { useDocumentStorage, DocumentData } from '@/hooks/useDocumentStorage';
import { useToast } from '@/hooks/use-toast';

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
  const [selectedDocumentType, setSelectedDocumentType] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documents, setDocuments] = useState<DocumentData[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  
  const { 
    loading, 
    uploading, 
    uploadDocument, 
    getDocuments, 
    downloadDocument, 
    deleteDocument 
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

  // Simuler la progression de l'upload
  useEffect(() => {
    if (uploading) {
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 95) {
            return prev;
          }
          return prev + Math.random() * 10;
        });
      }, 100);

      return () => clearInterval(interval);
    } else {
      setUploadProgress(0);
    }
  }, [uploading]);

  const loadDocuments = async () => {
    try {
      const docs = await getDocuments(tenantId, roommateId);
      setDocuments(docs);
    } catch (error) {
      console.error('Error loading documents:', error);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !selectedDocumentType) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un fichier et un type de document",
        variant: "destructive",
      });
      return;
    }

    try {
      setUploadProgress(0);
      const result = await uploadDocument(
        selectedFile,
        selectedDocumentType,
        tenantId,
        roommateId
      );
      
      setUploadProgress(100);
      setSelectedFile(null);
      setSelectedDocumentType('');
      
      // Reset input
      const input = document.getElementById('file-upload') as HTMLInputElement;
      if (input) input.value = '';
      
      // Reload documents
      await loadDocuments();
      
      toast({
        title: "Succès",
        description: "Document uploadé avec succès",
      });
    } catch (error) {
      console.error('Upload failed:', error);
      setUploadProgress(0);
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
    // Create a blob URL for viewing
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

  const getDocumentByType = (type: string) => {
    return documents.find(doc => doc.documentType === type);
  };

  const getDocumentStatusBadge = (documentType: string, required: boolean) => {
    const document = getDocumentByType(documentType);
    
    if (document) {
      return <Badge className="bg-green-100 text-green-800">✓ Uploadé</Badge>;
    } else {
      if (required) {
        return <Badge className="bg-red-100 text-red-800">❌ {t('roommates.missing')}</Badge>;
      } else {
        return <Badge variant="secondary">Optionnel</Badge>;
      }
    }
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Upload className="h-5 w-5" />
            <h3 className="text-lg font-semibold">{t('roommates.uploadNewDocument')}</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="document-type">{t('roommates.documentType')}</Label>
              <Select value={selectedDocumentType} onValueChange={setSelectedDocumentType}>
                <SelectTrigger>
                  <SelectValue placeholder={t('roommates.selectType')} />
                </SelectTrigger>
                <SelectContent>
                  {documentTypes.map((type) => (
                    <SelectItem key={type.key} value={type.key}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="file-upload">{t('roommates.fileMaxSize')}</Label>
              <Input
                id="file-upload"
                type="file"
                accept="image/*,application/pdf"
                onChange={handleFileSelect}
                disabled={uploading}
                className="cursor-pointer"
              />
              <p className="text-xs text-gray-500 mt-1">
                Taille max: 10 MB • Types autorisés: Images, PDF
              </p>
            </div>

            {selectedFile && (
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <FileText className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">{selectedFile.name}</p>
                    <p className="text-xs text-gray-500">{formatFileSize(selectedFile.size)}</p>
                  </div>
                </div>
                <Button
                  onClick={handleUpload}
                  disabled={uploading || !selectedDocumentType}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {uploading ? (
                    <>
                      <Upload className="h-4 w-4 mr-2 animate-spin" />
                      Upload...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload
                    </>
                  )}
                </Button>
              </div>
            )}

            {uploading && (
              <div className="space-y-2">
                <Progress value={uploadProgress} className="w-full" />
                <p className="text-xs text-center text-gray-500">Upload en cours... {Math.round(uploadProgress)}%</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Documents List */}
      <div>
        <h3 className="text-lg font-semibold mb-4">
          {t('roommates.documentsOf')} {tenantName}
        </h3>
        
        {loading ? (
          <div className="text-center py-4">Chargement des documents...</div>
        ) : (
          <div className="grid gap-4">
            {documentTypes.map((docType) => {
              const document = getDocumentByType(docType.key);
              const Icon = docType.icon;
              
              return (
                <Card key={docType.key}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Icon className={`h-8 w-8 ${docType.color}`} />
                        <div>
                          <h4 className="font-semibold flex items-center gap-2">
                            {docType.label}
                            {docType.required && <Badge variant="outline" className="text-xs">{t('roommates.required')}</Badge>}
                          </h4>
                          {document ? (
                            <p className="text-sm text-gray-600">
                              {document.fileName} • {new Date(document.uploadDate).toLocaleDateString()} • {formatFileSize(document.fileSize)}
                            </p>
                          ) : (
                            <p className="text-sm text-gray-500">{t('roommates.noDocumentUploaded')}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        {getDocumentStatusBadge(docType.key, docType.required)}
                        {document && (
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleViewDocument(document)}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              Voir
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDownloadDocument(document)}
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Télécharger
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentManager;
