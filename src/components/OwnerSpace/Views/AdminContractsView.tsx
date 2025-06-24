
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import ContractForm from '@/components/ContractForm';
import { useOwnerQuickActions } from '@/hooks/useOwnerQuickActions';
import { useAuth } from '@/hooks/useAuth';
import { useFormButtonConfig } from '@/hooks/useFormButtonConfig';
import FormButtonConfigPanel from './FormButtonConfigPanel';

interface AdminContractsViewProps {
  currentProfile?: any;
}

const AdminContractsView: React.FC<AdminContractsViewProps> = ({ currentProfile }) => {
  const { t } = useTranslation();
  const { userProfile } = useAuth();
  const profile = currentProfile || userProfile;
  const { handleContractSubmit } = useOwnerQuickActions(profile);
  const { getButtonConfig } = useFormButtonConfig();
  const [showContractForm, setShowContractForm] = useState(false);

  const contractButtonConfig = getButtonConfig('contract');

  return (
    <div className="space-y-6">
      <FormButtonConfigPanel 
        actionIds={['contract']} 
        title="Configuration du bouton Contrat"
      />
      
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{t('contracts.title')}</h1>
        <Button 
          onClick={() => setShowContractForm(true)}
          variant={contractButtonConfig.variant}
          size={contractButtonConfig.size}
          className={contractButtonConfig.className}
        >
          <Plus className="h-4 w-4 mr-2" />
          {t('contracts.addContract')}
        </Button>
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
