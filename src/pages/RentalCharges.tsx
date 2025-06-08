
import React, { useState } from 'react';
import MainLayout from '@/components/Layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Receipt, Building2, Calendar, DollarSign, Calculator, Trash2, Edit } from 'lucide-react';
import MetricCard from '@/components/MetricCard';
import RentalChargeForm from '@/components/RentalChargeForm';

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

const RentalCharges = () => {
  const [charges, setCharges] = useState(mockCharges);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState('2024-12');

  const filteredCharges = charges.filter(charge => charge.month === selectedMonth);
  
  const totalCharges = filteredCharges.reduce((sum, charge) => sum + charge.total, 0);
  const averageCharges = filteredCharges.length > 0 ? totalCharges / filteredCharges.length : 0;
  const propertiesCount = filteredCharges.length;
  const highestCharge = Math.max(...filteredCharges.map(c => c.total));

  const handleAddCharge = (chargeData: any) => {
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

  const handleDeleteCharge = (id: number) => {
    setCharges(prev => prev.filter(charge => charge.id !== id));
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Charges Locatives</h1>
            <p className="text-gray-600 mt-2">Gérez les charges de vos biens immobiliers</p>
          </div>
          <Button 
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() => setIsFormOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Ajouter des charges
          </Button>
        </div>

        {/* Sélecteur de mois */}
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">Filtrer par mois:</label>
          <select 
            value={selectedMonth} 
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1 text-sm"
          >
            <option value="2024-12">Décembre 2024</option>
            <option value="2024-11">Novembre 2024</option>
            <option value="2024-10">Octobre 2024</option>
          </select>
        </div>

        {/* Métriques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total des charges"
            value={`${totalCharges.toFixed(2)}€`}
            description={`Pour ${filteredCharges.length} bien${filteredCharges.length > 1 ? 's' : ''}`}
            icon={DollarSign}
            iconBgColor="bg-green-500"
            borderColor="border-l-green-500"
          />
          <MetricCard
            title="Moyenne par bien"
            value={`${averageCharges.toFixed(2)}€`}
            description="Charges moyennes mensuelles"
            icon={Calculator}
            iconBgColor="bg-blue-500"
            borderColor="border-l-blue-500"
          />
          <MetricCard
            title="Biens facturés"
            value={propertiesCount}
            description={`${propertiesCount} propriété${propertiesCount > 1 ? 's' : ''} ce mois`}
            icon={Building2}
            iconBgColor="bg-purple-500"
            borderColor="border-l-purple-500"
          />
          <MetricCard
            title="Charges max"
            value={`${highestCharge.toFixed(2)}€`}
            description="Bien avec le plus de charges"
            icon={Receipt}
            iconBgColor="bg-orange-500"
            borderColor="border-l-orange-500"
          />
        </div>

        {/* Liste des charges */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">
            Charges - {new Date(selectedMonth + '-01').toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
          </h2>
          
          <div className="grid grid-cols-1 gap-6">
            {filteredCharges.map((charge) => (
              <Card key={charge.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Building2 className="h-5 w-5" />
                        {charge.propertyName}
                      </CardTitle>
                      <div className="flex items-center gap-4 mt-2">
                        <Badge variant="outline">{charge.propertyType}</Badge>
                        <span className="text-sm text-gray-600">Locataire: {charge.tenant}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-blue-600">{charge.total.toFixed(2)}€</span>
                      <div className="flex gap-1">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDeleteCharge(charge.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Électricité</p>
                      <p className="font-semibold">{charge.electricity.toFixed(2)}€</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Eau</p>
                      <p className="font-semibold">{charge.water.toFixed(2)}€</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Chauffage</p>
                      <p className="font-semibold">{charge.heating.toFixed(2)}€</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Entretien</p>
                      <p className="font-semibold">{charge.maintenance.toFixed(2)}€</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Assurance</p>
                      <p className="font-semibold">{charge.insurance.toFixed(2)}€</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Ordures</p>
                      <p className="font-semibold">{charge.garbage.toFixed(2)}€</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Internet</p>
                      <p className="font-semibold">{charge.internet.toFixed(2)}€</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredCharges.length === 0 && (
            <div className="text-center py-12">
              <Receipt className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">Aucune charge</h3>
              <p className="mt-2 text-gray-500">
                Aucune charge trouvée pour {new Date(selectedMonth + '-01').toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}.
              </p>
            </div>
          )}
        </div>

        <RentalChargeForm
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleAddCharge}
        />
      </div>
    </MainLayout>
  );
};

export default RentalCharges;
