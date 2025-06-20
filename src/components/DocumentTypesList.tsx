
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DocumentData } from '@/types/document';
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
    <div className="w-full">
      <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 px-1">
        {t('roommates.documentsOf')} {tenantName}
      </h3>
      
      {loading ? (
        <div className="text-center py-6 sm:py-8">
          <div className="text-sm sm:text-base text-gray-500">Chargement des documents...</div>
        </div>
      ) : (
        <div className="grid gap-3 sm:gap-4">
          {documentTypes.map((docType) => {
            const document = getDocumentByType(docType.key);
            const Icon = docType.icon;
            const documentExists = !!document;
            
            console.log(`Document ${docType.key}:`, { document, documentExists });
            
            return (
              <Card key={docType.key} className="overflow-hidden">
                <CardContent className="p-3 sm:p-4 md:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                    <div className="flex items-start sm:items-center space-x-3 min-w-0 flex-1">
                      <Icon className={`h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 ${docType.color} flex-shrink-0 mt-0.5 sm:mt-0`} />
                      <div className="min-w-0 flex-1">
                        <h4 className="font-semibold text-sm sm:text-base flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                          <span className="break-words">{docType.label}</span>
                          {docType.required && (
                            <Badge variant="outline" className="text-xs w-fit">
                              {t('roommates.required')}
                            </Badge>
                          )}
                        </h4>
                        {document ? (
                          <div className="text-xs sm:text-sm text-gray-600 mt-1 space-y-1">
                            <p className="break-words">Document uploadé • {document.fileName}</p>
                            <p className="text-xs text-gray-500">
                              {new Date(document.uploadDate).toLocaleDateString()} • {formatFileSize(document.fileSize)}
                            </p>
                          </div>
                        ) : (
                          <p className="text-xs sm:text-sm text-gray-500 mt-1">
                            {t('roommates.noDocumentUploaded')}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 sm:flex-shrink-0">
                      <div className="w-full sm:w-auto">
                        <DocumentStatusBadge
                          documentType={docType.key}
                          required={docType.required}
                          documentExists={documentExists}
                        />
                      </div>
                      <div className="w-full sm:w-auto">
                        <DocumentActions
                          document={document}
                          onView={onViewDocument}
                          onDownload={onDownloadDocument}
                        />
                      </div>
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
