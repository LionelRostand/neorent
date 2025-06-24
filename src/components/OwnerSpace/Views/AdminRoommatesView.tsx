
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Users, UserCheck, AlertCircle, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog } from '@/components/ui/dialog';
import RoommateForm from '@/components/RoommateForm';
import { useOwnerQuickActions } from '@/hooks/useOwnerQuickActions';
import { useAuth } from '@/hooks/useAuth';
import { useFormButtonConfig } from '@/hooks/useFormButtonConfig';
import { useOwnerData } from '@/hooks/useOwnerData';

interface AdminRoommatesViewProps {
  currentProfile?: any;
}

const AdminRoommatesView: React.FC<AdminRoommatesViewProps> = ({ currentProfile }) => {
  const { t } = useTranslation();
  const { userProfile } = useAuth();
  const profile = currentProfile || userProfile;
  const { handleRoommateSubmit } = useOwnerQuickActions(profile);
  const { getButtonConfig } = useFormButtonConfig();
  const { tenants, payments } = useOwnerData(profile);
  const [showRoommateForm, setShowRoommateForm] = useState(false);

  const roommateButtonConfig = getButtonConfig('roommate');

  const totalTenants = tenants?.length || 0;
  const activeTenants = tenants?.filter(t => t.status === 'Actif').length || 0;
  const latePayments = payments?.filter(p => p.status === 'En retard').length || 0;
  const monthlyRevenue = tenants?.reduce((sum, t) => sum + (parseFloat(t.rentAmount) || 0), 0) || 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">{t('roommates.title')}</h1>
          <p className="text-gray-600 mt-1">Gérez vos locataires et leurs informations</p>
        </div>
        <Button 
          onClick={() => setShowRoommateForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          {t('roommates.addRoommate')}
        </Button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Locataires</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTenants}</div>
            <p className="text-xs text-muted-foreground">
              {totalTenants} locataires enregistrés
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Locataires Actifs</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeTenants}</div>
            <p className="text-xs text-muted-foreground">
              {activeTenants} locataires actifs
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paiements en Retard</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{latePayments}</div>
            <p className="text-xs text-muted-foreground">
              {latePayments} paiements en retard
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
