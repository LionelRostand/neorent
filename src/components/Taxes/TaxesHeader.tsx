
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface TaxesHeaderProps {
  onNewDeclaration: () => void;
}

const TaxesHeader = ({ onNewDeclaration }: TaxesHeaderProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
      <div className="space-y-1 sm:space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{t('taxes.fiscalities')}</h1>
        <p className="text-sm sm:text-base text-gray-600">{t('taxes.manageFiscalObligations')}</p>
      </div>
      <Button 
        className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
        onClick={onNewDeclaration}
      >
        <Plus className="mr-2 h-4 w-4" />
        <span className="hidden sm:inline">{t('taxes.newDeclaration')}</span>
        <span className="sm:hidden">Nouvelle Déclaration</span>
      </Button>
    </div>
  );
};

export default TaxesHeader;
