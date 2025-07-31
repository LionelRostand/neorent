import { useMemo } from 'react';
import { useFirebasePayments } from './useFirebasePayments';
import { useFirebaseCharges } from './useFirebaseCharges';

interface PropertyFinancials {
  propertyName: string;
  monthlyRevenue: number;
  annualRevenue: number;
  monthlyCharges: number;
  annualCharges: number;
  monthlyProfit: number;
  annualProfit: number;
  profitMargin: number;
  roi: number; // Return on Investment approximation
}

interface FinancialSummary {
  totalMonthlyRevenue: number;
  totalAnnualRevenue: number;
  totalMonthlyCharges: number;
  totalAnnualCharges: number;
  totalMonthlyProfit: number;
  totalAnnualProfit: number;
  averageProfitMargin: number;
  propertiesData: PropertyFinancials[];
}

interface InvestmentCapacity {
  availableForInvestment: number;
  maxPropertyPrice: number;
  recommendedDownPayment: number;
  monthlyBudgetForLoan: number;
  riskLevel: 'low' | 'medium' | 'high';
  recommendations: string[];
}

export const useFinancialForecasting = () => {
  const { payments } = useFirebasePayments();
  const { charges } = useFirebaseCharges();

  // Calculer les données financières par propriété avec agrégation des chambres
  const propertyFinancials = useMemo<PropertyFinancials[]>(() => {
    // Prendre les données des 12 derniers mois complets
    const now = new Date();
    const twelveMonthsAgo = new Date(now.getFullYear() - 1, now.getMonth(), 1);
    
    const recentPayments = payments.filter(payment => {
      const paymentDate = new Date(payment.paymentDate || payment.dueDate);
      return payment.status === 'Payé' && paymentDate >= twelveMonthsAgo;
    });

    const recentCharges = charges.filter(charge => {
      const chargeDate = new Date(charge.month + '-01');
      return chargeDate >= twelveMonthsAgo;
    });

    console.log(`📅 Période d'analyse: ${twelveMonthsAgo.toLocaleDateString()} à ${now.toLocaleDateString()}`);
    console.log(`💰 ${recentPayments.length} paiements trouvés`);
    console.log(`💸 ${recentCharges.length} charges trouvées`);

    // Fonction pour extraire le nom de l'appartement principal
    const getMainPropertyName = (propertyName: string): string => {
      const match = propertyName.match(/^(Appartement\s+\d+)/i);
      return match ? match[1] : propertyName;
    };

    // Grouper par appartement principal (en agrégeant les chambres)
    const aggregatedData = new Map<string, {
      payments: typeof recentPayments;
      charges: typeof recentCharges;
    }>();

    // Agréger les paiements par appartement principal
    recentPayments.forEach(payment => {
      const mainPropertyKey = getMainPropertyName(payment.property);
      if (!aggregatedData.has(mainPropertyKey)) {
        aggregatedData.set(mainPropertyKey, { payments: [], charges: [] });
      }
      aggregatedData.get(mainPropertyKey)!.payments.push(payment);
    });

    // Agréger les charges par appartement principal avec recherche flexible
    recentCharges.forEach(charge => {
      const mainPropertyKey = getMainPropertyName(charge.propertyName);
      console.log(`🔍 Charge trouvée: "${charge.propertyName}" -> mappée vers "${mainPropertyKey}"`);
      
      if (!aggregatedData.has(mainPropertyKey)) {
        aggregatedData.set(mainPropertyKey, { payments: [], charges: [] });
      }
      aggregatedData.get(mainPropertyKey)!.charges.push(charge);
    });

    console.log(`🏢 Propriétés agrégées: ${Array.from(aggregatedData.keys()).join(', ')}`);
    
    // Debug: Afficher le contenu des charges pour chaque propriété
    aggregatedData.forEach((data, propertyName) => {
      console.log(`📋 ${propertyName}: ${data.payments.length} paiements, ${data.charges.length} charges`);
      data.charges.forEach(charge => {
        console.log(`  📄 Charge disponible: "${charge.propertyName}" (${charge.month}): ${charge.total}€`);
      });
    });
    // Calculer les métriques pour chaque appartement principal
    return Array.from(aggregatedData.entries()).map(([propertyName, data]) => {
      console.log(`\n🏠 === Analyse pour ${propertyName} ===`);
      
      // Calculer les revenus des 12 derniers mois
      const monthlyRevenues = new Map<string, number>();
      data.payments.forEach(payment => {
        const paymentDate = new Date(payment.paymentDate || payment.dueDate);
        const monthKey = `${paymentDate.getFullYear()}-${String(paymentDate.getMonth() + 1).padStart(2, '0')}`;
        const amount = payment.paidAmount || payment.contractRentAmount || payment.rentAmount || 0;
        
        if (!monthlyRevenues.has(monthKey)) {
          monthlyRevenues.set(monthKey, 0);
        }
        monthlyRevenues.set(monthKey, monthlyRevenues.get(monthKey)! + amount);
        
        console.log(`  💰 ${payment.property} (${monthKey}): +${amount}€`);
      });

      // Calculer les charges des 12 derniers mois
      const monthlyChargesMap = new Map<string, number>();
      data.charges.forEach(charge => {
        const monthKey = charge.month;
        const chargeAmount = charge.total;
        monthlyChargesMap.set(monthKey, (monthlyChargesMap.get(monthKey) || 0) + chargeAmount);
        console.log(`  💸 ${charge.propertyName} (${monthKey}): +${chargeAmount}€ (total charges ce mois)`);
      });
      
      // Afficher un message si aucune charge n'est trouvée
      if (data.charges.length === 0) {
        console.log(`  ⚠️ Aucune charge trouvée pour ${propertyName}`);
      }

      // Calcul des totaux
      const annualRevenue = Array.from(monthlyRevenues.values()).reduce((sum, amount) => sum + amount, 0);
      const annualCharges = Array.from(monthlyChargesMap.values()).reduce((sum, amount) => sum + amount, 0);
      
      // CORRECTION: Calcul correct des moyennes mensuelles
      // Utiliser le nombre de mois réels où il y a eu des données, pas forcer /12
      const monthsWithRevenue = monthlyRevenues.size > 0 ? monthlyRevenues.size : 1;
      const monthsWithCharges = monthlyChargesMap.size > 0 ? monthlyChargesMap.size : 1;
      
      // Moyennes mensuelles réelles basées sur les données existantes
      const avgMonthlyRevenue = annualRevenue / monthsWithRevenue;
      const avgMonthlyCharges = annualCharges / monthsWithCharges;
      
      // Pour l'affichage, utiliser ces moyennes réelles
      const monthlyRevenue = avgMonthlyRevenue;
      const monthlyCharges = avgMonthlyCharges;
      
      const monthlyProfit = monthlyRevenue - monthlyCharges;
      const annualProfit = annualRevenue - annualCharges;
      const profitMargin = annualRevenue > 0 ? (annualProfit / annualRevenue) * 100 : 0;
      
      // ROI basé sur une estimation plus conservative
      const estimatedPropertyValue = monthlyRevenue * 120;
      const roi = estimatedPropertyValue > 0 ? (annualProfit / estimatedPropertyValue) * 100 : 0;

      console.log(`📊 === Résultats pour ${propertyName} ===`);
      console.log(`  📅 Mois avec revenus: ${monthsWithRevenue}, avec charges: ${monthsWithCharges}`);
      console.log(`  💰 Revenus annuels totaux: ${annualRevenue.toLocaleString()}€`);
      console.log(`  💸 Charges annuelles totales: ${annualCharges.toLocaleString()}€`);
      console.log(`  📈 Revenus mensuels moyens: ${monthlyRevenue.toLocaleString()}€ (${annualRevenue}€ ÷ ${monthsWithRevenue} mois)`);
      console.log(`  📉 Charges mensuelles moyennes: ${monthlyCharges.toLocaleString()}€ (${annualCharges}€ ÷ ${monthsWithCharges} mois)`);
      console.log(`  💚 Profit mensuel: ${monthlyProfit.toLocaleString()}€`);
      console.log(`  📊 Marge: ${profitMargin.toFixed(1)}%`);
      console.log(`  🎯 ROI: ${roi.toFixed(1)}%`);
      
      // Recalculer les valeurs annuelles pour l'affichage (projection sur 12 mois)
      const projectedAnnualRevenue = monthlyRevenue * 12;
      const projectedAnnualCharges = monthlyCharges * 12;
      const projectedAnnualProfit = projectedAnnualRevenue - projectedAnnualCharges;

      return {
        propertyName,
        monthlyRevenue,
        annualRevenue: projectedAnnualRevenue,
        monthlyCharges,
        annualCharges: projectedAnnualCharges,
        monthlyProfit,
        annualProfit: projectedAnnualProfit,
        profitMargin,
        roi
      };
    });
  }, [payments, charges]);

  // Résumé financier global
  const financialSummary = useMemo<FinancialSummary>(() => {
    const totalMonthlyRevenue = propertyFinancials.reduce((sum, prop) => sum + prop.monthlyRevenue, 0);
    const totalAnnualRevenue = propertyFinancials.reduce((sum, prop) => sum + prop.annualRevenue, 0);
    const totalMonthlyCharges = propertyFinancials.reduce((sum, prop) => sum + prop.monthlyCharges, 0);
    const totalAnnualCharges = propertyFinancials.reduce((sum, prop) => sum + prop.annualCharges, 0);
    const totalMonthlyProfit = totalMonthlyRevenue - totalMonthlyCharges;
    const totalAnnualProfit = totalAnnualRevenue - totalAnnualCharges;
    const averageProfitMargin = totalAnnualRevenue > 0 ? (totalAnnualProfit / totalAnnualRevenue) * 100 : 0;

    return {
      totalMonthlyRevenue,
      totalAnnualRevenue,
      totalMonthlyCharges,
      totalAnnualCharges,
      totalMonthlyProfit,
      totalAnnualProfit,
      averageProfitMargin,
      propertiesData: propertyFinancials
    };
  }, [propertyFinancials]);

  // Capacité d'investissement
  const investmentCapacity = useMemo<InvestmentCapacity>(() => {
    const monthlyProfit = financialSummary.totalMonthlyProfit;
    const safetyBuffer = 0.3; // Garder 30% de marge de sécurité
    const availableForInvestment = monthlyProfit * (1 - safetyBuffer);
    
    // Budget mensuel maximum pour un prêt (50% du profit disponible)
    const monthlyBudgetForLoan = availableForInvestment * 0.5;
    
    // Estimation du prix maximum de propriété (basé sur un prêt sur 20 ans à 3.5%)
    const loanRate = 0.035 / 12; // 3.5% annuel en mensuel
    const loanTermMonths = 20 * 12; // 20 ans
    const maxLoanAmount = monthlyBudgetForLoan > 0 ? 
      (monthlyBudgetForLoan * (1 - Math.pow(1 + loanRate, -loanTermMonths))) / loanRate : 0;
    
    // Apport recommandé (20% du prix total)
    const recommendedDownPayment = maxLoanAmount * 0.25; // 20% d'apport sur 125% (80% prêt + 20% apport)
    const maxPropertyPrice = maxLoanAmount + recommendedDownPayment;

    // Évaluation du niveau de risque
    let riskLevel: 'low' | 'medium' | 'high' = 'high';
    if (monthlyProfit > 2000 && financialSummary.averageProfitMargin > 30) {
      riskLevel = 'low';
    } else if (monthlyProfit > 1000 && financialSummary.averageProfitMargin > 20) {
      riskLevel = 'medium';
    }

    // Recommandations
    const recommendations: string[] = [];
    if (monthlyProfit < 500) {
      recommendations.push("Optimisez d'abord la rentabilité de vos propriétés actuelles");
    }
    if (financialSummary.averageProfitMargin < 20) {
      recommendations.push("Réduisez les charges pour améliorer la marge bénéficiaire");
    }
    if (riskLevel === 'low') {
      recommendations.push("Vous êtes dans une position favorable pour investir");
    }
    if (maxPropertyPrice > 100000) {
      recommendations.push("Considérez l'achat d'une propriété de gamme moyenne");
    } else if (maxPropertyPrice > 50000) {
      recommendations.push("Recherchez des opportunités dans l'immobilier locatif d'entrée de gamme");
    } else {
      recommendations.push("Concentrez-vous sur l'amélioration de vos revenus actuels avant d'investir");
    }

    return {
      availableForInvestment,
      maxPropertyPrice,
      recommendedDownPayment,
      monthlyBudgetForLoan,
      riskLevel,
      recommendations
    };
  }, [financialSummary]);

  return {
    propertyFinancials,
    financialSummary,
    investmentCapacity,
    loading: false, // Les hooks de base gèrent déjà le loading
    error: null
  };
};