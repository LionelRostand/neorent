import { useMemo } from 'react';
import { useOwnerData } from '@/hooks/useOwnerData';

/**
 * Hook pour calculer les charges par propriété et les métriques de rentabilité
 */
export const usePropertyCharges = (ownerProfile: any) => {
  const { charges, roommates } = useOwnerData(ownerProfile);

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
    // Revenus : somme des loyers des colocataires actifs de cette propriété
    const propertyRoommates = roommates.filter(r => 
      r.property === propertyName && r.status === 'Actif'
    );
    
    const monthlyRevenue = propertyRoommates.reduce((sum, roommate) => 
      sum + (parseFloat(roommate.rentAmount) || 0), 0
    );

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
      roommates: propertyRoommates
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
    let totalRevenue = 0;
    let totalCharges = 0;
    let totalProfit = 0;
    const propertiesWithData = [];

    // Parcourir toutes les propriétés qui ont des colocataires
    const uniqueProperties = [...new Set(roommates.map(r => r.property))];
    
    uniqueProperties.forEach(propertyName => {
      const profitability = calculateProfitability(propertyName);
      
      totalRevenue += profitability.monthlyRevenue;
      totalCharges += profitability.monthlyCharges;
      totalProfit += profitability.monthlyProfit;
      
      if (profitability.monthlyRevenue > 0) {
        propertiesWithData.push({
          propertyName,
          ...profitability
        });
      }
    });

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