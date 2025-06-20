
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
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

  const currentDate = new Date();
  const nextPaymentDate = roommate ? calculateNextPaymentDate(roommate.moveInDate) : new Date();
  const isLate = nextPaymentDate < currentDate;
  const isUpcoming = nextPaymentDate.getTime() - currentDate.getTime() <= 7 * 24 * 60 * 60 * 1000;
  
  const getPaymentStatus = () => {
    if (!roommate) return { status: '', color: '', icon: CheckCircle };
    if (isLate) {
      return { status: t('roommates.status.late'), color: 'bg-red-100 text-red-800', icon: XCircle };
    } else if (isUpcoming) {
      return { status: t('roommates.status.upcoming'), color: 'bg-yellow-100 text-yellow-800', icon: Clock };
    } else {
      return { status: t('roommates.upToDate'), color: 'bg-green-100 text-green-800', icon: CheckCircle };
    }
  };
  const paymentStatus = getPaymentStatus();
  const PaymentIcon = paymentStatus.icon;

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
    
    if (!hasPaymentDifference) {
      return (
        <div className="flex flex-col space-y-2 mt-2">
          <div className="flex items-center justify-between bg-green-50 rounded-lg p-3">
            <span className="flex items-center text-green-700">
              <CheckCircle className="h-4 w-4 mr-1" />
              {t('roommates.completePayment')}
            </span>
            <span className="text-green-700 font-semibold">{montantAttendu.toLocaleString()}€</span>
          </div>
        </div>
      );
    }
    
    return (
      <div className="flex flex-col space-y-2 mt-2">
        <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
          <span className="text-sm sm:text-base">{t('roommates.expectedAmount')}</span>
          <span className="font-semibold text-blue-700">{montantAttendu.toLocaleString()}€</span>
        </div>
        <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
          <label htmlFor="montant-paye" className="flex-1 text-sm sm:text-base">
            {t('roommates.paidAmount')}
          </label>
          <div className="flex items-center gap-2">
            <input
              id="montant-paye"
              type="number"
              min={0}
              max={montantAttendu}
              value={montantPaye}
              onChange={e => setMontantPaye(Number(e.target.value))}
              className="w-20 sm:w-28 px-2 py-1 border border-gray-300 rounded text-right font-semibold focus:outline-none focus:ring-2 focus:ring-blue-300 transition text-green-700 text-sm"
              aria-label={t('roommates.paidAmount')}
              disabled={isSaving}
            />
            <span className="font-semibold text-green-700 text-sm sm:text-base">{Number(montantPaye).toLocaleString()}€</span>
          </div>
        </div>
        <div className={`flex items-center justify-between rounded-lg p-3 ${aToutPaye ? 'bg-green-50' : 'bg-red-50'}`}>
          {aToutPaye ? (
            <>
              <span className="flex items-center text-green-700 text-sm sm:text-base">
                <CheckCircle className="h-4 w-4 mr-1" />
                {t('roommates.completePayment')}
              </span>
              <span className="text-green-700 font-semibold">✔️</span>
            </>
          ) : (
            <>
              <span className="flex items-center text-red-700 text-sm sm:text-base">
                <XCircle className="h-4 w-4 mr-1" />
                {t('roommates.remainingToPay')}
              </span>
              <span className="text-red-700 font-semibold">{resteAPayer.toLocaleString()}€</span>
            </>
          )}
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center mt-2 gap-2">
          {isModified && (
            <button
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none transition w-full sm:w-auto"
              onClick={handleSaveMontantPaye}
              disabled={isSaving}
              type="button"
            >
              {isSaving ? "Enregistrement..." : "Enregistrer"}
            </button>
          )}
          {saveSuccess && (
            <span className="text-green-600 font-medium text-sm">Enregistré !</span>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="w-[95vw] max-w-4xl h-[95vh] max-h-[95vh] overflow-hidden p-0">
          <div className="flex flex-col h-full">
            <DialogHeader className="px-4 sm:px-6 py-4 border-b flex-shrink-0">
              <DialogTitle className="text-xl sm:text-2xl font-bold">{t('roommates.detailsTitle')}</DialogTitle>
            </DialogHeader>
            
            <div className="flex-1 overflow-y-auto px-4 sm:px-6 pb-4">
              {!roommate ? null : (
              <>
                {hasPaymentDifference && (
                  <RentAlert 
                    expectedAmount={montantAttendu}
                    paidAmount={montantPaye}
                    tenantName={roommate.name}
                    className="mb-4 mt-4"
                  />
                )}
                
                <Tabs defaultValue="general" className="w-full mt-4">
                  <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="general" className="text-xs sm:text-sm">{t('roommates.generalInformation')}</TabsTrigger>
                    <TabsTrigger value="documents" className="text-xs sm:text-sm">{t('roommates.documents')}</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="general" className="space-y-4 sm:space-y-6">
                    <Card>
                      <CardContent className="p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-4">
                          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
                            {roommate.image ? (
                              <img 
                                src={roommate.image} 
                                alt={roommate.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <UserCheck className="h-8 w-8 sm:h-10 sm:w-10 text-gray-400" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2 break-words">{roommate.name}</h3>
                            <div className="grid grid-cols-1 gap-3 sm:gap-4">
                              <div className="flex items-center text-gray-600 text-sm sm:text-base">
                                <Mail className="mr-2 h-4 w-4 flex-shrink-0" />
                                <span className="break-all">{roommate.email}</span>
                              </div>
                              <div className="flex items-center text-gray-600 text-sm sm:text-base">
                                <Phone className="mr-2 h-4 w-4 flex-shrink-0" />
                                <span>{roommate.phone}</span>
                              </div>
                              <div className="flex items-center text-gray-600 text-sm sm:text-base">
                                <Home className="mr-2 h-4 w-4 flex-shrink-0" />
                                <span className="break-words">{t('roommates.apartment')} {roommate.property}</span>
                              </div>
                              <div className="flex items-center text-gray-600 text-sm sm:text-base">
                                <Bed className="mr-2 h-4 w-4 flex-shrink-0" />
                                <span>{roommate.roomNumber}</span>
                              </div>
                              <div className="flex items-center text-gray-600 text-sm sm:text-base">
                                <User className="mr-2 h-4 w-4 flex-shrink-0" />
                                <span className="break-words">{t('roommateForm.primaryTenant')}: {roommate.primaryTenant}</span>
                              </div>
                              <div className="flex items-center text-gray-600 text-sm sm:text-base">
                                <Calendar className="mr-2 h-4 w-4 flex-shrink-0" />
                                <span>{t('roommates.moveIn')} {new Date(roommate.moveInDate).toLocaleDateString('fr-FR')}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4 sm:p-6">
                        <h4 className="text-lg font-semibold mb-4">{t('roommates.paymentStatus')}</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center">
                              <DollarSign className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                              <span className="font-medium text-sm sm:text-base">{t('roommates.rentAmount')}</span>
                            </div>
                            <span className="text-lg font-bold text-blue-600">{roommate.rentAmount}</span>
                          </div>
                          <div className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center">
                              <PaymentIcon className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                              <span className="font-medium text-sm sm:text-base">{t('roommates.monthlyStatus')}</span>
                            </div>
                            <Badge className={paymentStatus.color}>
                              {paymentStatus.status}
                            </Badge>
                          </div>
                        </div>
                        <StatutPaiementDetail />
                        <div className="mt-4 p-3 sm:p-4 bg-blue-50 rounded-lg">
                          <div className="flex items-center text-blue-700">
                            <Calendar className="mr-2 h-4 w-4" />
                            <span className="font-medium text-sm sm:text-base">
                              {t('roommates.nextPayment')} {nextPaymentDate.toLocaleDateString('fr-FR')}
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
            </div>
          </div>
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
