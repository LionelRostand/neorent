
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Receipt } from 'lucide-react';
import ChargeCard from './ChargeCard';

interface ChargeData {
  id: string;
  propertyName: string;
  propertyType: string;
  month: string;
  electricity: number;
  water: number;
  heating: number;
  maintenance: number;
  insurance: number;
  garbage: number;
  internet: number;
  total: number;
  tenant: string;
}

interface ChargesListProps {
  charges: ChargeData[];
  selectedMonth: string;
  onDeleteCharge: (id: string) => void;
}

const ChargesList: React.FC<ChargesListProps> = ({
  charges,
  selectedMonth,
  onDeleteCharge
}) => {
  const { t } = useTranslation();

  const formatMonthYear = (monthString: string) => {
    const date = new Date(monthString + '-01');
    return date.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900">
        {t('rentalCharges.chargesForMonth')} {formatMonthYear(selectedMonth)}
      </h2>
      
      <div className="grid grid-cols-1 gap-6">
        {charges.map((charge) => (
          <ChargeCard
            key={charge.id}
            charge={charge}
            onDelete={onDeleteCharge}
          />
        ))}
      </div>

      {charges.length === 0 && (
        <div className="text-center py-12">
          <Receipt className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">{t('rentalCharges.noCharges')}</h3>
          <p className="mt-2 text-gray-500">
            {t('rentalCharges.noChargesDescription')} {formatMonthYear(selectedMonth)}.
          </p>
        </div>
      )}
    </div>
  );
};

export default ChargesList;
