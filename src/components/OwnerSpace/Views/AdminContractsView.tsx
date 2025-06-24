
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, FileText, CheckCircle, AlertCircle, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">{t('contracts.title')}</h1>
          <p className="text-gray-600 mt-1">Gérez vos contrats de bail et leurs informations</p>
        </div>
        <Button 
          onClick={() => setShowContractForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          {t('contracts.addContract')}
        </Button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Contrats</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalContracts}</div>
            <p className="text-xs text-muted-foreground">
              {totalContracts} contrats enregistrés
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contrats Actifs</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeContracts}</div>
            <p className="text-xs text-muted-foreground">
              {activeContracts} contrats actifs
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contrats Expirant</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{expiringContracts}</div>
            <p className="text-xs text-muted-foreground">
              {expiringContracts} contrats expirant dans 3 mois
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenus Mensuels</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{monthlyRevenue}€</div>
            <p className="text-xs text-muted-foreground">
              Revenus mensuels totaux
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="text-center py-8 text-gray-500">
        {t('contracts.list')}
      </div>

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
