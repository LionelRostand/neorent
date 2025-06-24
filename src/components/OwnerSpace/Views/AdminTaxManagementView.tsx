
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, FileText, Calculator, TrendingUp, AlertCircle, Receipt, PieChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useFirebaseFiscality } from '@/hooks/useFirebaseFiscality';
import { useOwnerData } from '@/hooks/useOwnerData';

interface AdminTaxManagementViewProps {
  currentProfile: any;
}

const AdminTaxManagementView: React.FC<AdminTaxManagementViewProps> = ({ currentProfile }) => {
  const { t } = useTranslation();
  const { fiscalities } = useFirebaseFiscality();
  const { properties, tenants, roommates } = useOwnerData(currentProfile);

  // Filter fiscal data by owner's properties
  const ownerFiscalities = fiscalities.filter(fiscal => 
    properties.some(prop => prop.title === fiscal.property)
  );

  const totalDeclarations = ownerFiscalities.length;
  const currentYear = new Date().getFullYear();
  const currentYearDeclarations = ownerFiscalities.filter(f => f.year === currentYear).length;
  const totalRevenue = [...tenants, ...roommates].reduce((sum, item) => sum + (parseFloat(item.rentAmount?.toString() || '0') || 0), 0) * 12;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="p-4 sm:p-6 lg:p-8">
        {/* Enhanced Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-sm">
                  <Receipt className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Déclarations Fiscales</h1>
                  <p className="text-gray-600">Gérez vos déclarations et obligations fiscales</p>
                </div>
              </div>
            </div>
            <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg">
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle déclaration
            </Button>
          </div>
        </div>

        {/* Enhanced Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
          <Card className="border-0 shadow-md bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-800">Revenus Annuels</CardTitle>
              <div className="p-2 bg-green-500 rounded-lg">
                <TrendingUp className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900">{totalRevenue.toLocaleString()}€</div>
              <p className="text-xs text-green-700">Revenus locatifs estimés</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-800">Déclarations</CardTitle>
              <div className="p-2 bg-blue-500 rounded-lg">
                <FileText className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">{totalDeclarations}</div>
              <p className="text-xs text-blue-700">Déclarations enregistrées</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-800">Année {currentYear}</CardTitle>
              <div className="p-2 bg-purple-500 rounded-lg">
                <Calculator className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-900">{currentYearDeclarations}</div>
              <p className="text-xs text-purple-700">Déclarations cette année</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-amber-800">Statut Fiscal</CardTitle>
              <div className="p-2 bg-amber-500 rounded-lg">
                <AlertCircle className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-900">À jour</div>
              <p className="text-xs text-amber-700">Conformité fiscale</p>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Tax Declarations List */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <PieChart className="h-5 w-5 text-gray-600" />
                Déclarations Fiscales
              </CardTitle>
              {ownerFiscalities.length > 0 && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  {ownerFiscalities.length} déclaration{ownerFiscalities.length > 1 ? 's' : ''}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {ownerFiscalities.length === 0 ? (
              <div className="text-center py-12">
                <div className="mx-auto w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6">
                  <FileText className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucune déclaration fiscale</h3>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                  Commencez par créer votre première déclaration fiscale pour gérer vos obligations fiscales efficacement.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                    <Plus className="h-4 w-4 mr-2" />
                    Créer ma première déclaration
                  </Button>
                  <Button variant="outline" className="border-gray-300 hover:bg-gray-50">
                    <Calculator className="h-4 w-4 mr-2" />
                    Calculateur fiscal
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {ownerFiscalities.map((fiscal, index) => (
                  <div key={fiscal.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:shadow-md transition-all duration-200 bg-gradient-to-r from-white to-gray-50">
                    <div className="flex items-center space-x-4">
                      <div className="h-12 w-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-sm">
                        <FileText className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Déclaration {fiscal.year}</h3>
                        <p className="text-sm text-gray-600">{fiscal.property}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {fiscal.type}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            Montant: {fiscal.amount}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {fiscal.amount}
                      </p>
                      <Badge 
                        variant={fiscal.status === 'Payée' ? 'default' : fiscal.status === 'À payer' ? 'destructive' : 'secondary'}
                        className="mt-1"
                      >
                        {fiscal.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminTaxManagementView;
