
import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  Upload, 
  FileText, 
  Shield, 
  ClipboardList,
  CreditCard,
  User,
  Home,
  CheckCircle,
  AlertTriangle,
  Eye,
  Trash2
} from 'lucide-react';

interface Document {
  id: string;
  type: string;
  name: string;
  uploadDate: string;
  status: 'uploaded' | 'pending' | 'expired';
  required: boolean;
  description: string;
}

const DocumentUpload = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
  
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: '1',
      type: 'lease',
      name: t('tenantSpace.upload.lease') + '.pdf',
      uploadDate: '2023-06-01',
      status: 'uploaded',
      required: true,
      description: t('tenantSpace.upload.leaseSignedDescription')
    },
    {
      id: '2',
      type: 'insurance',
      name: t('tenantSpace.upload.insurance') + '.pdf',
      uploadDate: '2023-06-15',
      status: 'uploaded',
      required: true,
      description: t('tenantSpace.upload.insuranceDescription')
    },
    {
      id: '3',
      type: 'moveInInspection',
      name: '',
      uploadDate: '',
      status: 'pending',
      required: true,
      description: t('tenantSpace.upload.inspectionDescription')
    },
    {
      id: '4',
      type: 'incomeProof',
      name: '',
      uploadDate: '',
      status: 'pending',
      required: true,
      description: t('tenantSpace.upload.incomeDescription')
    },
    {
      id: '5',
      type: 'identity',
      name: t('tenantSpace.upload.identity') + '.pdf',
      uploadDate: '2023-05-28',
      status: 'uploaded',
      required: true,
      description: t('tenantSpace.upload.identityDescription')
    },
    {
      id: '6',
      type: 'bankDetails',
      name: '',
      uploadDate: '',
      status: 'pending',
      required: true,
      description: t('tenantSpace.upload.bankDescription')
    },
    {
      id: '7',
      type: 'guarantor',
      name: '',
      uploadDate: '',
      status: 'pending',
      required: false,
      description: t('tenantSpace.upload.guarantorDescription')
    },
    {
      id: '8',
      type: 'housingTax',
      name: '',
      uploadDate: '',
      status: 'pending',
      required: false,
      description: t('tenantSpace.upload.taxDescription')
    }
  ]);

  const documentTypes = {
    lease: { icon: FileText, color: 'text-blue-600', label: t('tenantSpace.upload.lease') },
    insurance: { icon: Shield, color: 'text-green-600', label: t('tenantSpace.upload.insurance') },
    moveInInspection: { icon: ClipboardList, color: 'text-purple-600', label: t('tenantSpace.upload.moveInInspection') },
    incomeProof: { icon: CreditCard, color: 'text-orange-600', label: t('tenantSpace.upload.incomeProof') },
    identity: { icon: User, color: 'text-red-600', label: t('tenantSpace.upload.identity') },
    bankDetails: { icon: CreditCard, color: 'text-teal-600', label: t('tenantSpace.upload.bankDetails') },
    guarantor: { icon: User, color: 'text-indigo-600', label: t('tenantSpace.upload.guarantor') },
    housingTax: { icon: Home, color: 'text-gray-600', label: t('tenantSpace.upload.housingTax') }
  };

  const handleFileUpload = (documentType: string, file: File) => {
    console.log('Upload du fichier:', file.name, 'pour le type:', documentType);
    
    setDocuments(prev => prev.map(doc => 
      doc.type === documentType 
        ? { 
            ...doc, 
            name: file.name, 
            uploadDate: new Date().toISOString().split('T')[0],
            status: 'uploaded' as const
          }
        : doc
    ));

    toast({
      title: t('tenantSpace.upload.uploadSuccess'),
      description: `${file.name} ${t('tenantSpace.upload.uploadSuccess').toLowerCase()}.`,
    });
  };

  const handleFileDelete = (documentType: string) => {
    setDocuments(prev => prev.map(doc => 
      doc.type === documentType 
        ? { 
            ...doc, 
            name: '', 
            uploadDate: '',
            status: 'pending' as const
          }
        : doc
    ));

    toast({
      title: t('tenantSpace.documents.deleteSuccess'),
      description: t('tenantSpace.documents.deleteSuccess'),
    });
  };

  const triggerFileInput = (documentType: string) => {
    const input = fileInputRefs.current[documentType];
    if (input) {
      input.click();
    }
  };

  const getStatusBadge = (status: string, required: boolean) => {
    const className = `text-xs ${isMobile ? 'px-2 py-1' : ''}`;
    switch (status) {
      case 'uploaded':
        return <Badge className={`bg-green-100 text-green-800 ${className}`}>✓ {t('tenantSpace.upload.uploaded')}</Badge>;
      case 'pending':
        return <Badge className={`${required ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'} ${className}`}>
          {required ? `⚠️ ${t('tenantSpace.upload.required')}` : `📋 ${t('tenantSpace.upload.optional')}`}
        </Badge>;
      case 'expired':
        return <Badge variant="destructive" className={className}>⚠️ {t('tenantSpace.upload.expired')}</Badge>;
      default:
        return <Badge variant="secondary" className={className}>{status}</Badge>;
    }
  };

  const requiredDocuments = documents.filter(doc => doc.required);
  const optionalDocuments = documents.filter(doc => !doc.required);
  const uploadedCount = documents.filter(doc => doc.status === 'uploaded').length;
  const requiredCount = requiredDocuments.length;
  const pendingRequired = requiredDocuments.filter(doc => doc.status === 'pending').length;

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Document Status Summary */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-4 md:p-6">
          <div className={`flex ${isMobile ? 'flex-col space-y-3' : 'items-center justify-between'}`}>
            <div>
              <h3 className="font-semibold text-blue-900 text-sm md:text-base">{t('tenantSpace.upload.documentStatus')}</h3>
              <p className="text-blue-700 text-xs md:text-sm">
                {uploadedCount} {t('tenantSpace.upload.uploadedCount')} {t('tenantSpace.upload.on')} {documents.length}
                {pendingRequired > 0 && ` • ${pendingRequired} ${t('tenantSpace.upload.missingCount')}`}
              </p>
            </div>
            <div className={`flex ${isMobile ? 'justify-between' : 'space-x-4'}`}>
              <div className="text-center">
                <div className="text-xl md:text-2xl font-bold text-green-600">{uploadedCount}</div>
                <div className="text-xs text-green-700">{t('tenantSpace.upload.uploaded')}</div>
              </div>
              <div className="text-center">
                <div className="text-xl md:text-2xl font-bold text-red-600">{pendingRequired}</div>
                <div className="text-xs text-red-700">{t('tenantSpace.upload.missingCount')}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mandatory Documents */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
            <AlertTriangle className="h-4 w-4 md:h-5 md:w-5 text-red-500" />
            {t('tenantSpace.upload.mandatoryDocuments')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:gap-4">
            {requiredDocuments.map((document) => {
              const docType = documentTypes[document.type as keyof typeof documentTypes];
              const Icon = docType?.icon || FileText;
              
              return (
                <div key={document.id} className={`p-3 md:p-4 border rounded-lg ${document.status === 'pending' ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}`}>
                  <div className={`flex ${isMobile ? 'flex-col space-y-3' : 'items-center justify-between'}`}>
                    <div className="flex items-start space-x-3">
                      <Icon className={`h-6 w-6 md:h-8 md:w-8 ${docType?.color || 'text-gray-500'} flex-shrink-0 mt-1`} />
                      <div className="min-w-0 flex-1">
                        <h3 className="font-medium text-sm md:text-base">{docType?.label || document.type}</h3>
                        <p className="text-xs md:text-sm text-gray-600 mt-1">{document.description}</p>
                        {document.name && (
                          <p className="text-xs text-gray-500 mt-1">
                            {t('tenantSpace.upload.file')}: {document.name} • {t('tenantSpace.upload.uploaded')} {new Date(document.uploadDate).toLocaleDateString('en-US')}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className={`flex ${isMobile ? 'justify-between items-center' : 'items-center space-x-3'}`}>
                      {getStatusBadge(document.status, document.required)}
                      
                      {document.status === 'uploaded' ? (
                        <div className={`flex ${isMobile ? 'space-x-2' : 'gap-2'}`}>
                          <Button variant="outline" size="sm" className={isMobile ? 'text-xs px-2' : ''}>
                            <Eye className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                            {t('tenantSpace.upload.view')}
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleFileDelete(document.type)}
                            className={`text-red-600 hover:text-red-700 ${isMobile ? 'text-xs px-2' : ''}`}
                          >
                            <Trash2 className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                            {t('tenantSpace.upload.delete')}
                          </Button>
                        </div>
                      ) : (
                        <div className={`flex ${isMobile ? 'flex-col space-y-2' : 'items-center gap-3'}`}>
                          <Input 
                            type="file" 
                            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" 
                            className={`${isMobile ? 'text-xs' : 'w-48'}`}
                            ref={(el) => (fileInputRefs.current[document.type] = el)}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleFileUpload(document.type, file);
                            }}
                          />
                          <Button 
                            className={`bg-blue-600 hover:bg-blue-700 ${isMobile ? 'w-full text-xs' : ''}`}
                            size={isMobile ? "sm" : "default"}
                            onClick={() => triggerFileInput(document.type)}
                          >
                            <Upload className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                            {t('tenantSpace.upload.upload')}
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Optional Documents */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
            <CheckCircle className="h-4 w-4 md:h-5 md:w-5 text-blue-500" />
            {t('tenantSpace.upload.optionalDocuments')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:gap-4">
            {optionalDocuments.map((document) => {
              const docType = documentTypes[document.type as keyof typeof documentTypes];
              const Icon = docType?.icon || FileText;
              
              return (
                <div key={document.id} className="p-3 md:p-4 border rounded-lg border-gray-200 bg-gray-50">
                  <div className={`flex ${isMobile ? 'flex-col space-y-3' : 'items-center justify-between'}`}>
                    <div className="flex items-start space-x-3">
                      <Icon className={`h-6 w-6 md:h-8 md:w-8 ${docType?.color || 'text-gray-500'} flex-shrink-0 mt-1`} />
                      <div className="min-w-0 flex-1">
                        <h3 className="font-medium text-sm md:text-base">{docType?.label || document.type}</h3>
                        <p className="text-xs md:text-sm text-gray-600 mt-1">{document.description}</p>
                        {document.name && (
                          <p className="text-xs text-gray-500 mt-1">
                            {t('tenantSpace.upload.file')}: {document.name} • {t('tenantSpace.upload.uploaded')} {new Date(document.uploadDate).toLocaleDateString('en-US')}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className={`flex ${isMobile ? 'justify-between items-center' : 'items-center space-x-3'}`}>
                      {getStatusBadge(document.status, document.required)}
                      
                      {document.status === 'uploaded' ? (
                        <div className={`flex ${isMobile ? 'space-x-2' : 'gap-2'}`}>
                          <Button variant="outline" size="sm" className={isMobile ? 'text-xs px-2' : ''}>
                            <Eye className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                            {t('tenantSpace.upload.view')}
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleFileDelete(document.type)}
                            className={`text-red-600 hover:text-red-700 ${isMobile ? 'text-xs px-2' : ''}`}
                          >
                            <Trash2 className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                            {t('tenantSpace.upload.delete')}
                          </Button>
                        </div>
                      ) : (
                        <div className={`flex ${isMobile ? 'flex-col space-y-2' : 'items-center gap-3'}`}>
                          <Input 
                            type="file" 
                            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" 
                            className={`${isMobile ? 'text-xs' : 'w-48'}`}
                            ref={(el) => (fileInputRefs.current[document.type] = el)}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleFileUpload(document.type, file);
                            }}
                          />
                          <Button 
                            variant="outline"
                            className={`${isMobile ? 'w-full text-xs' : ''}`}
                            size={isMobile ? "sm" : "default"}
                            onClick={() => triggerFileInput(document.type)}
                          >
                            <Upload className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                            {t('tenantSpace.upload.upload')}
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Important Instructions */}
      <Card className="border-yellow-200 bg-yellow-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-yellow-800 text-lg md:text-xl">
            <AlertTriangle className="h-4 w-4 md:h-5 md:w-5" />
            {t('tenantSpace.upload.importantInstructions')}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-yellow-700">
          <ul className="space-y-2 text-xs md:text-sm">
            <li>• {t('tenantSpace.upload.allRequiredDocuments')}</li>
            <li>• {t('tenantSpace.upload.acceptedFormats')}</li>
            <li>• {t('tenantSpace.upload.maxFileSize')}</li>
            <li>• {t('tenantSpace.upload.documentsReadable')}</li>
            <li>• {t('tenantSpace.upload.insuranceCoverage')}</li>
            <li>• {t('tenantSpace.upload.incomeProofRecent')}</li>
            <li>• {t('tenantSpace.upload.contactManager')}</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentUpload;
