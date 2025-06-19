
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import DocumentUploadComponent from './DocumentUploadComponent';

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
  const [selectedDocumentType, setSelectedDocumentType] = useState<string>('');

  // Mock documents data
  const documents = {
    bail: { exists: true, name: `Contrat de bail - ${tenantName}.pdf`, uploadDate: '2023-06-01', status: 'Signé' },
    assurance: { exists: true, name: 'Assurance habitation.pdf', uploadDate: '2023-05-28', status: 'Valide' },
    etatLieuxEntree: { exists: true, name: 'État des lieux entrée.pdf', uploadDate: '2023-06-01', status: 'Signé' },
    revenus: { exists: true, name: 'Bulletins de salaire.pdf', uploadDate: '2023-05-25', status: 'Validé' },
    identite: { exists: true, name: 'Carte identité.pdf', uploadDate: '2023-05-20', status: 'Validé' },
    rib: { exists: true, name: 'RIB.pdf', uploadDate: '2023-05-20', status: 'Validé' },
    garant: { exists: false, name: null, uploadDate: null, status: 'Non requis' },
    taxeHabitation: { exists: false, name: null, uploadDate: null, status: 'Optionnel' },
    etatLieuxSortie: { exists: false, name: null, uploadDate: null, status: 'À venir' }
  };

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

  const getDocumentStatusBadge = (status: string, exists: boolean, required: boolean) => {
    if (exists) {
      switch (status) {
        case 'Signé':
        case 'Valide':
        case 'Validé':
          return <Badge className="bg-green-100 text-green-800">✓ {status}</Badge>;
        default:
          return <Badge className="bg-blue-100 text-blue-800">{status}</Badge>;
      }
    } else {
      if (required) {
        return <Badge className="bg-red-100 text-red-800">❌ {t('roommates.missing')}</Badge>;
      } else {
        return <Badge variant="secondary">{status}</Badge>;
      }
    }
  };

  const handleUploadSuccess = (result: any) => {
    console.log('Document uploaded successfully:', result);
  };

  const handleViewDocument = (documentName: string) => {
    console.log('Viewing document:', documentName);
  };

  const handleDownloadDocument = (documentName: string) => {
    const link = document.createElement('a');
    link.href = '/placeholder.svg';
    link.download = documentName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

            {selectedDocumentType && (
              <DocumentUploadComponent
                folder={`documents/${roommateId || tenantId}`}
                onUploadSuccess={handleUploadSuccess}
                label={t('roommates.fileMaxSize')}
              />
            )}
          </div>
        </CardContent>
      </Card>

      {/* Documents List */}
      <div>
        <h3 className="text-lg font-semibold mb-4">
          {t('roommates.documentsOf')} {tenantName}
        </h3>
        
        <div className="grid gap-4">
          {documentTypes.map((docType) => {
            const document = documents[docType.key as keyof typeof documents];
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
                        {document.exists ? (
                          <p className="text-sm text-gray-600">
                            {document.name} • {new Date(document.uploadDate!).toLocaleDateString()}
                          </p>
                        ) : (
                          <p className="text-sm text-gray-500">{t('roommates.noDocumentUploaded')}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      {getDocumentStatusBadge(document.status, document.exists, docType.required)}
                      {document.exists && (
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleViewDocument(document.name!)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Voir
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDownloadDocument(document.name!)}
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
      </div>
    </div>
  );
};

export default DocumentManager;
