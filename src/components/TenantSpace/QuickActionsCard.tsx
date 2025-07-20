
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { CreditCard, Home, Mail, User, Banknote } from 'lucide-react';
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
        fr: 'Déclarer un virement bancaire',
        en: 'Declare bank transfer'
      },
      declareCashPayment: {
        fr: 'Déclarer un paiement en espèces',
        en: 'Declare cash payment'
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
    console.log('Ouverture du formulaire de déclaration de virement bancaire');
    // Fermer le menu des options de paiement et ouvrir directement le PaymentDialog
    // avec le mode virement bancaire pré-sélectionné
    setPaymentDialogOpen(false);
    // Utiliser un petit délai pour permettre la fermeture propre du premier dialog
    setTimeout(() => {
      // Stocker la méthode de paiement sélectionnée
      localStorage.setItem('selectedPaymentMethod', 'virement');
      // Rediriger vers l'onglet paiement qui ouvrira automatiquement le bon formulaire
      onTabChange('payment');
    }, 100);
  };

  const handleCashPaymentClick = () => {
    console.log('Redirection vers paiement - espèces');
    // Stocker le type de paiement sélectionné pour l'onglet paiement
    localStorage.setItem('selectedPaymentMethod', 'especes');
    onTabChange('payment');
    setPaymentDialogOpen(false);
  };

  const handleSendMessage = () => {
    // Simuler l'envoi d'un message
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
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{getLocalizedText('paymentOptions')}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                {/* Virement bancaire - DÉCLARATION DIRECTE */}
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('=== CLIC VIREMENT BANCAIRE DÉTECTÉ ===');
                    handleBankTransferClick();
                  }}
                  className="w-full p-4 text-left border-2 border-blue-200 rounded-lg hover:bg-blue-50 transition-colors bg-gradient-to-r from-blue-50 to-blue-100"
                >
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-5 w-5 text-blue-600" />
                    <div>
                      <div className="font-semibold text-blue-800">{getLocalizedText('bankTransfer')}</div>
                      <div className="text-sm text-blue-600">{getLocalizedText('declareBankTransfer')}</div>
                    </div>
                  </div>
                </button>

                {/* Paiement en espèces - AVEC GESTIONNAIRE DE CLIC CORRIGÉ */}
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('=== CLIC PAIEMENT ESPÈCES DÉTECTÉ ===');
                    handleCashPaymentClick();
                  }}
                  className="w-full p-4 text-left border-2 border-green-200 rounded-lg hover:bg-green-50 transition-colors bg-gradient-to-r from-green-50 to-green-100"
                >
                  <div className="flex items-center gap-3">
                    <Banknote className="h-5 w-5 text-green-600" />
                    <div>
                      <div className="font-semibold text-green-800">{getLocalizedText('cashPayment')}</div>
                      <div className="text-sm text-green-600">{getLocalizedText('declareCashPayment')}</div>
                    </div>
                  </div>
                </button>

                {/* Historique des paiements - AVEC GESTIONNAIRE DE CLIC CORRIGÉ */}
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('=== CLIC HISTORIQUE DÉTECTÉ ===');
                    handlePaymentHistoryClick();
                  }}
                  className="w-full p-3 text-left border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="font-medium">{getLocalizedText('paymentHistory')}</div>
                  <div className="text-sm text-gray-600">Consulter l'historique des paiements</div>
                </button>
              </div>
            </DialogContent>
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
