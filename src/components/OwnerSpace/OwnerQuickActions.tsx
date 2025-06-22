
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
  const { t } = useTranslation();
  
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
    pendingPayments
  );

  return (
    <>
      <Card className="h-fit w-full">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <Plus className="h-4 w-4" />
            Quick Actions
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
