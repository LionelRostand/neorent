
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  TrendingUp,
  Calculator,
  PiggyBank,
  Building,
  Euro,
  Calendar,
  Target,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { useFirebaseProperties } from '@/hooks/useFirebaseProperties';
import { useFirebaseRoommates } from '@/hooks/useFirebaseRoommates';
import MainLayout from '@/components/Layout/MainLayout';

const Forecasting = () => {
  const { properties } = useFirebaseProperties();
  const { roommates } = useFirebaseRoommates();
  
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

  // Calculer les revenus actuels
  useEffect(() => {
    const totalRevenue = properties.reduce((sum, property) => {
      const activeRoommates = roommates.filter(roommate => 
        roommate.property === property.title && roommate.status === 'Actif'
      );

      if (property.locationType === 'Colocation') {
        const rentPerRoom = parseFloat((property.creditImmobilier || property.rent || '0').toString().replace(/[^0-9.-]+/g, '')) / (property.totalRooms || 1);
        return sum + (rentPerRoom * activeRoommates.length);
      } else {
        if (activeRoommates.length > 0) {
          const rentValue = property.creditImmobilier || property.rent || '0';
          const numericRent = parseFloat(rentValue.toString().replace(/[^0-9.-]+/g, ''));
          return sum + (isNaN(numericRent) ? 0 : numericRent);
        }
        return sum;
      }
    }, 0);

    setCurrentMonthlyRevenue(totalRevenue);
  }, [properties, roommates]);

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
  const monthsToSave = requiredDownPayment > 0 && monthlySavingsGoal > 0 
    ? Math.ceil(requiredDownPayment / parseFloat(monthlySavingsGoal)) 
    : 0;

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-green-600" />
              Prévisions d'investissement
            </h1>
            <p className="text-gray-600 mt-2">
              Planifiez vos futurs investissements immobiliers basés sur vos revenus actuels
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Revenus actuels */}
          <div className="lg:col-span-1">
            <Card className="h-fit">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-800">
                  <PiggyBank className="h-5 w-5" />
                  Situation actuelle
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm text-gray-600">Revenus mensuels actuels</Label>
                  <div className="text-2xl font-bold text-green-600">
                    {Math.round(currentMonthlyRevenue).toLocaleString()}€
                  </div>
                  <p className="text-xs text-gray-500">
                    {properties.length} propriété(s) en portefeuille
                  </p>
                </div>

                <Separator />

                <div>
                  <Label className="text-sm text-gray-600">Capacité d'épargne recommandée</Label>
                  <div className="text-lg font-semibold text-blue-600">
                    {Math.round(currentMonthlyRevenue * 0.3).toLocaleString()}€/mois
                  </div>
                  <p className="text-xs text-gray-500">
                    30% des revenus locatifs
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Formulaire de prévision */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-800">
                  <Calculator className="h-5 w-5" />
                  Simulation d'investissement
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="propertyPrice" className="flex items-center gap-2">
                      <Euro className="h-4 w-4" />
                      Prix du bien ciblé
                    </Label>
                    <Input
                      id="propertyPrice"
                      type="number"
                      placeholder="250000"
                      value={targetPropertyPrice}
                      onChange={(e) => setTargetPropertyPrice(e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="propertyRent">Loyer mensuel estimé</Label>
                    <Input
                      id="propertyRent"
                      type="number"
                      placeholder="1200"
                      value={targetPropertyRent}
                      onChange={(e) => setTargetPropertyRent(e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="downPayment">Apport personnel (%)</Label>
                    <Select value={downPaymentPercent} onValueChange={setDownPaymentPercent}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">10%</SelectItem>
                        <SelectItem value="15">15%</SelectItem>
                        <SelectItem value="20">20%</SelectItem>
                        <SelectItem value="25">25%</SelectItem>
                        <SelectItem value="30">30%</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="loanRate">Taux d'intérêt (%)</Label>
                    <Input
                      id="loanRate"
                      type="number"
                      step="0.1"
                      placeholder="3.5"
                      value={loanRate}
                      onChange={(e) => setLoanRate(e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="loanDuration">Durée du prêt (années)</Label>
                    <Select value={loanDuration} onValueChange={setLoanDuration}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 ans</SelectItem>
                        <SelectItem value="20">20 ans</SelectItem>
                        <SelectItem value="25">25 ans</SelectItem>
                        <SelectItem value="30">30 ans</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="propertyType">Type de bien</Label>
                    <Select value={propertyType} onValueChange={setPropertyType}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="apartment">Appartement</SelectItem>
                        <SelectItem value="house">Maison</SelectItem>
                        <SelectItem value="studio">Studio</SelectItem>
                        <SelectItem value="colocation">Colocation</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="monthlySavings">Épargne mensuelle possible</Label>
                    <Input
                      id="monthlySavings"
                      type="number"
                      placeholder="800"
                      value={monthlySavingsGoal}
                      onChange={(e) => setMonthlySavingsGoal(e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="timeframe">Horizon d'investissement</Label>
                    <Select value={timeframe} onValueChange={setTimeframe}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="6">6 mois</SelectItem>
                        <SelectItem value="12">1 an</SelectItem>
                        <SelectItem value="18">18 mois</SelectItem>
                        <SelectItem value="24">2 ans</SelectItem>
                        <SelectItem value="36">3 ans</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="notes">Notes sur le projet</Label>
                  <Textarea
                    id="notes"
                    placeholder="Décrivez votre projet d'investissement..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="mt-1"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Résultats de la simulation */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-800">
                  <Target className="h-5 w-5" />
                  Résultats de la simulation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Building className="h-5 w-5 text-blue-600" />
                      <span className="text-sm font-medium text-blue-800">Apport requis</span>
                    </div>
                    <div className="text-2xl font-bold text-blue-600">
                      {requiredDownPayment.toLocaleString()}€
                    </div>
                    <p className="text-xs text-blue-700">
                      {downPaymentPercent}% du prix d'achat
                    </p>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <PiggyBank className="h-5 w-5 text-green-600" />
                      <span className="text-sm font-medium text-green-800">Épargne projetée</span>
                    </div>
                    <div className="text-2xl font-bold text-green-600">
                      {projectedSavings.toLocaleString()}€
                    </div>
                    <p className="text-xs text-green-700">
                      Sur {timeframe} mois
                    </p>
                  </div>

                  <div className="bg-orange-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Calculator className="h-5 w-5 text-orange-600" />
                      <span className="text-sm font-medium text-orange-800">Mensualité crédit</span>
                    </div>
                    <div className="text-2xl font-bold text-orange-600">
                      {Math.round(monthlyLoanPayment).toLocaleString()}€
                    </div>
                    <p className="text-xs text-orange-700">
                      Sur {loanDuration} ans à {loanRate}%
                    </p>
                  </div>

                  <div className={`p-4 rounded-lg ${profitability >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className={`h-5 w-5 ${profitability >= 0 ? 'text-green-600' : 'text-red-600'}`} />
                      <span className={`text-sm font-medium ${profitability >= 0 ? 'text-green-800' : 'text-red-800'}`}>
                        Cash-flow mensuel
                      </span>
                    </div>
                    <div className={`text-2xl font-bold ${profitability >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {profitability >= 0 ? '+' : ''}{Math.round(profitability).toLocaleString()}€
                    </div>
                    <p className={`text-xs ${profitability >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                      Loyer - Mensualité
                    </p>
                  </div>
                </div>

                <Separator className="my-6" />

                {/* Faisabilité du projet */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">Analyse de faisabilité</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className={`p-4 rounded-lg border-2 ${canAffordProperty ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                      <div className="flex items-center gap-2 mb-2">
                        {canAffordProperty ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-red-600" />
                        )}
                        <span className={`font-medium ${canAffordProperty ? 'text-green-800' : 'text-red-800'}`}>
                          Capacité de financement
                        </span>
                      </div>
                      <p className={`text-sm ${canAffordProperty ? 'text-green-700' : 'text-red-700'}`}>
                        {canAffordProperty 
                          ? "Vous pouvez financer ce projet avec votre épargne projetée !"
                          : `Il vous manque ${(requiredDownPayment - projectedSavings).toLocaleString()}€ pour cet investissement.`
                        }
                      </p>
                    </div>

                    <div className="p-4 rounded-lg border border-blue-200 bg-blue-50">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="h-5 w-5 text-blue-600" />
                        <span className="font-medium text-blue-800">Délai d'épargne</span>
                      </div>
                      <p className="text-sm text-blue-700">
                        {monthsToSave > 0 
                          ? `${monthsToSave} mois nécessaires pour constituer l'apport`
                          : "Renseignez votre capacité d'épargne mensuelle"
                        }
                      </p>
                    </div>
                  </div>

                  {/* Recommandations */}
                  <div className="p-4 rounded-lg bg-yellow-50 border border-yellow-200">
                    <h5 className="font-medium text-yellow-800 mb-2">Recommandations</h5>
                    <ul className="text-sm text-yellow-700 space-y-1">
                      {profitability < 0 && (
                        <li>• Ce bien génèrerait un cash-flow négatif. Considérez un bien moins cher ou avec un loyer plus élevé.</li>
                      )}
                      {!canAffordProperty && (
                        <li>• Augmentez votre épargne mensuelle ou prolongez votre horizon d'investissement.</li>
                      )}
                      {currentMonthlyRevenue > 0 && (
                        <li>• Vos revenus actuels de {Math.round(currentMonthlyRevenue)}€/mois permettent une bonne capacité d'investissement.</li>
                      )}
                      <li>• Prévoyez également les frais de notaire (7-8% du prix) et les travaux éventuels.</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Forecasting;
