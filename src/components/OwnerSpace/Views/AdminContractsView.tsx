
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, FileText, CheckCircle, AlertCircle, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog } from '@/components/ui/dialog';
import ContractForm from '@/components/ContractForm';
import { useOwnerQuickActions } from '@/hooks/useOwnerQuickActions';
import { useAuth } from '@/hooks/useAuth';
import { useFormButtonConfig } from '@/hooks/useFormButtonConfig';
import { useOwnerData } from '@/hooks/useOwnerData';

interface AdminContractsViewProps {
  currentProfile?: any;
}

const AdminContractsView: React.FC<AdminContractsViewProps> = ({ currentProfile }) => {
  const { t } = useTranslation();
  const { userProfile } = useAuth();
  const profile = currentProfile || userProfile;
  const { handleContractSubmit } = useOwnerQuickActions(profile);
  const { getButtonConfig } = useFormButtonConfig();
  const { contracts, tenants } = useOwnerData(profile);
  const [showContractForm, setShowContractForm] = useState(false);

  const contractButtonConfig = getButtonConfig('contract');

  const totalContracts = contracts?.length || 0;
  const activeContracts = contracts?.filter(c => c.status === 'Actif').length || 0;
  const expiringContracts = contracts?.filter(c => {
    const endDate = new Date(c.endDate);
    const now = new Date();
    const threeMonthsFromNow = new Date(now.getTime() + (90 * 24 * 60 * 60 * 1000));
    return endDate <= threeMonthsFromNow && endDate > now;
  }).length || 0;
  const monthlyRevenue = tenants?.reduce((sum, t) => sum + (parseFloat(t.rentAmount) || 0), 0) || 0;

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Actif':
        return 'default';
      case 'Signé':
        return 'default';
      case 'Expiré':
        return 'destructive';
      case 'En attente':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header responsive */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl p-4 sm:p-6 text-white shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold truncate">{t('contracts.title')}</h1>
            <p className="text-purple-100 mt-1 sm:mt-2 text-sm sm:text-base line-clamp-2 sm:line-clamp-1">
              {t('contracts.subtitle')}
            </p>
          </div>
          <div className="flex-shrink-0">
            <Button 
              onClick={() => setShowContractForm(true)}
              className="bg-white text-purple-600 hover:bg-purple-50 border-0 shadow-md w-full sm:w-auto"
            >
              <Plus className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">{t('contracts.addContract')}</span>
              <span className="sm:hidden">Nouveau</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Metrics Grid responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card className="border-l-4 border-l-purple-500 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 sm:p-6">
            <CardTitle className="text-xs sm:text-sm font-medium text-gray-600 truncate pr-2">
              {t('contracts.totalContracts')}
            </CardTitle>
            <div className="p-1.5 sm:p-2 bg-purple-100 rounded-lg flex-shrink-0">
              <FileText className="h-3 w-3 sm:h-4 sm:w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="text-xl sm:text-2xl font-bold text-gray-900">{totalContracts}</div>
            <p className="text-xs text-gray-500 mt-1 truncate">{totalContracts} {t('contracts.totalRegistered')}</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 sm:p-6">
            <CardTitle className="text-xs sm:text-sm font-medium text-gray-600 truncate pr-2">
              {t('contracts.activeContracts')}
            </CardTitle>
            <div className="p-1.5 sm:p-2 bg-green-100 rounded-lg flex-shrink-0">
              <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="text-xl sm:text-2xl font-bold text-gray-900">{activeContracts}</div>
            <p className="text-xs text-gray-500 mt-1 truncate">{activeContracts} {t('contracts.activeContractsDesc')}</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 sm:p-6">
            <CardTitle className="text-xs sm:text-sm font-medium text-gray-600 truncate pr-2">
              {t('contracts.expiringContracts')}
            </CardTitle>
            <div className="p-1.5 sm:p-2 bg-orange-100 rounded-lg flex-shrink-0">
              <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="text-xl sm:text-2xl font-bold text-gray-900">{expiringContracts}</div>
            <p className="text-xs text-gray-500 mt-1 truncate">{expiringContracts} {t('contracts.expiringIn3Months')}</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 sm:p-6">
            <CardTitle className="text-xs sm:text-sm font-medium text-gray-600 truncate pr-2">
              {t('contracts.monthlyRevenue')}
            </CardTitle>
            <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg flex-shrink-0">
              <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="text-xl sm:text-2xl font-bold text-gray-900">{monthlyRevenue}€</div>
            <p className="text-xs text-gray-500 mt-1 truncate">{t('contracts.monthlyRevenueDesc')}</p>
          </CardContent>
        </Card>
      </div>

      {/* Contracts Table responsive */}
      <Card className="shadow-lg border-0">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b p-4 sm:p-6">
          <CardTitle className="text-lg sm:text-xl text-gray-800">{t('contracts.contractsList')}</CardTitle>
        </CardHeader>
        <CardContent className="p-3 sm:p-6">
          {contracts && contracts.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs sm:text-sm">{t('contracts.title_col')}</TableHead>
                    <TableHead className="text-xs sm:text-sm hidden sm:table-cell">{t('contracts.property')}</TableHead>
                    <TableHead className="text-xs sm:text-sm">{t('contracts.tenant')}</TableHead>
                    <TableHead className="text-xs sm:text-sm hidden md:table-cell">{t('contracts.type')}</TableHead>
                    <TableHead className="text-xs sm:text-sm">{t('contracts.rentAmount')}</TableHead>
                    <TableHead className="text-xs sm:text-sm hidden lg:table-cell">{t('contracts.startDate')}</TableHead>
                    <TableHead className="text-xs sm:text-sm hidden lg:table-cell">{t('contracts.endDate')}</TableHead>
                    <TableHead className="text-xs sm:text-sm">{t('contracts.status')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contracts.map((contract) => (
                    <TableRow key={contract.id}>
                      <TableCell className="font-medium text-xs sm:text-sm truncate max-w-[120px]">{contract.title}</TableCell>
                      <TableCell className="text-xs sm:text-sm hidden sm:table-cell truncate max-w-[150px]">{contract.property}</TableCell>
                      <TableCell className="text-xs sm:text-sm truncate max-w-[120px]">{contract.tenant}</TableCell>
                      <TableCell className="text-xs sm:text-sm hidden md:table-cell">{contract.type}</TableCell>
                      <TableCell className="text-xs sm:text-sm font-medium">{contract.amount}€</TableCell>
                      <TableCell className="text-xs sm:text-sm hidden lg:table-cell">{new Date(contract.startDate).toLocaleDateString()}</TableCell>
                      <TableCell className="text-xs sm:text-sm hidden lg:table-cell">{new Date(contract.endDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(contract.status)} className="text-xs">
                          {contract.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8 sm:py-12 bg-gradient-to-br from-gray-50 to-white rounded-lg border-2 border-dashed border-gray-200">
              <div className="p-3 sm:p-4 bg-gray-100 rounded-full w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 flex items-center justify-center">
                <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400" />
              </div>
              <h3 className="text-base sm:text-lg font-medium text-gray-700 mb-2">{t('contracts.noContracts')}</h3>
              <p className="text-sm text-gray-500 mb-4 px-4">{t('contracts.noContractsDescription')}</p>
              <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                {t('contracts.addContract')}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showContractForm} onOpenChange={setShowContractForm}>
        <ContractForm 
          onClose={() => setShowContractForm(false)}
          onSubmit={handleContractSubmit || (() => Promise.resolve())}
          buttonConfig={contractButtonConfig}
        />
      </Dialog>
    </div>
  );
};

export default AdminContractsView;
