
import React from 'react';
import { useTranslation } from 'react-i18next';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calculator } from 'lucide-react';

interface TaxDeclarationHeaderProps {
  declarationYear: number;
}

const TaxDeclarationHeader = ({ declarationYear }: TaxDeclarationHeaderProps) => {
  const { t } = useTranslation();

  return (
    <DialogHeader>
      <DialogTitle className="flex items-center gap-2">
        <Calculator className="h-5 w-5" />
        {t('taxes.newTaxDeclaration')}
      </DialogTitle>
    </DialogHeader>
  );
};

export default TaxDeclarationHeader;
