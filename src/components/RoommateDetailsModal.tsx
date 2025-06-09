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
  FileText,
  Shield,
  ClipboardList,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Bed,
  CreditCard,
  Download,
  Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import DocumentViewer from './DocumentViewer';

interface Roommate {
  id: number;
  name: string;
  email: string;
  phone: string;
  property: string;
  roomNumber: string;
  rentAmount: string;
  status: string;
  primaryTenant: string;
  moveInDate: string;
  image: string | null;
}

interface RoommateDetailsModalProps {
  roommate: Roommate | null;
  isOpen: boolean;
  onClose: () => void;
}

const RoommateDetailsModal: React.FC<RoommateDetailsModalProps> = ({ 
  roommate, 
  isOpen, 
  onClose 
}) => {
  const [selectedDocument, setSelectedDocument] = useState<{name: string, type: string} | null>(null);
  const [isDocumentViewerOpen, setIsDocumentViewerOpen] = useState(false);

  if (!roommate) return null;

  // Simuler les documents étendus pour le colocataire
  const documents = {
    bail: { exists: true, name: `Contrat de bail - ${roommate.name}.pdf`, uploadDate: roommate.moveInDate, status: 'Signé' },
    assurance: { exists: true, name: 'Assurance habitation.pdf', uploadDate: '2023-05-28', status: 'Valide' },
    etatLieuxEntree: { exists: true, name: 'État des lieux entrée chambre.pdf', uploadDate: roommate.moveInDate, status: 'Signé' },
    revenus: { exists: true, name: 'Bulletins de salaire.pdf', uploadDate: '2023-05-25', status: 'Validé' },
    identite: { exists: true, name: 'Carte identité.pdf', uploadDate: '2023-05-20', status: 'Validé' },
    rib: { exists: true, name: 'RIB.pdf', uploadDate: '2023-05-20', status: 'Validé' },
    garant: { exists: false, name: null, uploadDate: null, status: 'Non requis' },
    taxeHabitation: { exists: false, name: null, uploadDate: null, status: 'Optionnel' },
    etatLieuxSortie: { exists: false, name: null, uploadDate: null, status: 'À venir' }
  };

  const documentTypes = [
    { key: 'bail', icon: FileText, label: 'Contrat de colocation', color: 'text-blue-600', required: true },
    { key: 'assurance', icon: Shield, label: 'Assurance habitation', color: 'text-green-600', required: true },
    { key: 'etatLieuxEntree', icon: ClipboardList, label: 'État des lieux chambre', color: 'text-purple-600', required: true },
    { key: 'revenus', icon: CreditCard, label: 'Justificatifs de revenus', color: 'text-orange-600', required: true },
    { key: 'identite', icon: User, label: 'Pièce d\'identité', color: 'text-red-600', required: true },
    { key: 'rib', icon: CreditCard, label: 'RIB', color: 'text-teal-600', required: true },
    { key: 'garant', icon: User, label: 'Documents garant', color: 'text-indigo-600', required: false },
    { key: 'taxeHabitation', icon: Home, label: 'Taxe d\'habitation', color: 'text-gray-600', required: false },
    { key: 'etatLieuxSortie', icon: ClipboardList, label: 'État des lieux sortie chambre', color: 'text-orange-600', required: false }
  ];

  // Calculer le statut de paiement du mois en cours
  const currentDate = new Date();
  const moveInDate = new Date(roommate.moveInDate);
  const nextPaymentDate = new Date(moveInDate.getTime() + 30 * 24 * 60 * 60 * 1000); // +30 jours
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
        return <Badge className="bg-red-100 text-red-800">❌ Manquant</Badge>;
      } else {
        return <Badge variant="secondary">{status}</Badge>;
      }
    }
  };

  const handleViewDocument = (documentName: string, documentType: string) => {
    setSelectedDocument({ name: documentName, type: documentType });
    setIsDocumentViewerOpen(true);
  };

  const handleDownloadDocument = (documentName: string) => {
    // Simuler le téléchargement
    const link = document.createElement('a');
    link.href = '/placeholder.svg'; // En production, utiliser l'URL réelle du document
    link.download = documentName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Détails du colocataire</DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="general">Informations générales</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-6">
              {/* Informations du colocataire */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                      {roommate.image ? (
                        <img 
                          src={roommate.image} 
                          alt={roommate.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <UserCheck className="h-10 w-10 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-semibold text-gray-900 mb-2">{roommate.name}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center text-gray-600">
                          <Mail className="mr-2 h-4 w-4" />
                          {roommate.email}
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Phone className="mr-2 h-4 w-4" />
                          {roommate.phone}
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Home className="mr-2 h-4 w-4" />
                          {roommate.property}
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Bed className="mr-2 h-4 w-4" />
                          {roommate.roomNumber}
                        </div>
                        <div className="flex items-center text-gray-600">
                          <User className="mr-2 h-4 w-4" />
                          Locataire principal: {roommate.primaryTenant}
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Calendar className="mr-2 h-4 w-4" />
                          Emménagement: {new Date(roommate.moveInDate).toLocaleDateString('fr-FR')}
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
                      <span className="text-lg font-bold text-blue-600">{roommate.rentAmount}</span>
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
                        Prochain paiement: {nextPaymentDate.toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="documents" className="space-y-6">
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
                                {docType.required && <Badge variant="outline" className="text-xs">Requis</Badge>}
                              </h4>
                              {document.exists ? (
                                <p className="text-sm text-gray-600">
                                  {document.name} • Ajouté le {new Date(document.uploadDate!).toLocaleDateString('fr-FR')}
                                </p>
                              ) : (
                                <p className="text-sm text-gray-500">Aucun document uploadé</p>
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
                                  onClick={() => handleViewDocument(document.name!, docType.label)}
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
            </TabsContent>
          </Tabs>
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

export default RoommateDetailsModal;
