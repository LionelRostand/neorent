
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, FileText, Calculator, TrendingUp, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useFirebaseFiscality } from '@/hooks/useFirebaseFiscality';
import { useOwnerData } from '@/hooks/useOwnerData';
import { useAuth } from '@/hooks/useAuth';
import TaxDeclarationForm from '@/components/TaxDeclarationForm';

interface AdminTaxManagementViewProps {
  currentProfile: any;
}

const AdminTaxManagementView: React.FC<AdminTaxManagementViewProps> = ({ currentProfile }) => {
  const { t } = useTranslation();
  const { fiscalities } = useFirebaseFiscality();
  const { properties, tenants, roommates } = useOwnerData(currentProfile);
  const { userProfile } = useAuth();
  const profile = currentProfile || userProfile;
  const [showTaxForm, setShowTaxForm] = useState(false);

  // Filter fiscal data by owner's properties
  const ownerFiscalities = fiscalities.filter(fiscal => 
    properties.some(prop => prop.title === fiscal.property)
  );

  const totalDeclarations = ownerFiscalities.length;
  const currentYear = new Date().getFullYear();
  const currentYearDeclarations = ownerFiscalities.filter(f => f.year === currentYear).length;
  const totalRevenue = [...tenants, ...roommates].reduce((sum, item) => sum + (parseFloat(item.rentAmount?.toString() || '0') || 0), 0) * 12;

  const handleTaxSubmit = async (taxData: any) => {
    console.log('Tax data:', taxData);
    setShowTaxForm(false);
  };

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header responsive */}
      <div className="bg-gradient-to-r from-cyan-600 to-cyan-700 rounded-xl p-4 sm:p-6 text-white shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold truncate">{t('taxes.title')}</h1>
            <p className="text-cyan-100 mt-1 sm:mt-2 text-sm sm:text-base line-clamp-2 sm:line-clamp-1">
              {t('taxes.subtitle')}
            </p>
          </div>
          <div className="flex-shrink-0">
            <Button 
              className="bg-white text-cyan-600 hover:bg-cyan-50 border-0 shadow-md w-full sm:w-auto"
              onClick={() => setShowTaxForm(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">{t('taxes.newDeclaration')}</span>
              <span className="sm:hidden">Nouvelle</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Metrics Grid responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card className="border-l-4 border-l-cyan-500 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 sm:p-6">
            <CardTitle className="text-xs sm:text-sm font-medium text-gray-600 truncate pr-2">
              {t('taxes.annualRevenue')}
            </CardTitle>
            <div className="p-1.5 sm:p-2 bg-cyan-100 rounded-lg flex-shrink-0">
              <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-cyan-600" />
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="text-xl sm:text-2xl font-bold text-gray-900">{totalRevenue}€</div>
            <p className="text-xs text-gray-500 mt-1 truncate">{t('taxes.rentalIncome')}</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 sm:p-6">
            <CardTitle className="text-xs sm:text-sm font-medium text-gray-600 truncate pr-2">
              {t('taxes.declarations')}
            </CardTitle>
            <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg flex-shrink-0">
              <FileText className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="text-xl sm:text-2xl font-bold text-gray-900">{totalDeclarations}</div>
            <p className="text-xs text-gray-500 mt-1 truncate">{totalDeclarations} {t('taxes.allDeclarations')}</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 sm:p-6">
            <CardTitle className="text-xs sm:text-sm font-medium text-gray-600 truncate pr-2">
              {t('taxes.taxYear')}
            </CardTitle>
            <div className="p-1.5 sm:p-2 bg-purple-100 rounded-lg flex-shrink-0">
              <Calculator className="h-3 w-3 sm:h-4 sm:w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="text-xl sm:text-2xl font-bold text-gray-900">{currentYearDeclarations}</div>
            <p className="text-xs text-gray-500 mt-1 truncate">{t('taxes.declarations')} {currentYear}</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 sm:p-6">
            <CardTitle className="text-xs sm:text-sm font-medium text-gray-600 truncate pr-2">
              {t('taxes.status')}
            </CardTitle>
            <div className="p-1.5 sm:p-2 bg-green-100 rounded-lg flex-shrink-0">
              <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="text-xl sm:text-2xl font-bold text-green-600">{t('taxes.approved')}</div>
            <p className="text-xs text-gray-500 mt-1 truncate">{t('taxes.taxableIncome')}</p>
          </CardContent>
        </Card>
      </div>

      {/* Declarations List responsive */}
      <Card className="shadow-lg border-0">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b p-4 sm:p-6">
          <CardTitle className="text-lg sm:text-xl text-gray-800">{t('taxes.declarationList')}</CardTitle>
        </CardHeader>
        <CardContent className="p-3 sm:p-6">
          <div className="text-center py-8 sm:py-12 bg-gradient-to-br from-gray-50 to-white rounded-lg border-2 border-dashed border-gray-200">
            <div className="p-3 sm:p-4 bg-gray-100 rounded-full w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 flex items-center justify-center">
              <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400" />
            </div>
            <h3 className="text-base sm:text-lg font-medium text-gray-700 mb-2">{t('taxes.noDeclarations')}</h3>
            <p className="text-sm text-gray-500 mb-4 px-4">{t('taxes.noDeclarationsDescription')}</p>
            <Button 
              className="bg-cyan-600 hover:bg-cyan-700 text-white"
              onClick={() => setShowTaxForm(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              {t('taxes.createDeclaration')}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tax Form Dialog */}
      <TaxDeclarationForm 
        isOpen={showTaxForm}
        onClose={() => setShowTaxForm(false)}
        onSubmit={handleTaxSubmit}
      />
    </div>
  );
};

export default AdminTaxManagementView;
