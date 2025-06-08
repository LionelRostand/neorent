
import { useState } from 'react';

const mockCharges = [
  {
    id: 1,
    propertyName: 'Appartement Rue des Fleurs',
    propertyType: 'Location',
    month: '2024-12',
    electricity: 85.50,
    water: 42.30,
    heating: 120.00,
    maintenance: 35.00,
    insurance: 28.50,
    garbage: 15.20,
    internet: 29.99,
    total: 356.49,
    tenant: 'Marie Dubois'
  },
  {
    id: 2,
    propertyName: 'Appartement Bastille - Chambre 1',
    propertyType: 'Colocation',
    month: '2024-12',
    electricity: 35.20,
    water: 18.50,
    heating: 55.00,
    maintenance: 15.00,
    insurance: 12.25,
    garbage: 6.80,
    internet: 12.50,
    total: 155.25,
    tenant: 'Sophie Leroy'
  },
  {
    id: 3,
    propertyName: 'Villa Montparnasse',
    propertyType: 'Location',
    month: '2024-12',
    electricity: 125.80,
    water: 68.40,
    heating: 180.00,
    maintenance: 50.00,
    insurance: 45.30,
    garbage: 22.50,
    internet: 35.99,
    total: 527.99,
    tenant: 'Jean Martin'
  }
];

export const useChargesData = () => {
  const [charges, setCharges] = useState(mockCharges);

  const addCharge = (chargeData: any) => {
    const total = chargeData.electricity + chargeData.water + chargeData.heating + 
                  chargeData.maintenance + chargeData.insurance + chargeData.garbage + 
                  chargeData.internet;
    
    const newCharge = {
      id: charges.length + 1,
      ...chargeData,
      total
    };
    
    setCharges(prev => [...prev, newCharge]);
    console.log('Nouvelles charges ajoutées:', newCharge);
  };

  const deleteCharge = (id: number) => {
    setCharges(prev => prev.filter(charge => charge.id !== id));
  };

  return {
    charges,
    addCharge,
    deleteCharge
  };
};
