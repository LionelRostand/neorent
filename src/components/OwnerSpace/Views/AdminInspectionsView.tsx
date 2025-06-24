
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import InspectionForm from '@/components/InspectionForm';
import { useOwnerQuickActions } from '@/hooks/useOwnerQuickActions';
import { useAuth } from '@/hooks/useAuth';
import { useFormButtonConfig } from '@/hooks/useFormButtonConfig';
import FormButtonConfigPanel from './FormButtonConfigPanel';

const AdminInspectionsView: React.FC = () => {
  const { t } = useTranslation();
  const { userProfile } = useAuth();
  const { handleInspectionSubmit } = useOwnerQuickActions(userProfile);
  const { getButtonConfig } = useFormButtonConfig();
  const [showInspectionForm, setShowInspectionForm] = useState(false);

  const inspectionButtonConfig = getButtonConfig('inspection');

  return (
    <div className="space-y-6">
      <FormButtonConfigPanel 
        actionIds={['inspection']} 
        title="Configuration du bouton Inspection"
      />
      
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{t('inspections.title')}</h1>
        <Button 
          onClick={() => setShowInspectionForm(true)}
          variant={inspectionButtonConfig.variant}
          size={inspectionButtonConfig.size}
          className={inspectionButtonConfig.className}
        >
          <Plus className="h-4 w-4 mr-2" />
          {t('inspections.addInspection')}
        </Button>
      </div>

      <div className="text-center py-8 text-gray-500">
        {t('inspections.list')}
      </div>

      <Dialog open={showInspectionForm} onOpenChange={setShowInspectionForm}>
        <InspectionForm 
          onClose={() => setShowInspectionForm(false)}
          onSubmit={handleInspectionSubmit}
          buttonConfig={inspectionButtonConfig}
        />
      </Dialog>
    </div>
  );
};

export default AdminInspectionsView;
