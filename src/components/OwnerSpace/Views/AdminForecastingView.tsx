
import React from 'react';
import { TrendingUp } from 'lucide-react';
import { useOwnerData } from '@/hooks/useOwnerData';

interface AdminForecastingViewProps {
  currentProfile: any;
}

const AdminForecastingView: React.FC<AdminForecastingViewProps> = ({ currentProfile }) => {
  const { properties, tenants, roommates } = useOwnerData(currentProfile);
  
  const currentMonthlyRevenue = [...tenants, ...roommates]
    .reduce((sum, item) => sum + (parseFloat(item.rentAmount) || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-green-600" />
              Prévisions Financières
            </h1>
            <p className="text-gray-600 mt-2">
              Analysez et planifiez vos investissements immobiliers
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Current Revenue Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Revenus Actuels</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Revenus mensuels:</span>
                  <span className="text-2xl font-bold text-green-600">{currentMonthlyRevenue}€</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Propriétés:</span>
                  <span className="font-medium">{properties.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Locataires:</span>
                  <span className="font-medium">{tenants.length + roommates.length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Investment Planning */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Planification d'Investissement</h2>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prix de la propriété cible (€)
                    </label>
                    <input
                      type="number"
                      className="w-full p-3 border border-gray-300 rounded-md"
                      placeholder="250000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Loyer mensuel estimé (€)
                    </label>
                    <input
                      type="number"
                      className="w-full p-3 border border-gray-300 rounded-md"
                      placeholder="1200"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Apport personnel (%)
                    </label>
                    <input
                      type="number"
                      min="10"
                      max="100"
                      className="w-full p-3 border border-gray-300 rounded-md"
                      placeholder="20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Taux d'emprunt (%)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      className="w-full p-3 border border-gray-300 rounded-md"
                      placeholder="3.5"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Résultats de Simulation</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">-</div>
                  <div className="text-sm text-gray-600">Apport requis</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">-</div>
                  <div className="text-sm text-gray-600">Mensualité</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">-</div>
                  <div className="text-sm text-gray-600">Rentabilité</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">-</div>
                  <div className="text-sm text-gray-600">Cash-flow</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminForecastingView;
