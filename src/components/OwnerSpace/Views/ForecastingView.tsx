
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TrendingUp, Calculator, DollarSign, PieChart } from 'lucide-react';
import { useOwnerData } from '@/hooks/useOwnerData';

interface ForecastingViewProps {
  currentProfile: any;
}

const ForecastingView: React.FC<ForecastingViewProps> = ({ currentProfile }) => {
  const { i18n } = useTranslation();
  const { tenants, properties } = useOwnerData(currentProfile);
  
  const [targetPrice, setTargetPrice] = useState('250000');
  const [estimatedRent, setEstimatedRent] = useState('1200');
  const [personalContribution, setPersonalContribution] = useState('20');
  const [loanRate, setLoanRate] = useState('3.5');

  // Get texts based on current language
  const getLocalizedText = (key: string) => {
    const currentLang = i18n.language;
    
    const texts: Record<string, Record<string, string>> = {
      title: {
        fr: 'Prévisions Financières',
        en: 'Financial Forecasting'
      },
      subtitle: {
        fr: 'Analysez et planifiez vos investissements immobiliers',
        en: 'Analyze and plan your real estate investments'
      },
      currentRevenue: {
        fr: 'Revenus Actuels',
        en: 'Current Revenue'
      },
      monthlyRevenue: {
        fr: 'Revenus mensuels:',
        en: 'Monthly revenue:'
      },
      properties: {
        fr: 'Propriétés:',
        en: 'Properties:'
      },
      tenants: {
        fr: 'Locataires:',
        en: 'Tenants:'
      },
      investmentPlanning: {
        fr: 'Planification d\'Investissement',
        en: 'Investment Planning'
      },
      targetPrice: {
        fr: 'Prix de la propriété cible (€)',
        en: 'Target property price (€)'
      },
      estimatedRent: {
        fr: 'Loyer mensuel estimé (€)',
        en: 'Estimated monthly rent (€)'
      },
      personalContribution: {
        fr: 'Apport personnel (%)',
        en: 'Personal contribution (%)'
      },
      loanRate: {
        fr: 'Taux d\'emprunt (%)',
        en: 'Loan rate (%)'
      },
      simulationResults: {
        fr: 'Résultats de Simulation',
        en: 'Simulation Results'
      },
      calculate: {
        fr: 'Calculer',
        en: 'Calculate'
      },
      monthlyLoanPayment: {
        fr: 'Mensualité de prêt:',
        en: 'Monthly loan payment:'
      },
      netCashFlow: {
        fr: 'Cash-flow net:',
        en: 'Net cash flow:'
      },
      annualYield: {
        fr: 'Rendement annuel:',
        en: 'Annual yield:'
      },
      roiTime: {
        fr: 'Retour sur investissement:',
        en: 'Return on investment:'
      }
    };

    return texts[key]?.[currentLang] || texts[key]?.['fr'] || key;
  };

  // Calculate current revenue
  const currentMonthlyRevenue = tenants.reduce((sum, tenant) => {
    if (tenant.status === 'Actif') {
      return sum + (parseFloat(tenant.rentAmount?.toString() || '0') || 0);
    }
    return sum;
  }, 0);

  // Simulation calculations
  const price = parseFloat(targetPrice) || 0;
  const rent = parseFloat(estimatedRent) || 0;
  const contribution = parseFloat(personalContribution) || 0;
  const rate = parseFloat(loanRate) || 0;

  const loanAmount = price * (1 - contribution / 100);
  const monthlyRate = rate / 100 / 12;
  const monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, 300)) / (Math.pow(1 + monthlyRate, 300) - 1);
  const netCashFlow = rent - monthlyPayment;
  const annualYield = ((rent * 12) / price) * 100;

  return (
    <div className="p-6 space-y-6">
      {/* Header harmonisé */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <TrendingUp className="h-8 w-8" />
              {getLocalizedText('title')}
            </h1>
            <p className="text-emerald-100 mt-2">{getLocalizedText('subtitle')}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current Revenue */}
        <Card className="shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b">
            <CardTitle className="text-xl text-gray-800">{getLocalizedText('currentRevenue')}</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between text-lg">
                <span className="text-gray-600">{getLocalizedText('monthlyRevenue')}</span>
                <span className="font-bold text-2xl text-green-600">{currentMonthlyRevenue}€</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">{getLocalizedText('properties')}</span>
                <span className="font-semibold">{properties.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">{getLocalizedText('tenants')}</span>
                <span className="font-semibold">{tenants.filter(t => t.status === 'Actif').length}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Investment Planning */}
        <Card className="shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b">
            <CardTitle className="text-xl text-gray-800">{getLocalizedText('investmentPlanning')}</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="targetPrice">{getLocalizedText('targetPrice')}</Label>
                <Input
                  id="targetPrice"
                  type="number"
                  value={targetPrice}
                  onChange={(e) => setTargetPrice(e.target.value)}
                  placeholder="250000"
                />
              </div>
              <div>
                <Label htmlFor="estimatedRent">{getLocalizedText('estimatedRent')}</Label>
                <Input
                  id="estimatedRent"
                  type="number"
                  value={estimatedRent}
                  onChange={(e) => setEstimatedRent(e.target.value)}
                  placeholder="1200"
                />
              </div>
              <div>
                <Label htmlFor="personalContribution">{getLocalizedText('personalContribution')}</Label>
                <Input
                  id="personalContribution"
                  type="number"
                  value={personalContribution}
                  onChange={(e) => setPersonalContribution(e.target.value)}
                  placeholder="20"
                />
              </div>
              <div>
                <Label htmlFor="loanRate">{getLocalizedText('loanRate')}</Label>
                <Input
                  id="loanRate"
                  type="number"
                  step="0.1"
                  value={loanRate}
                  onChange={(e) => setLoanRate(e.target.value)}
                  placeholder="3.5"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Simulation Results */}
      <Card className="shadow-lg border-0">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b">
          <CardTitle className="text-xl text-gray-800 flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            {getLocalizedText('simulationResults')}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <DollarSign className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-sm text-gray-600 mb-1">{getLocalizedText('monthlyLoanPayment')}</div>
              <div className="text-xl font-bold text-blue-600">{monthlyPayment.toFixed(0)}€</div>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-sm text-gray-600 mb-1">{getLocalizedText('netCashFlow')}</div>
              <div className={`text-xl font-bold ${netCashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {netCashFlow >= 0 ? '+' : ''}{netCashFlow.toFixed(0)}€
              </div>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <PieChart className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="text-sm text-gray-600 mb-1">{getLocalizedText('annualYield')}</div>
              <div className="text-xl font-bold text-purple-600">{annualYield.toFixed(1)}%</div>
            </div>
            
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <Calculator className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <div className="text-sm text-gray-600 mb-1">{getLocalizedText('roiTime')}</div>
              <div className="text-xl font-bold text-orange-600">
                {netCashFlow > 0 ? `${Math.ceil((price * contribution / 100) / (netCashFlow * 12))} ans` : '∞'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForecastingView;
