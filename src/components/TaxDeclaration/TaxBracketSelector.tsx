
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { taxBrackets, getCurrencySymbol } from '@/utils/taxBrackets';

interface TaxBracketSelectorProps {
  taxBracket: string;
  onTaxBracketChange: (bracket: string) => void;
  country: string;
}

const TaxBracketSelector = ({ taxBracket, onTaxBracketChange, country }: TaxBracketSelectorProps) => {
  const { t } = useTranslation();
  const countryBrackets = taxBrackets[country] || taxBrackets.FR;
  const currencySymbol = getCurrencySymbol(country);

  return (
    <div className="space-y-2">
      <Label htmlFor="taxBracket">{t('taxes.marginalTaxBracket')}</Label>
      <Select value={taxBracket} onValueChange={onTaxBracketChange}>
        <SelectTrigger>
          <SelectValue placeholder={t('taxes.selectTaxBracket')} />
        </SelectTrigger>
        <SelectContent>
          {countryBrackets.map((bracket, index) => (
            <SelectItem key={index} value={bracket.rate.toString()}>
              {bracket.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {country === 'AE' && (
        <p className="text-sm text-green-600 mt-2">
          ✅ Les Émirats Arabes Unis n'imposent pas les revenus des particuliers
        </p>
      )}
    </div>
  );
};

export default TaxBracketSelector;
