
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import RentPaymentForm from '@/components/RentPaymentForm';

const FinancesHeader = () => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Finances</h1>
        <p className="text-gray-600 mt-2">Suivi des revenus et dépenses</p>
      </div>
      <div className="flex gap-2">
        <RentPaymentForm />
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="mr-2 h-4 w-4" />
          Ajouter transaction
        </Button>
      </div>
    </div>
  );
};

export default FinancesHeader;
