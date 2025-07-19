
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Download, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';

const DocumentsSection: React.FC = () => {
  const { t } = useTranslation();

  const mockDocuments = [
    {
      id: 1,
      name: 'Contrat de bail',
      type: 'PDF',
      size: '2.3 MB',
      uploadDate: '2024-01-15',
      category: 'Contract'
    },
    {
      id: 2,
      name: 'État des lieux entrée',
      type: 'PDF',
      size: '1.8 MB',
      uploadDate: '2024-01-15',
      category: 'Inspection'
    },
    {
      id: 3,
      name: 'Quittance de loyer - Janvier',
      type: 'PDF',
      size: '0.5 MB',
      uploadDate: '2024-02-01',
      category: 'Receipt'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {t('tenantSpace.documents.title')}
        </h2>
        <p className="text-gray-600">
          {t('tenantSpace.documents.description')}
        </p>
      </div>

      <div className="grid gap-4">
        {mockDocuments.map((document) => (
          <Card key={document.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{document.name}</h3>
                    <p className="text-sm text-gray-500">
                      {document.type} • {document.size} • {new Date(document.uploadDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DocumentsSection;
