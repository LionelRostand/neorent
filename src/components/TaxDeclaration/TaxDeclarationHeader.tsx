
import React from 'react';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calculator } from 'lucide-react';

interface TaxDeclarationHeaderProps {
  declarationYear: number;
}

const TaxDeclarationHeader = ({ declarationYear }: TaxDeclarationHeaderProps) => {
  return (
    <DialogHeader>
      <DialogTitle className="flex items-center gap-2">
        <Calculator className="h-5 w-5" />
        Nouvelle Déclaration Fiscale - {declarationYear}
      </DialogTitle>
    </DialogHeader>
  );
};

export default TaxDeclarationHeader;
