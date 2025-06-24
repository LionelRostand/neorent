
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PropertyList from '@/components/PropertyList';
import PropertyForm from '@/components/PropertyForm';
import { Dialog } from '@/components/ui/dialog';
import { useOwnerQuickActions } from '@/hooks/useOwnerQuickActions';
import { useAuth } from '@/hooks/useAuth';
import { useFormButtonConfig } from '@/hooks/useFormButtonConfig';
import FormButtonConfigPanel from './FormButtonConfigPanel';

const AdminPropertiesView: React.FC = () => {
  const { t } = useTranslation();
  const { userProfile } = useAuth();
  const { handlePropertySubmit } = useOwnerQuickActions(userProfile);
  const { getButtonConfig } = useFormButtonConfig();
  const [showPropertyForm, setShowPropertyForm] = useState(false);

  const propertyButtonConfig = getButtonConfig('property');

  return (
    <div className="space-y-6">
      <FormButtonConfigPanel 
        actionIds={['property']} 
        title="Configuration du bouton Propriété"
      />
      
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{t('properties.title')}</h1>
        <Button 
          onClick={() => setShowPropertyForm(true)}
          variant={propertyButtonConfig.variant}
          size={propertyButtonConfig.size}
          className={propertyButtonConfig.className}
        >
          <Plus className="h-4 w-4 mr-2" />
          {t('properties.addProperty')}
        </Button>
      </div>

      <PropertyList />

      <Dialog open={showPropertyForm} onOpenChange={setShowPropertyForm}>
        <PropertyForm 
          onClose={() => setShowPropertyForm(false)}
          onSubmit={handlePropertySubmit}
          buttonConfig={propertyButtonConfig}
        />
      </Dialog>
    </div>
  );
};

export default AdminPropertiesView;
