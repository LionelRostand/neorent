
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import RoommateForm from '@/components/RoommateForm';
import { useOwnerQuickActions } from '@/hooks/useOwnerQuickActions';
import { useAuth } from '@/hooks/useAuth';
import { useFormButtonConfig } from '@/hooks/useFormButtonConfig';

interface AdminRoommatesViewProps {
  currentProfile?: any;
}

const AdminRoommatesView: React.FC<AdminRoommatesViewProps> = ({ currentProfile }) => {
  const { t } = useTranslation();
  const { userProfile } = useAuth();
  const profile = currentProfile || userProfile;
  const { handleRoommateSubmit } = useOwnerQuickActions(profile);
  const { getButtonConfig } = useFormButtonConfig();
  const [showRoommateForm, setShowRoommateForm] = useState(false);

  const roommateButtonConfig = getButtonConfig('roommate');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{t('roommates.title')}</h1>
        <Button 
          onClick={() => setShowRoommateForm(true)}
          variant={roommateButtonConfig.variant}
          size={roommateButtonConfig.size}
          className={roommateButtonConfig.className}
        >
          <Plus className="h-4 w-4 mr-2" />
          {t('roommates.addRoommate')}
        </Button>
      </div>

      <div className="text-center py-8 text-gray-500">
        {t('roommates.list')}
      </div>

      <Dialog open={showRoommateForm} onOpenChange={setShowRoommateForm}>
        <RoommateForm 
          onClose={() => setShowRoommateForm(false)}
          onSubmit={handleRoommateSubmit}
          buttonConfig={roommateButtonConfig}
        />
      </Dialog>
    </div>
  );
};

export default AdminRoommatesView;
