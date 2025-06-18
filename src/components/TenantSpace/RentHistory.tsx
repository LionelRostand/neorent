import React, { useState, useEffect } from 'react';
import { useAdminTenantAccess } from '@/hooks/useAdminTenantAccess';
import { useFirebaseContracts } from '@/hooks/useFirebaseContracts';
import { useReceiptGeneration } from '@/hooks/useReceiptGeneration';
import RentPayment from './RentPayment';
import ContractInfoCard from './ContractInfoCard';
import PaymentSummaryCards from './PaymentSummaryCards';
import PaymentHistoryList from './PaymentHistoryList';
import PaymentInfoCard from './PaymentInfoCard';

const RentHistory = () => {
  const [contractData, setContractData] = useState<any>(null);
  const [rentPayments, setRentPayments] = useState<any[]>([]);
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
      <ContractInfoCard 
        contractData={contractData}
        monthlyRent={monthlyRent}
        monthlyCharges={monthlyCharges}
        totalMonthly={totalMonthly}
      />

      {/* Résumé financier */}
      <PaymentSummaryCards 
        totalPaid={totalPaid}
        paidPayments={paidPayments}
        monthlyRent={monthlyRent}
        monthlyCharges={monthlyCharges}
      />

      {/* Historique des paiements */}
      <PaymentHistoryList 
        rentPayments={rentPayments}
        contractData={contractData}
        onDownloadReceipt={handleDownloadReceipt}
      />

      {/* Informations de paiement */}
      <PaymentInfoCard 
        monthlyRent={monthlyRent}
        monthlyCharges={monthlyCharges}
        totalMonthly={totalMonthly}
      />
    </div>
  );
};

export default RentHistory;
