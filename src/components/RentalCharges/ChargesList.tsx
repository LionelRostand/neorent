
import React from 'react';
import { Receipt } from 'lucide-react';
import ChargeCard from './ChargeCard';

interface ChargeData {
  id: string; // Changed from number to string for Firebase compatibility
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
  onDeleteCharge: (id: string) => void; // Changed from number to string
}

const ChargesList: React.FC<ChargesListProps> = ({
  charges,
  selectedMonth,
  onDeleteCharge
}) => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900">
        Charges - {new Date(selectedMonth + '-01').toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
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
          <h3 className="mt-4 text-lg font-medium text-gray-900">Aucune charge</h3>
          <p className="mt-2 text-gray-500">
            Aucune charge trouvée pour {new Date(selectedMonth + '-01').toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}.
          </p>
        </div>
      )}
    </div>
  );
};

export default ChargesList;
