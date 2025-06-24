import React, { useState } from 'react';
import { Plus, Users, UserCheck, AlertCircle, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog } from '@/components/ui/dialog';
import { useOwnerData } from '@/hooks/useOwnerData';
import { useOwnerQuickActions } from '@/hooks/useOwnerQuickActions';
import { useFormButtonConfig } from '@/hooks/useFormButtonConfig';
import { useAuth } from '@/hooks/useAuth';
import RoommateForm from '@/components/RoommateForm';
import FormButtonConfigPanel from './FormButtonConfigPanel';

interface AdminTenantsViewProps {
  currentProfile: any;
}

const AdminTenantsView: React.FC<AdminTenantsViewProps> = ({ currentProfile }) => {
  const { tenants, payments } = useOwnerData(currentProfile);
  const { userProfile } = useAuth();
  const profile = currentProfile || userProfile;
  const { handleRoommateSubmit } = useOwnerQuickActions(profile);
  const { getButtonConfig } = useFormButtonConfig();
  const [showTenantForm, setShowTenantForm] = useState(false);

  const tenantButtonConfig = getButtonConfig('roommate');

  const totalTenants = tenants.length;
  const activeTenants = tenants.filter(t => t.status === 'Actif').length;
  const latePayments = payments.filter(p => p.status === 'En retard').length;
  const monthlyRevenue = tenants.reduce((sum, t) => sum + (parseFloat(t.rentAmount) || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        {/* Configuration des boutons */}
        <FormButtonConfigPanel actionIds={['roommate']} title="Configuration du bouton locataire" />

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Locataires</h1>
            <p className="text-gray-600 mt-1">Gérez vos locataires et leurs informations</p>
          </div>
          <Button 
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() => setShowTenantForm(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Ajouter un locataire
          </Button>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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

        {/* Tenants List */}
        <Card>
          <CardHeader>
            <CardTitle>Liste des Locataires</CardTitle>
          </CardHeader>
          <CardContent>
            {tenants.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Aucun locataire trouvé</p>
                <p className="text-sm text-gray-400">Commencez par ajouter votre premier locataire</p>
              </div>
            ) : (
              <div className="space-y-4">
                {tenants.map((tenant) => (
                  <div key={tenant.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center space-x-4">
                      <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <Users className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{tenant.name}</h3>
                        <p className="text-sm text-gray-600">{tenant.email}</p>
                        <p className="text-sm text-gray-500">{tenant.phone}</p>
                        <p className="text-sm text-gray-500">{tenant.property}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{tenant.rentAmount}€/mois</p>
                      <Badge variant={tenant.status === 'Actif' ? 'default' : 'secondary'}>
                        {tenant.status}
                      </Badge>
                      <p className="text-sm text-gray-500">Prochain paiement: {tenant.nextPayment}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Dialog open={showTenantForm} onOpenChange={setShowTenantForm}>
          <RoommateForm 
            onClose={() => setShowTenantForm(false)}
            onSubmit={handleRoommateSubmit}
            buttonConfig={tenantButtonConfig}
          />
        </Dialog>
      </div>
    </div>
  );
};

export default AdminTenantsView;
