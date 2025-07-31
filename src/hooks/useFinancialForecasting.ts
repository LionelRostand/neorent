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
    // Grouper les paiements par propriété (12 derniers mois)
    const now = new Date();
    const lastYear = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
    
    const recentPayments = payments.filter(payment => {
      return payment.status === 'Payé' && new Date(payment.paymentDate || payment.dueDate) >= lastYear;
    });

    const recentCharges = charges.filter(charge => {
      const chargeDate = new Date(charge.month + '-01');
      return chargeDate >= lastYear;
    });

    // Fonction pour extraire le nom de l'appartement principal
    const getMainPropertyName = (propertyName: string): string => {
      // Extraire "Appartement X" du nom complet
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

    // Agréger les charges par appartement principal
    recentCharges.forEach(charge => {
      const mainPropertyKey = getMainPropertyName(charge.propertyName);
      if (!aggregatedData.has(mainPropertyKey)) {
        aggregatedData.set(mainPropertyKey, { payments: [], charges: [] });
      }
      aggregatedData.get(mainPropertyKey)!.charges.push(charge);
    });

    // Calculer les métriques pour chaque appartement principal
    return Array.from(aggregatedData.entries()).map(([propertyName, data]) => {
      console.log(`🏠 Calcul pour ${propertyName}:`);
      
      // Calculer les revenus annuels (somme de tous les paiements des chambres)
      const annualRevenue = data.payments.reduce((sum, payment) => {
        const amount = payment.paidAmount || payment.contractRentAmount || payment.rentAmount || 0;
        console.log(`  💰 Paiement de ${payment.property}: ${amount}€`);
        return sum + amount;
      }, 0);

      // Calculer les charges annuelles (somme de toutes les charges)
      const annualCharges = data.charges.reduce((sum, charge) => {
        console.log(`  💸 Charges de ${charge.propertyName}: ${charge.total}€`);
        return sum + charge.total;
      }, 0);

      const monthlyRevenue = annualRevenue / 12;
      const monthlyCharges = annualCharges / 12;
      const monthlyProfit = monthlyRevenue - monthlyCharges;
      const annualProfit = annualRevenue - annualCharges;
      const profitMargin = annualRevenue > 0 ? (annualProfit / annualRevenue) * 100 : 0;
      
      // ROI approximation basé sur la valeur estimée de l'appartement complet
      const estimatedPropertyValue = monthlyRevenue * 120; // Plus conservateur pour un appartement entier
      const roi = estimatedPropertyValue > 0 ? (annualProfit / estimatedPropertyValue) * 100 : 0;

      console.log(`📊 Résultats pour ${propertyName}:`);
      console.log(`  Revenus annuels: ${annualRevenue}€`);
      console.log(`  Charges annuelles: ${annualCharges}€`);
      console.log(`  Profit mensuel: ${monthlyProfit}€`);
      console.log(`  Marge: ${profitMargin.toFixed(1)}%`);
      console.log(`  ROI: ${roi.toFixed(1)}%`);

      return {
        propertyName,
        monthlyRevenue,
        annualRevenue,
        monthlyCharges,
        annualCharges,
        monthlyProfit,
        annualProfit,
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