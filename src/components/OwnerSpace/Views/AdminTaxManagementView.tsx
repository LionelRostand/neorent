import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, FileText, Calculator, TrendingUp, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog } from '@/components/ui/dialog';
import { useFirebaseFiscality } from '@/hooks/useFirebaseFiscality';
import { useOwnerData } from '@/hooks/useOwnerData';
import { useOwnerQuickActions } from '@/hooks/useOwnerQuickActions';
import { useFormButtonConfig } from '@/hooks/useFormButtonConfig';
import { useAuth } from '@/hooks/useAuth';
import TaxDeclarationForm from '@/components/TaxDeclarationForm';
import FormButtonConfigPanel from './FormButtonConfigPanel';

interface AdminTaxManagementViewProps {
  currentProfile: any;
}

const AdminTaxManagementView: React.FC<AdminTaxManagementViewProps> = ({ currentProfile }) => {
  const { t } = useTranslation();
  const { fiscalities } = useFirebaseFiscality();
  const { properties, tenants, roommates } = useOwnerData(currentProfile);
  const { userProfile } = useAuth();
  const profile = currentProfile || userProfile;
  const { handleTaxSubmit } = useOwnerQuickActions(profile);
  const { getButtonConfig } = useFormButtonConfig();
  const [showTaxForm, setShowTaxForm] = useState(false);

  const taxButtonConfig = getButtonConfig('tax');

  // Filter fiscal data by owner's properties
  const ownerFiscalities = fiscalities.filter(fiscal => 
    properties.some(prop => prop.title === fiscal.property)
  );

  const totalDeclarations = ownerFiscalities.length;
  const currentYear = new Date().getFullYear();
  const currentYearDeclarations = ownerFiscalities.filter(f => f.year === currentYear).length;
  const totalRevenue = [...tenants, ...roommates].reduce((sum, item) => sum + (parseFloat(item.rentAmount?.toString() || '0') || 0), 0) * 12;

  return (
    <div className="p-6 space-y-6">
      {/* Configuration des boutons */}
      <FormButtonConfigPanel actionIds={['tax']} title="Configuration du bouton déclaration fiscale" />

      {/* Header harmonisé avec la sidebar */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Déclarations Fiscales</h1>
            <p className="text-green-100 mt-2">Gérez vos déclarations et obligations fiscales</p>
          </div>
          <Button 
            className="bg-white text-green-600 hover:bg-green-50 border-0 shadow-md"
            onClick={() => setShowTaxForm(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle déclaration
          </Button>
        </div>
      </div>

      {/* Metrics Grid avec style harmonisé */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Revenus Annuels</CardTitle>
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{totalRevenue}€</div>
            <p className="text-xs text-gray-500 mt-1">Revenus locatifs annuels</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Déclarations</CardTitle>
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{totalDeclarations}</div>
            <p className="text-xs text-gray-500 mt-1">{totalDeclarations} déclarations totales</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Année Courante</CardTitle>
            <div className="p-2 bg-purple-100 rounded-lg">
              <Calculator className="h-4 w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{currentYearDeclarations}</div>
            <p className="text-xs text-gray-500 mt-1">Déclarations {currentYear}</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Statut Fiscal</CardTitle>
            <div className="p-2 bg-orange-100 rounded-lg">
              <AlertCircle className="h-4 w-4 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">À jour</div>
            <p className="text-xs text-gray-500 mt-1">Obligations fiscales</p>
          </CardContent>
        </Card>
      </div>

      {/* Tax Declarations List avec style amélioré */}
      <Card className="shadow-lg border-0">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b">
          <CardTitle className="text-xl text-gray-800">Déclarations Fiscales</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {ownerFiscalities.length === 0 ? (
            <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-white rounded-lg border-2 border-dashed border-gray-200">
              <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <FileText className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">Aucune déclaration fiscale</h3>
              <p className="text-gray-500 mb-4">Commencez par créer votre première déclaration</p>
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Créer une déclaration
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {ownerFiscalities.map((fiscal) => (
                <div key={fiscal.id} className="flex items-center justify-between p-6 border rounded-xl hover:shadow-md transition-all duration-200 bg-gradient-to-r from-white to-gray-50">
                  <div className="flex items-center space-x-4">
                    <div className="h-14 w-14 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center">
                      <FileText className="h-7 w-7 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">Année {fiscal.year}</h3>
                      <p className="text-sm text-gray-600 font-medium">{fiscal.property}</p>
                      <div className="flex items-center space-x-4 mt-1">
                        <p className="text-sm text-gray-500">Type: {fiscal.type}</p>
                        <p className="text-sm text-gray-500">Montant: {fiscal.amount}€</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-gray-800 mb-2">
                      {fiscal.amount}€
                    </p>
                    <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-200">
                      {fiscal.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showTaxForm} onOpenChange={setShowTaxForm}>
        <TaxDeclarationForm 
          onClose={() => setShowTaxForm(false)}
          onSubmit={handleTaxSubmit || (() => Promise.resolve())}
          buttonConfig={taxButtonConfig}
        />
      </Dialog>
    </div>
  );
};

export default AdminTaxManagementView;
