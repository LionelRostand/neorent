
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
  const { t, i18n } = useTranslation();
  const { userProfile } = useAuth();
  const profile = currentProfile || userProfile;
  const { handleContractSubmit } = useOwnerQuickActions(profile);
  const { getButtonConfig } = useFormButtonConfig();
  const { contracts, tenants } = useOwnerData(profile);
  const [showContractForm, setShowContractForm] = useState(false);

  const contractButtonConfig = getButtonConfig('contract');

  // Get texts based on current language
  const getLocalizedText = (key: string) => {
    const currentLang = i18n.language;
    
    const texts: Record<string, Record<string, string>> = {
      title: {
        fr: 'Contrats de Bail',
        en: 'Lease Contracts'
      },
      subtitle: {
        fr: 'Gérez vos contrats de bail et leurs informations',
        en: 'Manage your lease contracts and their information'
      },
      newContract: {
        fr: 'Nouveau contrat',
        en: 'New Contract'
      },
      totalContracts: {
        fr: 'Total Contrats',
        en: 'Total Contracts'
      },
      totalRegistered: {
        fr: 'contrats enregistrés',
        en: 'contracts registered'
      },
      activeContracts: {
        fr: 'Contrats Actifs',
        en: 'Active Contracts'
      },
      activeContractsDesc: {
        fr: 'contrats actifs',
        en: 'active contracts'
      },
      expiringContracts: {
        fr: 'Contrats Expirant',
        en: 'Expiring Contracts'
      },
      expiringDesc: {
        fr: 'expirant dans 3 mois',
        en: 'expiring in 3 months'
      },
      monthlyRevenue: {
        fr: 'Revenus Mensuels',
        en: 'Monthly Revenue'
      },
      revenueDesc: {
        fr: 'revenus mensuels totaux',
        en: 'total monthly revenue'
      },
      contractsList: {
        fr: 'Liste des Contrats',
        en: 'Contracts List'
      },
      title_col: {
        fr: 'Titre',
        en: 'Title'
      },
      property: {
        fr: 'Propriété',
        en: 'Property'
      },
      tenant: {
        fr: 'Locataire',
        en: 'Tenant'
      },
      type: {
        fr: 'Type',
        en: 'Type'
      },
      amount: {
        fr: 'Montant',
        en: 'Amount'
      },
      startDate: {
        fr: 'Date début',
        en: 'Start Date'
      },
      endDate: {
        fr: 'Date fin',
        en: 'End Date'
      },
      status: {
        fr: 'Statut',
        en: 'Status'
      },
      noContracts: {
        fr: 'Aucun contrat',
        en: 'No contracts'
      },
      noContractsDesc: {
        fr: 'Commencez par créer votre premier contrat',
        en: 'Start by creating your first contract'
      },
      createContract: {
        fr: 'Créer un contrat',
        en: 'Create a contract'
      }
    };

    return texts[key]?.[currentLang] || texts[key]?.['fr'] || key;
  };

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
    <div className="p-6 space-y-6">
      {/* Header harmonisé avec la sidebar */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{getLocalizedText('title')}</h1>
            <p className="text-purple-100 mt-2">{getLocalizedText('subtitle')}</p>
          </div>
          <Button 
            onClick={() => setShowContractForm(true)}
            className="bg-white text-purple-600 hover:bg-purple-50 border-0 shadow-md"
          >
            <Plus className="h-4 w-4 mr-2" />
            {getLocalizedText('newContract')}
          </Button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-purple-500 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">{getLocalizedText('totalContracts')}</CardTitle>
            <div className="p-2 bg-purple-100 rounded-lg">
              <FileText className="h-4 w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{totalContracts}</div>
            <p className="text-xs text-gray-500 mt-1">{totalContracts} {getLocalizedText('totalRegistered')}</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">{getLocalizedText('activeContracts')}</CardTitle>
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{activeContracts}</div>
            <p className="text-xs text-gray-500 mt-1">{activeContracts} {getLocalizedText('activeContractsDesc')}</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">{getLocalizedText('expiringContracts')}</CardTitle>
            <div className="p-2 bg-orange-100 rounded-lg">
              <AlertCircle className="h-4 w-4 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{expiringContracts}</div>
            <p className="text-xs text-gray-500 mt-1">{expiringContracts} {getLocalizedText('expiringDesc')}</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">{getLocalizedText('monthlyRevenue')}</CardTitle>
            <div className="p-2 bg-blue-100 rounded-lg">
              <DollarSign className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{monthlyRevenue}€</div>
            <p className="text-xs text-gray-500 mt-1">{getLocalizedText('revenueDesc')}</p>
          </CardContent>
        </Card>
      </div>

      {/* Contracts Table */}
      <Card className="shadow-lg border-0">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b">
          <CardTitle className="text-xl text-gray-800">{getLocalizedText('contractsList')}</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {contracts && contracts.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{getLocalizedText('title_col')}</TableHead>
                  <TableHead>{getLocalizedText('property')}</TableHead>
                  <TableHead>{getLocalizedText('tenant')}</TableHead>
                  <TableHead>{getLocalizedText('type')}</TableHead>
                  <TableHead>{getLocalizedText('amount')}</TableHead>
                  <TableHead>{getLocalizedText('startDate')}</TableHead>
                  <TableHead>{getLocalizedText('endDate')}</TableHead>
                  <TableHead>{getLocalizedText('status')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contracts.map((contract) => (
                  <TableRow key={contract.id}>
                    <TableCell className="font-medium">{contract.title}</TableCell>
                    <TableCell>{contract.property}</TableCell>
                    <TableCell>{contract.tenant}</TableCell>
                    <TableCell>{contract.type}</TableCell>
                    <TableCell>{contract.amount}€</TableCell>
                    <TableCell>{new Date(contract.startDate).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(contract.endDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(contract.status)}>
                        {contract.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-white rounded-lg border-2 border-dashed border-gray-200">
              <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <FileText className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">{getLocalizedText('noContracts')}</h3>
              <p className="text-gray-500 mb-4">{getLocalizedText('noContractsDesc')}</p>
              <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                {getLocalizedText('createContract')}
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
