
import { useState, useEffect } from 'react';
import { useFirebasePayments } from '@/hooks/useFirebasePayments';

export const useForecastingCalculations = () => {
  const { payments } = useFirebasePayments();
  
  // État pour les prévisions
  const [targetPropertyPrice, setTargetPropertyPrice] = useState('');
  const [targetPropertyRent, setTargetPropertyRent] = useState('');
  const [downPaymentPercent, setDownPaymentPercent] = useState('20');
  const [loanRate, setLoanRate] = useState('3.5');
  const [loanDuration, setLoanDuration] = useState('20');
  const [monthlySavingsGoal, setMonthlySavingsGoal] = useState('');
  const [timeframe, setTimeframe] = useState('12');
  const [propertyType, setPropertyType] = useState('');
  const [notes, setNotes] = useState('');

  // Calculs automatiques
  const [currentMonthlyRevenue, setCurrentMonthlyRevenue] = useState(0);
  const [projectedSavings, setProjectedSavings] = useState(0);
  const [requiredDownPayment, setRequiredDownPayment] = useState(0);
  const [monthlyLoanPayment, setMonthlyLoanPayment] = useState(0);
  const [profitability, setProfitability] = useState(0);

  // Calculer les revenus actuels basés sur les vrais paiements reçus
  useEffect(() => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    // Calculer les revenus réels du mois en cours basés sur les paiements effectués
    const monthlyRevenueFromPayments = payments
      .filter(payment => {
        if (!payment.paymentDate || payment.status !== 'Payé') return false;
        const paymentDate = new Date(payment.paymentDate);
        return paymentDate.getMonth() === currentMonth && 
               paymentDate.getFullYear() === currentYear;
      })
      .reduce((sum, payment) => {
        // Utiliser le montant réellement payé (paidAmount) ou le montant du loyer
        const amountReceived = payment.paidAmount || payment.rentAmount || 0;
        return sum + amountReceived;
      }, 0);

    console.log('🔍 CALCUL REVENUS PRÉVISIONS:', {
      paymentsThisMonth: payments.filter(p => {
        if (!p.paymentDate) return false;
        const paymentDate = new Date(p.paymentDate);
        return paymentDate.getMonth() === currentMonth && 
               paymentDate.getFullYear() === currentYear &&
               p.status === 'Payé';
      }),
      totalRevenue: monthlyRevenueFromPayments
    });

    setCurrentMonthlyRevenue(monthlyRevenueFromPayments);
  }, [payments]);

  // Calculs des prévisions
  useEffect(() => {
    const price = parseFloat(targetPropertyPrice) || 0;
    const rent = parseFloat(targetPropertyRent) || 0;
    const downPercent = parseFloat(downPaymentPercent) || 20;
    const rate = parseFloat(loanRate) || 3.5;
    const duration = parseFloat(loanDuration) || 20;
    const savingsGoal = parseFloat(monthlySavingsGoal) || 0;
    const months = parseInt(timeframe) || 12;

    // Apport requis
    const downPayment = (price * downPercent) / 100;
    setRequiredDownPayment(downPayment);

    // Mensualité de crédit
    if (price > 0 && rate > 0 && duration > 0) {
      const loanAmount = price - downPayment;
      const monthlyRate = rate / 100 / 12;
      const totalPayments = duration * 12;
      const monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) / (Math.pow(1 + monthlyRate, totalPayments) - 1);
      setMonthlyLoanPayment(monthlyPayment);

      // Rentabilité (loyer - mensualité)
      setProfitability(rent - monthlyPayment);
    }

    // Économies projetées
    setProjectedSavings(savingsGoal * months);
  }, [targetPropertyPrice, targetPropertyRent, downPaymentPercent, loanRate, loanDuration, monthlySavingsGoal, timeframe]);

  const canAffordProperty = projectedSavings >= requiredDownPayment;
  const monthsToSave = requiredDownPayment > 0 && parseFloat(monthlySavingsGoal) > 0 
    ? Math.ceil(requiredDownPayment / parseFloat(monthlySavingsGoal)) 
    : 0;

  return {
    // State
    targetPropertyPrice,
    setTargetPropertyPrice,
    targetPropertyRent,
    setTargetPropertyRent,
    downPaymentPercent,
    setDownPaymentPercent,
    loanRate,
    setLoanRate,
    loanDuration,
    setLoanDuration,
    monthlySavingsGoal,
    setMonthlySavingsGoal,
    timeframe,
    setTimeframe,
    propertyType,
    setPropertyType,
    notes,
    setNotes,
    
    // Calculated values
    currentMonthlyRevenue,
    projectedSavings,
    requiredDownPayment,
    monthlyLoanPayment,
    profitability,
    canAffordProperty,
    monthsToSave
  };
};
