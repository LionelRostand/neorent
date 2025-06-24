
import React, { useState } from 'react';
import { Plus, Users, UserCheck, AlertCircle, DollarSign, Edit, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog } from '@/components/ui/dialog';
import { useOwnerData } from '@/hooks/useOwnerData';
import { useOwnerQuickActions } from '@/hooks/useOwnerQuickActions';
import { useAuth } from '@/hooks/useAuth';
import RoommateForm from '@/components/RoommateForm';

interface AdminTenantsViewProps {
  currentProfile: any;
}

const AdminTenantsView: React.FC<AdminTenantsViewProps> = ({ currentProfile }) => {
  const { tenants, payments } = useOwnerData(currentProfile);
  const { userProfile } = useAuth();
  const profile = currentProfile || userProfile;
  const { handleRoommateSubmit } = useOwnerQuickActions(profile);
  const [showTenantForm, setShowTenantForm] = useState(false);

  const totalTenants = tenants.length;
  const activeTenants = tenants.filter(t => t.status === 'Actif').length;
  const latePayments = payments.filter(p => p.status === 'En retard').length;
  const monthlyRevenue = tenants.reduce((sum, t) => sum + (parseFloat(t.rentAmount) || 0), 0);

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Actif':
        return 'default';
      case 'Inactif':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header harmonisé avec la sidebar */}
      <div className="bg-gradient-to-r from-teal-600 to-teal-700 rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Locataires</h1>
            <p className="text-teal-100 mt-2">Gérez vos locataires et leurs informations</p>
          </div>
          <Button 
            className="bg-white text-teal-600 hover:bg-teal-50 border-0 shadow-md"
            onClick={() => setShowTenantForm(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Ajouter un locataire
          </Button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-teal-500 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Locataires</CardTitle>
            <div className="p-2 bg-teal-100 rounded-lg">
              <Users className="h-4 w-4 text-teal-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{totalTenants}</div>
            <p className="text-xs text-gray-500 mt-1">{totalTenants} locataires enregistrés</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Locataires Actifs</CardTitle>
            <div className="p-2 bg-green-100 rounded-lg">
              <UserCheck className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{activeTenants}</div>
            <p className="text-xs text-gray-500 mt-1">{activeTenants} locataires actifs</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Paiements en Retard</CardTitle>
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertCircle className="h-4 w-4 text-red-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{latePayments}</div>
            <p className="text-xs text-gray-500 mt-1">{latePayments} paiements en retard</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Revenus Mensuels</CardTitle>
            <div className="p-2 bg-blue-100 rounded-lg">
              <DollarSign className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{monthlyRevenue}€</div>
            <p className="text-xs text-gray-500 mt-1">Revenus mensuels totaux</p>
          </CardContent>
        </Card>
      </div>

      {/* Tenants Table */}
      <Card className="shadow-lg border-0">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b">
          <CardTitle className="text-xl text-gray-800">Liste des Locataires</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {tenants.length === 0 ? (
            <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-white rounded-lg border-2 border-dashed border-gray-200">
              <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Users className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">Aucun locataire trouvé</h3>
              <p className="text-gray-500 mb-4">Commencez par ajouter votre premier locataire</p>
              <Button className="bg-teal-600 hover:bg-teal-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Ajouter un locataire
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Téléphone</TableHead>
                  <TableHead>Propriété</TableHead>
                  <TableHead>Loyer</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Prochain paiement</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tenants.map((tenant) => (
                  <TableRow key={tenant.id}>
                    <TableCell className="font-medium">{tenant.name}</TableCell>
                    <TableCell>{tenant.email}</TableCell>
                    <TableCell>{tenant.phone}</TableCell>
                    <TableCell>{tenant.property}</TableCell>
                    <TableCell>{tenant.rentAmount}€/mois</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(tenant.status)}>
                        {tenant.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{tenant.nextPayment}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={showTenantForm} onOpenChange={setShowTenantForm}>
        <RoommateForm 
          onClose={() => setShowTenantForm(false)}
          onSubmit={handleRoommateSubmit}
        />
      </Dialog>
    </div>
  );
};

export default AdminTenantsView;
