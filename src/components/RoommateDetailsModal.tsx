import React, { useState, useEffect } from 'react';
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
import RentAlert from './RentAlert';
import DocumentManager from './DocumentManager';

interface Roommate {
  id: number | string;
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
  paidAmount?: number;
}

interface RoommateDetailsModalProps {
  roommate: Roommate | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateRoommate?: (id: string | number, updates: Partial<Roommate>) => Promise<void>;
}

const RoommateDetailsModal: React.FC<RoommateDetailsModalProps> = ({ 
  roommate, 
  isOpen, 
  onClose,
  onUpdateRoommate
}) => {
  const [selectedDocument, setSelectedDocument] = useState<{name: string, type: string} | null>(null);
  const [isDocumentViewerOpen, setIsDocumentViewerOpen] = useState(false);

  const montantAttendu = roommate?.rentAmount ? Number(roommate.rentAmount) : 0;
  const [montantPaye, setMontantPaye] = useState<number>(
    typeof roommate?.paidAmount === 'number' ? roommate.paidAmount : montantAttendu
  );
  const [initialMontantPaye, setInitialMontantPaye] = useState(montantPaye);

  useEffect(() => {
    if (roommate) {
      const initialPaid = typeof roommate.paidAmount === 'number' ? roommate.paidAmount : montantAttendu;
      setMontantPaye(initialPaid);
      setInitialMontantPaye(initialPaid);
    }
  }, [roommate, montantAttendu]);

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const isModified = montantPaye !== initialMontantPaye;

  // Vérifier s'il y a une différence entre le montant attendu et payé
  const hasPaymentDifference = montantPaye !== montantAttendu;

  const calculateNextPaymentDate = (moveInDate: string): Date => {
    const moveIn = new Date(moveInDate);
    const currentDate = new Date();
    
    const nextPayment = new Date(moveIn);
    nextPayment.setMonth(currentDate.getMonth());
    nextPayment.setFullYear(currentDate.getFullYear());
    
    if (nextPayment < currentDate) {
      nextPayment.setMonth(nextPayment.getMonth() + 1);
    }
    
    return nextPayment;
  };

  const documents = roommate
    ? {
        bail: { exists: true, name: `Contrat de bail - ${roommate.name}.pdf`, uploadDate: roommate.moveInDate, status: 'Signé' },
        assurance: { exists: true, name: 'Assurance habitation.pdf', uploadDate: '2023-05-28', status: 'Valide' },
        etatLieuxEntree: { exists: true, name: 'État des lieux entrée chambre.pdf', uploadDate: roommate.moveInDate, status: 'Signé' },
        revenus: { exists: true, name: 'Bulletins de salaire.pdf', uploadDate: '2023-05-25', status: 'Validé' },
        identite: { exists: true, name: 'Carte identité.pdf', uploadDate: '2023-05-20', status: 'Validé' },
        rib: { exists: true, name: 'RIB.pdf', uploadDate: '2023-05-20', status: 'Validé' },
        garant: { exists: false, name: null, uploadDate: null, status: 'Non requis' },
        taxeHabitation: { exists: false, name: null, uploadDate: null, status: 'Optionnel' },
        etatLieuxSortie: { exists: false, name: null, uploadDate: null, status: 'À venir' }
      }
    : {};

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

  const currentDate = new Date();
  const nextPaymentDate = roommate ? calculateNextPaymentDate(roommate.moveInDate) : new Date();
  const isLate = nextPaymentDate < currentDate;
  const isUpcoming = nextPaymentDate.getTime() - currentDate.getTime() <= 7 * 24 * 60 * 60 * 1000;
  
  const getPaymentStatus = () => {
    if (!roommate) return { status: '', color: '', icon: CheckCircle };
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
    const link = document.createElement('a');
    link.href = '/placeholder.svg';
    link.download = documentName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSaveMontantPaye = async () => {
    if (!roommate || !onUpdateRoommate) return;
    setIsSaving(true);
    try {
      await onUpdateRoommate(roommate.id, { paidAmount: montantPaye });
      setInitialMontantPaye(montantPaye);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (error) {
      alert("Erreur lors de l'enregistrement.");
    } finally {
      setIsSaving(false);
    }
  };

  const StatutPaiementDetail = () => {
    const aToutPaye = montantPaye >= montantAttendu;
    const resteAPayer = Math.max(montantAttendu - montantPaye, 0);
    
    // N'afficher le détail du montant payé que s'il y a une différence
    if (!hasPaymentDifference) {
      return (
        <div className="flex flex-col space-y-2 mt-2">
          <div className="flex items-center justify-between bg-green-50 rounded-lg p-3">
            <span className="flex items-center text-green-700">
              <CheckCircle className="h-4 w-4 mr-1" />
              Paiement complet
            </span>
            <span className="text-green-700 font-semibold">{montantAttendu.toLocaleString()}€</span>
          </div>
        </div>
      );
    }
    
    return (
      <div className="flex flex-col space-y-2 mt-2">
        <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
          <span>Montant attendu :</span>
          <span className="font-semibold text-blue-700">{montantAttendu.toLocaleString()}€</span>
        </div>
        <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
          <label htmlFor="montant-paye" className="flex-1">
            Montant payé :
          </label>
          <input
            id="montant-paye"
            type="number"
            min={0}
            max={montantAttendu}
            value={montantPaye}
            onChange={e => setMontantPaye(Number(e.target.value))}
            className="w-28 px-2 py-1 border border-gray-300 rounded text-right font-semibold focus:outline-none focus:ring-2 focus:ring-blue-300 transition text-green-700"
            aria-label="Montant payé"
            disabled={isSaving}
          />
          <span className="ml-2 font-semibold text-green-700">{Number(montantPaye).toLocaleString()}€</span>
        </div>
        <div className={`flex items-center justify-between rounded-lg p-3 ${aToutPaye ? 'bg-green-50' : 'bg-red-50'}`}>
          {aToutPaye ? (
            <>
              <span className="flex items-center text-green-700">
                <CheckCircle className="h-4 w-4 mr-1" />
                Payé en totalité
              </span>
              <span className="text-green-700 font-semibold">✔️</span>
            </>
          ) : (
            <>
              <span className="flex items-center text-red-700">
                <XCircle className="h-4 w-4 mr-1" />
                Reste à verser
              </span>
              <span className="text-red-700 font-semibold">{resteAPayer.toLocaleString()}€</span>
            </>
          )}
        </div>
        <div className="flex items-center mt-2 gap-2">
          {isModified && (
            <button
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none transition"
              onClick={handleSaveMontantPaye}
              disabled={isSaving}
              type="button"
            >
              {isSaving ? "Enregistrement..." : "Enregistrer"}
            </button>
          )}
          {saveSuccess && (
            <span className="text-green-600 font-medium text-sm ml-2">Enregistré !</span>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Détails du colocataire</DialogTitle>
          </DialogHeader>
          {!roommate ? null : (
          <>
            {/* Rent Alert - seulement si il y a une différence de paiement */}
            {hasPaymentDifference && (
              <RentAlert 
                expectedAmount={montantAttendu}
                paidAmount={montantPaye}
                tenantName={roommate.name}
                className="mb-4"
              />
            )}
            
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
                    {/* Affichage conditionnel du détail paiement */}
                    <StatutPaiementDetail />
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

              <TabsContent value="documents" className="space-y-4">
                <DocumentManager
                  roommateId={roommate.id.toString()}
                  tenantName={roommate.name}
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

export default RoommateDetailsModal;
