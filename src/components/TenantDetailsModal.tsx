
import React from 'react';
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
  User, 
  Mail, 
  Phone, 
  Home, 
  Calendar, 
  DollarSign,
  FileText,
  Shield,
  ClipboardList,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';

interface Tenant {
  id: number;
  name: string;
  email: string;
  phone: string;
  property: string;
  rentAmount: string;
  nextPayment: string;
  status: string;
  leaseStart: string;
  image: string | null;
}

interface TenantDetailsModalProps {
  tenant: Tenant | null;
  isOpen: boolean;
  onClose: () => void;
}

const TenantDetailsModal: React.FC<TenantDetailsModalProps> = ({ 
  tenant, 
  isOpen, 
  onClose 
}) => {
  if (!tenant) return null;

  // Simuler les documents (normalement viendraient d'une API)
  const documents = {
    contratBail: {
      exists: true,
      name: 'Contrat de bail - Marie Dubois.pdf',
      uploadDate: '2023-06-01'
    },
    assurance: {
      exists: true,
      name: 'Assurance habitation.pdf',
      uploadDate: '2023-05-28'
    },
    etatLieux: {
      exists: false,
      name: null,
      uploadDate: null
    }
  };

  // Calculer le statut de paiement du mois en cours
  const currentDate = new Date();
  const nextPaymentDate = new Date(tenant.nextPayment);
  const isLate = nextPaymentDate < currentDate;
  const isUpcoming = nextPaymentDate.getTime() - currentDate.getTime() <= 7 * 24 * 60 * 60 * 1000; // 7 jours

  const getPaymentStatus = () => {
    if (isLate) {
      return { status: 'En retard', color: 'bg-red-100 text-red-800', icon: XCircle };
    } else if (isUpcoming) {
      return { status: 'À venir', color: 'bg-yellow-100 text-yellow-800', icon: Clock };
    } else {
      return { status: 'À jour', color: 'bg-green-100 text-green-800', icon: CheckCircle };
    }
  };

  const paymentStatus = getPaymentStatus();
  const PaymentIcon = paymentStatus.icon;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Détails du locataire</DialogTitle>
        </DialogHeader>

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
                      <User className="h-10 w-10 text-gray-400" />
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
                        Début bail: {new Date(tenant.leaseStart).toLocaleDateString('fr-FR')}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Statut de paiement */}
            <Card>
              <CardContent className="p-6">
                <h4 className="text-lg font-semibold mb-4">Statut de paiement</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <DollarSign className="mr-2 h-5 w-5 text-blue-600" />
                      <span className="font-medium">Montant du loyer</span>
                    </div>
                    <span className="text-lg font-bold text-blue-600">{tenant.rentAmount}</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <PaymentIcon className="mr-2 h-5 w-5" />
                      <span className="font-medium">Statut du mois</span>
                    </div>
                    <Badge className={paymentStatus.color}>
                      {paymentStatus.status}
                    </Badge>
                  </div>
                </div>
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center text-blue-700">
                    <Calendar className="mr-2 h-4 w-4" />
                    <span className="font-medium">
                      Prochain paiement: {new Date(tenant.nextPayment).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents" className="space-y-6">
            <div className="grid gap-4">
              {/* Contrat de bail */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-8 w-8 text-blue-600" />
                      <div>
                        <h4 className="font-semibold">Contrat de bail</h4>
                        {documents.contratBail.exists ? (
                          <p className="text-sm text-gray-600">
                            {documents.contratBail.name} • Ajouté le {new Date(documents.contratBail.uploadDate).toLocaleDateString('fr-FR')}
                          </p>
                        ) : (
                          <p className="text-sm text-gray-500">Aucun document uploadé</p>
                        )}
                      </div>
                    </div>
                    <Badge variant={documents.contratBail.exists ? 'default' : 'secondary'} 
                           className={documents.contratBail.exists ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                      {documents.contratBail.exists ? 'Disponible' : 'Manquant'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Assurance du bien */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Shield className="h-8 w-8 text-green-600" />
                      <div>
                        <h4 className="font-semibold">Assurance du bien</h4>
                        {documents.assurance.exists ? (
                          <p className="text-sm text-gray-600">
                            {documents.assurance.name} • Ajouté le {new Date(documents.assurance.uploadDate).toLocaleDateString('fr-FR')}
                          </p>
                        ) : (
                          <p className="text-sm text-gray-500">Aucun document uploadé</p>
                        )}
                      </div>
                    </div>
                    <Badge variant={documents.assurance.exists ? 'default' : 'secondary'} 
                           className={documents.assurance.exists ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                      {documents.assurance.exists ? 'Disponible' : 'Manquant'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* État des lieux */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <ClipboardList className="h-8 w-8 text-orange-600" />
                      <div>
                        <h4 className="font-semibold">État des lieux</h4>
                        {documents.etatLieux.exists ? (
                          <p className="text-sm text-gray-600">
                            {documents.etatLieux.name} • Ajouté le {new Date(documents.etatLieux.uploadDate).toLocaleDateString('fr-FR')}
                          </p>
                        ) : (
                          <p className="text-sm text-gray-500">Aucun document uploadé</p>
                        )}
                      </div>
                    </div>
                    <Badge variant={documents.etatLieux.exists ? 'default' : 'secondary'} 
                           className={documents.etatLieux.exists ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                      {documents.etatLieux.exists ? 'Disponible' : 'Manquant'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default TenantDetailsModal;
