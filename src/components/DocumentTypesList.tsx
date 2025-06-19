
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DocumentData } from '@/hooks/useDocumentStorage';
import DocumentStatusBadge from './DocumentStatusBadge';
import DocumentActions from './DocumentActions';

interface DocumentType {
  key: string;
  icon: React.ComponentType<any>;
  label: string;
  color: string;
  required: boolean;
}

interface DocumentTypesListProps {
  documentTypes: DocumentType[];
  documents: DocumentData[];
  tenantName?: string;
  loading: boolean;
  onViewDocument: (document: DocumentData) => void;
  onDownloadDocument: (document: DocumentData) => void;
}

const DocumentTypesList: React.FC<DocumentTypesListProps> = ({
  documentTypes,
  documents,
  tenantName,
  loading,
  onViewDocument,
  onDownloadDocument
}) => {
  const { t } = useTranslation();

  const getDocumentByType = (type: string) => {
    return documents.find(doc => doc.documentType === type);
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  console.log('Documents disponibles:', documents);
  console.log('Types de documents:', documentTypes.map(dt => dt.key));

  return (
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
            const documentExists = !!document;
            
            console.log(`Document ${docType.key}:`, { document, documentExists });
            
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
                      <DocumentStatusBadge
                        documentType={docType.key}
                        required={docType.required}
                        documentExists={documentExists}
                      />
                      <DocumentActions
                        document={document}
                        onView={onViewDocument}
                        onDownload={onDownloadDocument}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DocumentTypesList;
