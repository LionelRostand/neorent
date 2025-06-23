
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { useOwnerQuickActions } from '@/hooks/useOwnerQuickActions';
import { createQuickActionsConfig } from './QuickActions/quickActionsConfig';
import QuickActionItem from './QuickActions/QuickActionItem';
import QuickActionDialogs from './QuickActions/QuickActionDialogs';

interface OwnerQuickActionsProps {
  ownerProfile: any;
}

const OwnerQuickActions: React.FC<OwnerQuickActionsProps> = ({ ownerProfile }) => {
  const { i18n } = useTranslation();
  
  // Get texts based on current language
  const getLocalizedText = (key: string) => {
    const currentLang = i18n.language;
    
    const texts: Record<string, Record<string, string>> = {
      quickActionsTitle: {
        fr: 'Actions rapides',
        en: 'Quick Actions'
      }
    };

    return texts[key]?.[currentLang] || texts[key]?.['fr'] || key;
  };
  
  const {
    openDialog,
    setOpenDialog,
    properties,
    navigate,
    handlePropertySubmit,
    handleRoommateSubmit,
    handleInspectionSubmit,
    ownerProperties,
    activeTenants,
    expiringContracts,
    pendingPayments
  } = useOwnerQuickActions(ownerProfile);

  const quickActions = createQuickActionsConfig(
    navigate,
    setOpenDialog,
    ownerProperties,
    activeTenants,
    expiringContracts,
    pendingPayments,
    () => '' // dummy t function since we're using getLocalizedText
  );

  return (
    <>
      <Card className="h-fit w-full">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <Plus className="h-4 w-4" />
            {getLocalizedText('quickActionsTitle')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 p-4 pt-0">
          {quickActions.map((action) => (
            <QuickActionItem key={action.id} action={action} />
          ))}
        </CardContent>
      </Card>

      <QuickActionDialogs
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        properties={properties}
        onPropertySubmit={handlePropertySubmit}
        onRoommateSubmit={handleRoommateSubmit}
        onInspectionSubmit={handleInspectionSubmit}
      />
    </>
  );
};

export default OwnerQuickActions;
