import { useMemo } from 'react';
import { useOwnerData } from '@/hooks/useOwnerData';
import { useFirebasePayments } from '@/hooks/useFirebasePayments';

/**
 * Hook pour calculer les charges par propriété et les métriques de rentabilité
 */
export const usePropertyCharges = (ownerProfile: any) => {
  const { charges, roommates } = useOwnerData(ownerProfile);
  const { payments } = useFirebasePayments();

  const propertyChargesData = useMemo(() => {
    // Créer un map pour regrouper les charges par propriété
    const chargesByProperty = new Map();

    charges.forEach(charge => {
      const propertyName = charge.propertyName;
      
      if (!chargesByProperty.has(propertyName)) {
        chargesByProperty.set(propertyName, {
          propertyName,
          monthlyCharges: [],
          totalCharges: 0,
          averageMonthlyCharges: 0,
          lastMonthCharges: 0
        });
      }

      const propertyData = chargesByProperty.get(propertyName);
      propertyData.monthlyCharges.push(charge);
      propertyData.totalCharges += charge.total || 0;
    });

    // Calculer les moyennes et dernières charges pour chaque propriété
    chargesByProperty.forEach((propertyData, propertyName) => {
      const charges = propertyData.monthlyCharges;
      
      if (charges.length > 0) {
        propertyData.averageMonthlyCharges = propertyData.totalCharges / charges.length;
        
        // Trouver les charges du mois le plus récent
        const sortedCharges = charges.sort((a, b) => {
          const dateA = new Date(a.month + '-01');
          const dateB = new Date(b.month + '-01');
          return dateB.getTime() - dateA.getTime();
        });
        
        propertyData.lastMonthCharges = sortedCharges[0]?.total || 0;
      }
    });

    return chargesByProperty;
  }, [charges]);

  /**
   * Calculer les métriques de rentabilité pour une propriété donnée
   */
  const calculateProfitability = (propertyName: string) => {
    // Revenus : utiliser les paiements effectivement reçus (statut "Payé") au lieu des montants attendus
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const actualRevenue = payments
      .filter(payment => {
        if (!payment.paymentDate || payment.status !== 'Payé') return false;
        const paymentDate = new Date(payment.paymentDate);
        const isCurrentMonth = paymentDate.getMonth() === currentMonth && 
               paymentDate.getFullYear() === currentYear;
        
        // Filtrer par propriété si spécifiée
        const matchesProperty = propertyName ? payment.property.includes(propertyName.split(' - ')[0]) : true;
        
        return isCurrentMonth && matchesProperty;
      })
      .reduce((sum, payment) => sum + (payment.paidAmount || payment.rentAmount || 0), 0);

    // Fallback: si pas de paiements reçus, utiliser les montants attendus des colocataires actifs
    const expectedRevenue = roommates
      .filter(r => r.property === propertyName && r.status === 'Actif')
      .reduce((sum, roommate) => sum + (parseFloat(roommate.rentAmount) || 0), 0);
    
    const monthlyRevenue = actualRevenue > 0 ? actualRevenue : expectedRevenue;

    // Charges : dernières charges de la propriété
    const propertyCharges = propertyChargesData.get(propertyName);
    const monthlyCharges = propertyCharges?.lastMonthCharges || 0;

    // Calculs de rentabilité
    const monthlyProfit = monthlyRevenue - monthlyCharges;
    const annualRevenue = monthlyRevenue * 12;
    const annualCharges = monthlyCharges * 12;
    const annualProfit = monthlyProfit * 12;
    
    // Pourcentage de rentabilité (profit / revenus * 100)
    const profitabilityPercentage = monthlyRevenue > 0 
      ? (monthlyProfit / monthlyRevenue) * 100 
      : 0;

    // Pourcentage des charges par rapport aux revenus
    const chargesPercentage = monthlyRevenue > 0 
      ? (monthlyCharges / monthlyRevenue) * 100 
      : 0;

    return {
      monthlyRevenue,
      monthlyCharges,
      monthlyProfit,
      annualRevenue,
      annualCharges,
      annualProfit,
      profitabilityPercentage,
      chargesPercentage,
      roommates: roommates.filter(r => r.property === propertyName && r.status === 'Actif')
    };
  };

  /**
   * Obtenir le détail des charges pour une propriété
   */
  const getPropertyChargesDetail = (propertyName: string) => {
    const propertyCharges = propertyChargesData.get(propertyName);
    
    if (!propertyCharges) {
      return {
        hasCharges: false,
        monthlyCharges: [],
        totalCharges: 0,
        averageMonthlyCharges: 0,
        lastMonthCharges: 0
      };
    }

    return {
      hasCharges: true,
      monthlyCharges: propertyCharges.monthlyCharges,
      totalCharges: propertyCharges.totalCharges,
      averageMonthlyCharges: propertyCharges.averageMonthlyCharges,
      lastMonthCharges: propertyCharges.lastMonthCharges
    };
  };

  /**
   * Obtenir un résumé global de toutes les propriétés
   */
  const getGlobalSummary = () => {
    // Calculer les revenus globaux basés sur les paiements reçus (statut "Payé")
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const totalActualRevenue = payments
      .filter(payment => {
        if (!payment.paymentDate || payment.status !== 'Payé') return false;
        const paymentDate = new Date(payment.paymentDate);
        return paymentDate.getMonth() === currentMonth && 
               paymentDate.getFullYear() === currentYear;
      })
      .reduce((sum, payment) => sum + (payment.paidAmount || payment.rentAmount || 0), 0);

    // Fallback si pas de paiements: utiliser les montants attendus
    const totalExpectedRevenue = roommates
      .filter(r => r.status === 'Actif')
      .reduce((sum, roommate) => sum + (parseFloat(roommate.rentAmount) || 0), 0);
    
    const totalRevenue = totalActualRevenue > 0 ? totalActualRevenue : totalExpectedRevenue;

    // Debug pour comprendre le calcul
    console.log('🔍 Calcul des revenus globaux:', {
      actualRevenue: totalActualRevenue,
      expectedRevenue: totalExpectedRevenue,
      finalRevenue: totalRevenue,
      paymentsCount: payments.filter(p => p.status === 'Payé').length,
      roommatesCount: roommates.filter(r => r.status === 'Actif').length
    });

    // Calculer les charges globales
    let totalCharges = 0;
    const propertiesWithData = [];
    
    // Parcourir toutes les propriétés qui ont des colocataires ou des paiements
    const uniqueProperties = [...new Set([
      ...roommates.map(r => r.property),
      ...payments.map(p => p.property)
    ])];
    
    uniqueProperties.forEach(propertyName => {
      const profitability = calculateProfitability(propertyName);
      totalCharges += profitability.monthlyCharges;
      
      if (profitability.monthlyRevenue > 0) {
        propertiesWithData.push({
          propertyName,
          ...profitability
        });
      }
    });

    const totalProfit = totalRevenue - totalCharges;

    const globalProfitabilityPercentage = totalRevenue > 0 
      ? (totalProfit / totalRevenue) * 100 
      : 0;

    const globalChargesPercentage = totalRevenue > 0 
      ? (totalCharges / totalRevenue) * 100 
      : 0;

    return {
      totalRevenue,
      totalCharges,
      totalProfit,
      globalProfitabilityPercentage,
      globalChargesPercentage,
      propertiesWithData,
      propertiesCount: propertiesWithData.length
    };
  };

  return {
    propertyChargesData,
    calculateProfitability,
    getPropertyChargesDetail,
    getGlobalSummary
  };
};