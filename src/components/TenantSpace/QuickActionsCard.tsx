
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { CreditCard, Home, Mail, User, Banknote, History, Wallet } from 'lucide-react';
import MaintenanceRequestForm from '../Maintenance/MaintenanceRequestForm';
import PaymentDialog from './PaymentDialog';

interface QuickActionsCardProps {
  onTabChange: (tab: string) => void;
  onViewChange?: (view: 'overview' | 'profile') => void;
}

const QuickActionsCard: React.FC<QuickActionsCardProps> = ({ onTabChange, onViewChange }) => {
  const { i18n } = useTranslation();
  const [maintenanceDialogOpen, setMaintenanceDialogOpen] = useState(false);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [bankTransferDialogOpen, setBankTransferDialogOpen] = useState(false);
  const [messageDialogOpen, setMessageDialogOpen] = useState(false);

  // Get texts based on current language
  const getLocalizedText = (key: string) => {
    const currentLang = i18n.language;
    
    const texts: Record<string, Record<string, string>> = {
      quickActionsTitle: {
        fr: 'Actions rapides',
        en: 'Quick Actions'
      },
      payments: {
        fr: 'Paiements',
        en: 'Payments'
      },
      maintenance: {
        fr: 'Maintenance',
        en: 'Maintenance'
      },
      messages: {
        fr: 'Messages',
        en: 'Messages'
      },
      profile: {
        fr: 'Profil',
        en: 'Profile'
      },
      newRequest: {
        fr: 'Nouvelle demande',
        en: 'New Request'
      },
      paymentOptions: {
        fr: 'Options de paiement',
        en: 'Payment Options'
      },
      newMessage: {
        fr: 'Nouveau message',
        en: 'New Message'
      },
      bankTransfer: {
        fr: 'Virement bancaire',
        en: 'Bank Transfer'
      },
      cashPayment: {
        fr: 'Paiement en espèces',
        en: 'Cash Payment'
      },
      onlinePayment: {
        fr: 'Paiement en ligne',
        en: 'Online Payment'
      },
      paymentHistory: {
        fr: 'Historique des paiements',
        en: 'Payment History'
      },
      sendMessage: {
        fr: 'Envoyer un message',
        en: 'Send Message'
      },
      subject: {
        fr: 'Sujet',
        en: 'Subject'
      },
      message: {
        fr: 'Message',
        en: 'Message'
      },
      send: {
        fr: 'Envoyer',
        en: 'Send'
      },
      cancel: {
        fr: 'Annuler',
        en: 'Cancel'
      },
      declareBankTransfer: {
        fr: "Déclarer un virement bancaire effectué",
        en: 'Declare completed bank transfer'
      },
      declareCashPayment: {
        fr: 'Déclarer un paiement en espèces',
        en: 'Declare cash payment'
      },
      payOnlineByCard: {
        fr: 'Payer en ligne par carte',
        en: 'Pay online by card'
      },
      consultPaymentHistory: {
        fr: "Consulter l'historique des paiements",
        en: 'View payment history'
      }
    };

    return texts[key]?.[currentLang] || texts[key]?.['fr'] || key;
  };

  const handlePaymentsClick = () => {
    console.log('Ouverture du menu des options de paiement');
    setPaymentDialogOpen(true);
  };

  const handleMessagesClick = () => {
    setMessageDialogOpen(true);
  };

  const handleProfileClick = () => {
    if (onViewChange) {
      onViewChange('profile');
    } else {
      onTabChange('overview');
    }
  };

  const handlePaymentHistoryClick = () => {
    console.log('Redirection vers historique des paiements');
    onTabChange('history');
    setPaymentDialogOpen(false);
  };

  const handleBankTransferClick = () => {
    console.log('=== OUVERTURE DIRECTE FORMULAIRE VIREMENT BANCAIRE ===');
    setPaymentDialogOpen(false);
    setTimeout(() => {
      setBankTransferDialogOpen(true);
    }, 100);
  };

  const handleCashPaymentClick = () => {
    console.log('Redirection vers paiement - espèces');
    localStorage.setItem('selectedPaymentMethod', 'especes');
    onTabChange('payment');
    setPaymentDialogOpen(false);
  };

  const handleOnlinePaymentClick = () => {
    console.log('Redirection vers paiement en ligne');
    localStorage.setItem('selectedPaymentMethod', 'carte');
    onTabChange('payment');
    setPaymentDialogOpen(false);
  };

  const handleSendMessage = () => {
    console.log('Message envoyé');
    setMessageDialogOpen(false);
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-lg">{getLocalizedText('quickActionsTitle')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {/* Action Paiements - Avec menu déroulant */}
          <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
            <DialogTrigger asChild>
              <button 
                onClick={handlePaymentsClick}
                className="flex flex-col items-center gap-2 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <CreditCard className="h-6 w-6 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">{getLocalizedText('payments')}</span>
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-lg">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 text-xl font-bold">$</span>
                  </div>
                  {getLocalizedText('paymentOptions')}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-3 mt-4">
                {/* Historique des paiements */}
                <button 
                  onClick={handlePaymentHistoryClick}
                  className="w-full p-4 text-left border rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-3"
                >
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <History className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{getLocalizedText('paymentHistory')}</div>
                    <div className="text-sm text-gray-600">{getLocalizedText('consultPaymentHistory')}</div>
                  </div>
                </button>

                {/* Virement bancaire */}
                <button 
                  onClick={handleBankTransferClick}
                  className="w-full p-4 text-left border-2 border-blue-200 rounded-lg hover:bg-blue-50 transition-colors bg-blue-25 flex items-center gap-3"
                >
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <CreditCard className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{getLocalizedText('bankTransfer')}</div>
                    <div className="text-sm text-gray-600">{getLocalizedText('declareBankTransfer')}</div>
                  </div>
                </button>

                {/* Paiement en espèces */}
                <button 
                  onClick={handleCashPaymentClick}
                  className="w-full p-4 text-left border rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-3"
                >
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Banknote className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{getLocalizedText('cashPayment')}</div>
                    <div className="text-sm text-gray-600">{getLocalizedText('declareCashPayment')}</div>
                  </div>
                </button>

                {/* Paiement en ligne */}
                <button 
                  onClick={handleOnlinePaymentClick}
                  className="w-full p-4 text-left border rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-3"
                >
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <Wallet className="h-4 w-4 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{getLocalizedText('onlinePayment')}</div>
                    <div className="text-sm text-gray-600">{getLocalizedText('payOnlineByCard')}</div>
                  </div>
                </button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Dialog spécifique pour le virement bancaire */}
          <Dialog open={bankTransferDialogOpen} onOpenChange={setBankTransferDialogOpen}>
            <PaymentDialog
              open={bankTransferDialogOpen}
              onOpenChange={setBankTransferDialogOpen}
              actualTenantName="Marie Dupont"
              actualTenantType="Colocataire"
              propertyTitle="Appartement Colocation - 123 Rue de la Paix"
              totalAmount={650}
              paymentDate={new Date().toISOString().split('T')[0]}
              setPaymentDate={() => {}}
              paidAmount="650"
              setPaidAmount={() => {}}
              paymentMethod="virement"
              setPaymentMethod={() => {}}
              notes=""
              setNotes={() => {}}
              loading={false}
              isFormValid={true}
              onSubmit={(e) => {
                e.preventDefault();
                console.log('Virement bancaire déclaré');
                setBankTransferDialogOpen(false);
              }}
            />
          </Dialog>

          {/* Action Maintenance */}
          <Dialog open={maintenanceDialogOpen} onOpenChange={setMaintenanceDialogOpen}>
            <DialogTrigger asChild>
              <button className="flex flex-col items-center gap-2 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                <Home className="h-6 w-6 text-green-600" />
                <span className="text-sm font-medium text-green-800">{getLocalizedText('maintenance')}</span>
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{getLocalizedText('newRequest')}</DialogTitle>
              </DialogHeader>
              <div className="mt-4">
                <MaintenanceRequestForm />
              </div>
            </DialogContent>
          </Dialog>

          {/* Action Messages */}
          <Dialog open={messageDialogOpen} onOpenChange={setMessageDialogOpen}>
            <DialogTrigger asChild>
              <button 
                onClick={handleMessagesClick}
                className="flex flex-col items-center gap-2 p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
              >
                <Mail className="h-6 w-6 text-purple-600" />
                <span className="text-sm font-medium text-purple-800">{getLocalizedText('messages')}</span>
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{getLocalizedText('newMessage')}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <label className="block text-sm font-medium mb-2">{getLocalizedText('subject')}</label>
                  <input 
                    type="text" 
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Objet du message"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">{getLocalizedText('message')}</label>
                  <textarea 
                    rows={4}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Votre message..."
                  />
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={handleSendMessage}
                    className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    {getLocalizedText('send')}
                  </button>
                  <button 
                    onClick={() => setMessageDialogOpen(false)}
                    className="flex-1 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    {getLocalizedText('cancel')}
                  </button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Action Profil */}
          <button 
            onClick={handleProfileClick}
            className="flex flex-col items-center gap-2 p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
          >
            <User className="h-6 w-6 text-orange-600" />
            <span className="text-sm font-medium text-orange-800">{getLocalizedText('profile')}</span>
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActionsCard;
