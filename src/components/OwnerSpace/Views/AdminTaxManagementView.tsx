
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, FileText, Calculator, TrendingUp, AlertCircle } from 'lucide-react';
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
  const currentYearDeclarations = ownerFiscalities.filter(f => f.year === new Date().getFullYear().toString()).length;
  const totalRevenue = [...tenants, ...roommates].reduce((sum, item) => sum + (parseFloat(item.rentAmount) || 0), 0) * 12;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestion Fiscale</h1>
            <p className="text-gray-600 mt-1">Gérez vos déclarations et obligations fiscales</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle déclaration
          </Button>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenus Annuels</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalRevenue}€</div>
              <p className="text-xs text-muted-foreground">Revenus locatifs annuels</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Déclarations</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalDeclarations}</div>
              <p className="text-xs text-muted-foreground">{totalDeclarations} déclarations totales</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Année Courante</CardTitle>
              <Calculator className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{currentYearDeclarations}</div>
              <p className="text-xs text-muted-foreground">Déclarations {new Date().getFullYear()}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Statut Fiscal</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">À jour</div>
              <p className="text-xs text-muted-foreground">Obligations fiscales</p>
            </CardContent>
          </Card>
        </div>

        {/* Tax Declarations List */}
        <Card>
          <CardHeader>
            <CardTitle>Déclarations Fiscales</CardTitle>
          </CardHeader>
          <CardContent>
            {ownerFiscalities.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Aucune déclaration fiscale</p>
                <p className="text-sm text-gray-400">Commencez par créer votre première déclaration</p>
              </div>
            ) : (
              <div className="space-y-4">
                {ownerFiscalities.map((fiscal) => (
                  <div key={fiscal.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center space-x-4">
                      <div className="h-12 w-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                        <FileText className="h-6 w-6 text-indigo-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Année {fiscal.year}</h3>
                        <p className="text-sm text-gray-600">{fiscal.property}</p>
                        <p className="text-sm text-gray-500">Revenus: {fiscal.totalRent}€</p>
                        <p className="text-sm text-gray-500">Charges: {fiscal.totalCharges}€</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        Résultat: {(parseFloat(fiscal.totalRent) - parseFloat(fiscal.totalCharges)).toFixed(0)}€
                      </p>
                      <Badge variant="default">Complète</Badge>
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
