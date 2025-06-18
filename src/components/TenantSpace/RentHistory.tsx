import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useIsMobile } from '@/hooks/use-mobile';
import { useReceiptGeneration } from '@/hooks/useReceiptGeneration';
import { useAdminTenantAccess } from '@/hooks/useAdminTenantAccess';
import { useFirebaseContracts } from '@/hooks/useFirebaseContracts';
import RentPayment from './RentPayment';
import { 
  CreditCard, 
  Download, 
  Calendar, 
  CheckCircle, 
  Clock, 
  Euro,
  Receipt,
  TrendingUp,
  FileText
} from 'lucide-react';

const RentHistory = () => {
  const [selectedYear, setSelectedYear] = useState('2024');
  const [contractData, setContractData] = useState<any>(null);
  const [rentPayments, setRentPayments] = useState<any[]>([]);
  const isMobile = useIsMobile();
  const { getCurrentProfile, getCurrentUserType } = useAdminTenantAccess();
  const { contracts, loading: contractsLoading } = useFirebaseContracts();
  
  // Obtenir le profil actuel et le type d'utilisateur
  const currentProfile = getCurrentProfile();
  const currentUserType = getCurrentUserType();
  const actualTenantName = currentProfile?.name || 'Marie Dubois';
  const actualTenantType = (currentUserType === 'colocataire' ? 'Colocataire' : 'Locataire') as 'Locataire' | 'Colocataire';
  
  console.log('RentHistory - Données du locataire:', {
    actualTenantName,
    actualTenantType,
    currentProfile
  });

  // Fonction pour trouver le contrat correspondant
  const findTenantContract = () => {
    if (!contracts || contracts.length === 0) return null;
    
    const tenantContract = contracts.find(contract => 
      contract.tenant === actualTenantName && 
      (contract.status === 'Actif' || contract.status === 'Signé')
    );
    
    console.log('Contrat trouvé pour', actualTenantName, ':', tenantContract);
    return tenantContract;
  };

  // Fonction pour extraire le montant du loyer du contrat
  const extractRentAmount = (contractAmount: string | number): { rent: number, charges: number } => {
    let totalAmount = 0;
    
    if (typeof contractAmount === 'string') {
      const numericPart = contractAmount.replace(/[^\d]/g, '');
      totalAmount = parseInt(numericPart) || 450;
    } else if (typeof contractAmount === 'number') {
      totalAmount = contractAmount;
    } else {
      totalAmount = 450; // Valeur par défaut
    }
    
    // Estimation: 90% loyer, 10% charges
    const rent = Math.round(totalAmount * 0.9);
    const charges = totalAmount - rent;
    
    return { rent, charges };
  };

  // Fonction pour générer l'historique des paiements depuis la date du contrat
  const generatePaymentHistory = (contract: any) => {
    if (!contract) return [];

    const startDate = new Date(contract.startDate);
    const currentDate = new Date();
    const payments = [];
    
    const { rent, charges } = extractRentAmount(contract.amount);
    const totalMonthly = rent + charges;
    
    console.log('Génération historique - Montants:', { rent, charges, totalMonthly, contractAmount: contract.amount });

    let paymentId = 1;
    let currentMonth = new Date(startDate.getFullYear(), startDate.getMonth(), 1);

    while (currentMonth <= currentDate) {
      const monthNames = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
        'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
      
      const monthLabel = `${monthNames[currentMonth.getMonth()]} ${currentMonth.getFullYear()}`;
      const dueDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
      
      // Déterminer si le paiement est payé ou en attente
      const isCurrentMonth = currentMonth.getMonth() === currentDate.getMonth() && 
                             currentMonth.getFullYear() === currentDate.getFullYear();
      const isFutureMonth = currentMonth > currentDate;
      
      let status = 'Payé';
      let paymentDate = null;
      
      if (isCurrentMonth || isFutureMonth) {
        status = 'En attente';
        paymentDate = null;
      } else {
        // Simuler une date de paiement (entre le 1er et le 5 du mois)
        const payDay = Math.floor(Math.random() * 5) + 1;
        paymentDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), payDay).toISOString().split('T')[0];
      }

      payments.push({
        id: paymentId++,
        month: monthLabel,
        amount: totalMonthly,
        rent: rent,
        charges: charges,
        paymentDate: paymentDate,
        dueDate: dueDate.toISOString().split('T')[0],
        status: status,
        method: status === 'Payé' ? 'Virement' : null,
        receiptUrl: status === 'Payé' ? '#' : null
      });

      // Passer au mois suivant
      currentMonth.setMonth(currentMonth.getMonth() + 1);
    }

    return payments.reverse(); // Ordre chronologique inverse (plus récent en premier)
  };

  // Effect pour charger les données du contrat et générer l'historique
  useEffect(() => {
    if (!contractsLoading && contracts && contracts.length > 0) {
      const contract = findTenantContract();
      if (contract) {
        console.log('Contrat trouvé:', contract);
        setContractData(contract);
        const generatedPayments = generatePaymentHistory(contract);
        console.log('Historique généré:', generatedPayments);
        setRentPayments(generatedPayments);
      } else {
        console.log('Aucun contrat trouvé pour', actualTenantName);
        // Utiliser les données par défaut si aucun contrat n'est trouvé
        const defaultPayments = generateDefaultPayments();
        setRentPayments(defaultPayments);
      }
    }
  }, [contracts, contractsLoading, actualTenantName]);

  // Fonction pour générer des paiements par défaut si aucun contrat n'est trouvé
  const generateDefaultPayments = () => {
    const defaultRent = 400;
    const defaultCharges = 50;
    const totalMonthly = defaultRent + defaultCharges;

    // Historique par défaut depuis septembre 2023
    return [
      // 2023 - Depuis septembre (début du contrat)
      {
        id: 1,
        month: 'Septembre 2023',
        amount: totalMonthly,
        rent: defaultRent,
        charges: defaultCharges,
        paymentDate: '2023-09-05',
        dueDate: '2023-09-01',
        status: 'Payé',
        method: 'Virement',
        receiptUrl: '#'
      },
      {
        id: 2,
        month: 'Octobre 2023',
        amount: totalMonthly,
        rent: defaultRent,
        charges: defaultCharges,
        paymentDate: '2023-10-03',
        dueDate: '2023-10-01',
        status: 'Payé',
        method: 'Virement',
        receiptUrl: '#'
      },
      {
        id: 3,
        month: 'Novembre 2023',
        amount: totalMonthly,
        rent: defaultRent,
        charges: defaultCharges,
        paymentDate: '2023-11-02',
        dueDate: '2023-11-01',
        status: 'Payé',
        method: 'Virement',
        receiptUrl: '#'
      },
      {
        id: 4,
        month: 'Décembre 2023',
        amount: totalMonthly,
        rent: defaultRent,
        charges: defaultCharges,
        paymentDate: '2023-12-01',
        dueDate: '2023-12-01',
        status: 'Payé',
        method: 'Virement',
        receiptUrl: '#'
      },
      // 2024
      {
        id: 5,
        month: 'Janvier 2024',
        amount: totalMonthly,
        rent: defaultRent,
        charges: defaultCharges,
        paymentDate: '2024-01-05',
        dueDate: '2024-01-01',
        status: 'Payé',
        method: 'Virement',
        receiptUrl: '#'
      },
      {
        id: 6,
        month: 'Février 2024',
        amount: totalMonthly,
        rent: defaultRent,
        charges: defaultCharges,
        paymentDate: '2024-02-03',
        dueDate: '2024-02-01',
        status: 'Payé',
        method: 'Virement',
        receiptUrl: '#'
      },
      {
        id: 7,
        month: 'Mars 2024',
        amount: totalMonthly,
        rent: defaultRent,
        charges: defaultCharges,
        paymentDate: '2024-03-01',
        dueDate: '2024-03-01',
        status: 'Payé',
        method: 'Virement',
        receiptUrl: '#'
      },
      {
        id: 8,
        month: 'Avril 2024',
        amount: totalMonthly,
        rent: defaultRent,
        charges: defaultCharges,
        paymentDate: '2024-04-02',
        dueDate: '2024-04-01',
        status: 'Payé',
        method: 'Virement',
        receiptUrl: '#'
      },
      {
        id: 9,
        month: 'Mai 2024',
        amount: totalMonthly,
        rent: defaultRent,
        charges: defaultCharges,
        paymentDate: '2024-05-03',
        dueDate: '2024-05-01',
        status: 'Payé',
        method: 'Virement',
        receiptUrl: '#'
      },
      {
        id: 10,
        month: 'Juin 2024',
        amount: totalMonthly,
        rent: defaultRent,
        charges: defaultCharges,
        paymentDate: '2024-06-04',
        dueDate: '2024-06-01',
        status: 'Payé',
        method: 'Virement',
        receiptUrl: '#'
      },
      {
        id: 11,
        month: 'Juillet 2024',
        amount: totalMonthly,
        rent: defaultRent,
        charges: defaultCharges,
        paymentDate: null,
        dueDate: '2024-07-01',
        status: 'En attente',
        method: null,
        receiptUrl: null
      }
    ];
  };
  
  // Données du locataire avec le nom réel
  const tenantData = {
    name: actualTenantName,
    type: actualTenantType,
    propertyAddress: currentProfile?.address || '45 Rue de la Paix, 75001 Paris',
    propertyType: actualTenantType === 'Colocataire' ? 'Chambre en colocation' : 'Appartement'
  };

  // Calculer les montants à partir des données du contrat ou par défaut
  const monthlyRent = contractData ? extractRentAmount(contractData.amount).rent : 400;
  const monthlyCharges = contractData ? extractRentAmount(contractData.amount).charges : 50;
  const totalMonthly = monthlyRent + monthlyCharges;

  const propertyData = {
    title: actualTenantType === 'Colocataire' ? 'Chambre Rue de la Paix' : 'Appartement Rue de la Paix',
    address: currentProfile?.address || '45 Rue de la Paix, 75001 Paris',
    type: actualTenantType === 'Colocataire' ? 'Chambre en colocation' : 'Appartement',
    surface: '65m²',
    rooms: '3 pièces',
    rent: monthlyRent,
    charges: monthlyCharges,
    deposit: totalMonthly,
    furnished: true,
    floor: '3ème étage',
    elevator: true,
    parking: false,
    features: ['Balcon', 'Cave', 'Interphone', 'Fibre optique']
  };
  
  const { generateReceipt } = useReceiptGeneration({
    tenantName: actualTenantName,
    tenantType: actualTenantType,
    propertyAddress: tenantData.propertyAddress,
    propertyType: tenantData.propertyType
  });

  const handleDownloadReceipt = (payment: typeof rentPayments[0]) => {
    if (payment.status !== 'Payé' || !payment.paymentDate) {
      return;
    }
    
    console.log('Téléchargement de la quittance pour:', actualTenantName);
    
    generateReceipt({
      month: payment.month,
      rentAmount: payment.rent,
      charges: payment.charges,
      paymentDate: payment.paymentDate,
      paymentMethod: payment.method || 'Non spécifié'
    });
  };

  // ... keep existing code (getStatusBadge function and other helper functions)
  const getStatusBadge = (status: string) => {
    const className = `text-xs ${isMobile ? 'px-2 py-1' : ''}`;
    switch (status) {
      case 'Payé':
        return (
          <Badge className={`bg-green-100 text-green-800 ${className}`}>
            <CheckCircle className="h-3 w-3 mr-1" />
            {status}
          </Badge>
        );
      case 'En attente':
        return (
          <Badge className={`bg-yellow-100 text-yellow-800 ${className}`}>
            <Clock className="h-3 w-3 mr-1" />
            {status}
          </Badge>
        );
      case 'En retard':
        return (
          <Badge variant="destructive" className={className}>
            ⚠️ {status}
          </Badge>
        );
      default:
        return <Badge variant="secondary" className={className}>{status}</Badge>;
    }
  };

  const totalPaid = rentPayments.filter(p => p.status === 'Payé').reduce((sum, p) => sum + p.amount, 0);
  const paidPayments = rentPayments.filter(p => p.status === 'Payé').length;

  // Afficher un loading si les contrats sont en cours de chargement
  if (contractsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Chargement des données du contrat...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Composant de paiement */}
      <RentPayment tenantData={tenantData} propertyData={propertyData} />

      {/* Affichage des informations du contrat */}
      {contractData && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-800 text-lg md:text-xl">Informations du contrat</CardTitle>
          </CardHeader>
          <CardContent className="text-blue-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div>
                <h4 className="font-medium mb-2 text-sm md:text-base">Détails du contrat</h4>
                <ul className="space-y-1 text-xs md:text-sm">
                  <li>• Locataire: {contractData.tenant}</li>
                  <li>• Propriété: {contractData.property}</li>
                  <li>• Montant: {contractData.amount}</li>
                  <li>• Date de début: {new Date(contractData.startDate).toLocaleDateString('fr-FR')}</li>
                  <li>• Statut: {contractData.status}</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2 text-sm md:text-base">Historique généré</h4>
                <ul className="space-y-1 text-xs md:text-sm">
                  <li>• Depuis: {new Date(contractData.startDate).toLocaleDateString('fr-FR')}</li>
                  <li>• Loyer mensuel: {monthlyRent}€</li>
                  <li>• Charges mensuelles: {monthlyCharges}€</li>
                  <li>• Total mensuel: {totalMonthly}€</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Résumé financier */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        <Card>
          <CardContent className="pt-4 md:pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm text-gray-600">Total payé</p>
                <p className="text-lg md:text-2xl font-bold text-green-600">{totalPaid.toLocaleString()}€</p>
              </div>
              <Euro className="h-6 w-6 md:h-8 md:w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-4 md:pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm text-gray-600">Paiements effectués</p>
                <p className="text-lg md:text-2xl font-bold text-blue-600">{paidPayments}</p>
              </div>
              <CheckCircle className="h-6 w-6 md:h-8 md:w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-4 md:pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm text-gray-600">Loyer mensuel</p>
                <p className="text-lg md:text-2xl font-bold text-purple-600">{monthlyRent}€</p>
              </div>
              <CreditCard className="h-6 w-6 md:h-8 md:w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-4 md:pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm text-gray-600">Charges mensuelles</p>
                <p className="text-lg md:text-2xl font-bold text-orange-600">{monthlyCharges}€</p>
              </div>
              <TrendingUp className="h-6 w-6 md:h-8 md:w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Historique des paiements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
            <Receipt className="h-4 w-4 md:h-5 md:w-5" />
            Historique des loyers {contractData ? `- Depuis ${new Date(contractData.startDate).toLocaleDateString('fr-FR')}` : '- Depuis septembre 2023'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 md:space-y-4">
            {rentPayments.map((payment) => (
              <div key={payment.id} className={`flex flex-col ${isMobile ? 'space-y-3' : 'md:flex-row md:items-center md:justify-between'} p-3 md:p-4 border rounded-lg hover:bg-gray-50`}>
                <div className="flex items-center space-x-3 md:space-x-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Calendar className="h-5 w-5 md:h-6 md:w-6 text-blue-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-medium text-sm md:text-base">{payment.month}</h3>
                    <div className={`flex ${isMobile ? 'flex-col space-y-1' : 'items-center gap-4'} text-xs md:text-sm text-gray-600 mt-1`}>
                      <span>Échéance: {new Date(payment.dueDate).toLocaleDateString('fr-FR')}</span>
                      {payment.paymentDate && (
                        <span>Payé le: {new Date(payment.paymentDate).toLocaleDateString('fr-FR')}</span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className={`flex ${isMobile ? 'flex-col space-y-3' : 'items-center space-x-4'}`}>
                  <div className={`${isMobile ? 'flex justify-between items-center' : 'text-right'}`}>
                    <div>
                      <p className="font-semibold text-sm md:text-base">{payment.amount}€</p>
                      <p className="text-xs md:text-sm text-gray-600">
                        Loyer: {payment.rent}€ + Charges: {payment.charges}€
                      </p>
                    </div>
                  </div>
                  
                  <div className={`flex ${isMobile ? 'justify-between items-center' : 'items-center gap-3'}`}>
                    {getStatusBadge(payment.status)}
                    
                    {payment.status === 'Payé' ? (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className={isMobile ? 'text-xs px-3 py-1' : ''}
                        onClick={() => handleDownloadReceipt(payment)}
                      >
                        <FileText className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                        Quittance PDF
                      </Button>
                    ) : (
                      <Button variant="outline" size="sm" disabled className={isMobile ? 'text-xs px-3 py-1' : ''}>
                        Non disponible
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Informations de paiement */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-blue-800 text-lg md:text-xl">Informations de paiement</CardTitle>
        </CardHeader>
        <CardContent className="text-blue-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div>
              <h4 className="font-medium mb-2 text-sm md:text-base">Modalités de paiement</h4>
              <ul className="space-y-1 text-xs md:text-sm">
                <li>• Loyer mensuel: {monthlyRent}€</li>
                <li>• Charges mensuelles: {monthlyCharges}€</li>
                <li>• Total mensuel: {totalMonthly}€</li>
                <li>• Échéance: 1er de chaque mois</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2 text-sm md:text-base">Moyens de paiement acceptés</h4>
              <ul className="space-y-1 text-xs md:text-sm">
                <li>• Virement bancaire (recommandé)</li>
                <li>• Chèque</li>
                <li>• Prélèvement automatique</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RentHistory;
