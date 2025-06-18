
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  UserCheck, 
  Mail, 
  Phone, 
  Home, 
  Calendar, 
  DollarSign,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import DocumentViewer from './DocumentViewer';
import DocumentManager from './DocumentManager';
import RentAlert from './RentAlert';
import PaymentStatusCard from './TenantDetails/PaymentStatusCard';

interface TenantModalData {
  id: string;
  name: string;
  email: string;
  phone: string;
  property: string;
  rentAmount: string;
  nextPayment: string;
  status: string;
  leaseStart: string;
  image: string | null;
  paidAmount?: number;
}

interface TenantDetailsModalProps {
  tenant: TenantModalData | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateTenant?: (id: string, updates: Partial<TenantModalData>) => Promise<void>;
}

const TenantDetailsModal: React.FC<TenantDetailsModalProps> = ({ 
  tenant, 
  isOpen, 
  onClose,
  onUpdateTenant
}) => {
  const [selectedDocument, setSelectedDocument] = useState<{name: string, type: string} | null>(null);
  const [isDocumentViewerOpen, setIsDocumentViewerOpen] = useState(false);

  const montantAttendu = tenant?.rentAmount ? Number(tenant.rentAmount) : 0;
  const montantPaye = typeof tenant?.paidAmount === 'number' ? tenant.paidAmount : montantAttendu;
  const hasPaymentDifference = montantPaye !== montantAttendu;

  const currentDate = new Date();
  const nextPaymentDate = tenant ? new Date(tenant.nextPayment) : new Date();
  const isLate = nextPaymentDate < currentDate;
  const isUpcoming = nextPaymentDate.getTime() - currentDate.getTime() <= 7 * 24 * 60 * 60 * 1000;
  
  const getPaymentStatus = () => {
    if (!tenant) return { status: '', color: '', icon: CheckCircle };
    if (isLate) {
      return { status: 'En retard', color: 'bg-red-100 text-red-800', icon: XCircle };
    } else if (isUpcoming) {
      return { status: 'À venir', color: 'bg-yellow-100 text-yellow-800', icon: Clock };
    } else {
      return { status: 'À jour', color: 'bg-green-100 text-green-800', icon: CheckCircle };
    }
  };

  const paymentStatus = getPaymentStatus();

  const handleViewDocument = (documentName: string, documentType: string) => {
    setSelectedDocument({ name: documentName, type: documentType });
    setIsDocumentViewerOpen(true);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Détails du locataire</DialogTitle>
          </DialogHeader>
          {!tenant ? null : (
          <>
            {/* Rent Alert - seulement si il y a une différence de paiement */}
            {hasPaymentDifference && (
              <RentAlert 
                expectedAmount={montantAttendu}
                paidAmount={montantPaye}
                tenantName={tenant.name}
                className="mb-4"
              />
            )}
            
            <Tabs defaultValue="general" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="general">Informations générales</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
              </TabsList>
              
              <TabsContent value="general" className="space-y-6">
                {/* Informations du locataire */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                        {tenant.image ? (
                          <img 
                            src={tenant.image} 
                            alt={tenant.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <UserCheck className="h-10 w-10 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-semibold text-gray-900 mb-2">{tenant.name}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex items-center text-gray-600">
                            <Mail className="mr-2 h-4 w-4" />
                            {tenant.email}
                          </div>
                          <div className="flex items-center text-gray-600">
                            <Phone className="mr-2 h-4 w-4" />
                            {tenant.phone}
                          </div>
                          <div className="flex items-center text-gray-600">
                            <Home className="mr-2 h-4 w-4" />
                            {tenant.property}
                          </div>
                          <div className="flex items-center text-gray-600">
                            <Calendar className="mr-2 h-4 w-4" />
                            Début du bail: {new Date(tenant.leaseStart).toLocaleDateString('fr-FR')}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Statut de paiement - utilisez PaymentStatusCard directement */}
                <Card>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="flex items-center space-x-3">
                        <DollarSign className="h-8 w-8 text-blue-600" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">Loyer mensuel</p>
                          <p className="text-2xl font-semibold text-gray-900">{tenant.rentAmount}€</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Calendar className="h-8 w-8 text-orange-600" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">Prochaine échéance</p>
                          <p className="text-lg font-semibold text-gray-900">
                            {new Date(tenant.nextPayment).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <paymentStatus.icon className="h-8 w-8 text-gray-600" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">Statut</p>
                          <Badge className={paymentStatus.color}>
                            {paymentStatus.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="documents" className="space-y-4">
                <DocumentManager
                  tenantId={tenant.id}
                  tenantName={tenant.name}
                />
              </TabsContent>
            </Tabs>
          </>
          )}
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
