
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calculator, Euro } from 'lucide-react';

interface SimulationFormProps {
  targetPropertyPrice: string;
  setTargetPropertyPrice: (value: string) => void;
  targetPropertyRent: string;
  setTargetPropertyRent: (value: string) => void;
  downPaymentPercent: string;
  setDownPaymentPercent: (value: string) => void;
  loanRate: string;
  setLoanRate: (value: string) => void;
  loanDuration: string;
  setLoanDuration: (value: string) => void;
  propertyType: string;
  setPropertyType: (value: string) => void;
  monthlySavingsGoal: string;
  setMonthlySavingsGoal: (value: string) => void;
  timeframe: string;
  setTimeframe: (value: string) => void;
  notes: string;
  setNotes: (value: string) => void;
}

const SimulationForm: React.FC<SimulationFormProps> = ({
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
  propertyType,
  setPropertyType,
  monthlySavingsGoal,
  setMonthlySavingsGoal,
  timeframe,
  setTimeframe,
  notes,
  setNotes
}) => {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-800">
          <Calculator className="h-5 w-5" />
          {t('forecasting.investmentSimulation')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="propertyPrice" className="flex items-center gap-2">
              <Euro className="h-4 w-4" />
              {t('forecasting.targetPropertyPrice')}
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
            <Label htmlFor="propertyRent">{t('forecasting.estimatedMonthlyRent')}</Label>
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
            <Label htmlFor="downPayment">{t('forecasting.downPaymentPercent')}</Label>
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
            <Label htmlFor="loanRate">{t('forecasting.interestRate')}</Label>
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
            <Label htmlFor="loanDuration">{t('forecasting.loanDuration')}</Label>
            <Select value={loanDuration} onValueChange={setLoanDuration}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">{t('forecasting.fifteenYears')}</SelectItem>
                <SelectItem value="20">{t('forecasting.twentyYears')}</SelectItem>
                <SelectItem value="25">{t('forecasting.twentyFiveYears')}</SelectItem>
                <SelectItem value="30">{t('forecasting.thirtyYears')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="propertyType">{t('forecasting.propertyType')}</Label>
            <Select value={propertyType} onValueChange={setPropertyType}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder={t('forecasting.selectPropertyType')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="apartment">{t('forecasting.apartment')}</SelectItem>
                <SelectItem value="house">{t('forecasting.house')}</SelectItem>
                <SelectItem value="studio">{t('forecasting.studio')}</SelectItem>
                <SelectItem value="colocation">{t('forecasting.colocation')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="monthlySavings">{t('forecasting.possibleMonthlySavings')}</Label>
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
            <Label htmlFor="timeframe">{t('forecasting.investmentHorizon')}</Label>
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="6">{t('forecasting.sixMonths')}</SelectItem>
                <SelectItem value="12">{t('forecasting.oneYear')}</SelectItem>
                <SelectItem value="18">{t('forecasting.eighteenMonths')}</SelectItem>
                <SelectItem value="24">{t('forecasting.twoYears')}</SelectItem>
                <SelectItem value="36">{t('forecasting.threeYears')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="notes">{t('forecasting.projectNotes')}</Label>
          <Textarea
            id="notes"
            placeholder={t('forecasting.describeYourProject')}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="mt-1"
            rows={3}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default SimulationForm;
