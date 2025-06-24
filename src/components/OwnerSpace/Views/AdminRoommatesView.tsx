
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Users, UserCheck, AlertCircle, DollarSign, Edit, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
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
  const { roommates, tenants, payments } = useOwnerData(profile);
  const [showRoommateForm, setShowRoommateForm] = useState(false);

  const roommateButtonConfig = getButtonConfig('roommate');

  const totalTenants = tenants?.length || 0;
  const activeTenants = tenants?.filter(t => t.status === 'Actif').length || 0;
  const latePayments = payments?.filter(p => p.status === 'En retard').length || 0;
  const monthlyRevenue = tenants?.reduce((sum, t) => sum + (parseFloat(t.rentAmount) || 0), 0) || 0;

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
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Colocataires</h1>
            <p className="text-blue-100 mt-2">Gérez vos colocataires et leurs informations</p>
          </div>
          <Button 
            onClick={() => setShowRoommateForm(true)}
            className="bg-white text-blue-600 hover:bg-blue-50 border-0 shadow-md"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouveau colocataire
          </Button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Colocataires</CardTitle>
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{roommates?.length || 0}</div>
            <p className="text-xs text-gray-500 mt-1">{roommates?.length || 0} colocataires enregistrés</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Colocataires Actifs</CardTitle>
            <div className="p-2 bg-green-100 rounded-lg">
              <UserCheck className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{roommates?.filter(r => r.status === 'Actif').length || 0}</div>
            <p className="text-xs text-gray-500 mt-1">colocataires actifs</p>
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
            <p className="text-xs text-gray-500 mt-1">paiements en retard</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Revenus Mensuels</CardTitle>
            <div className="p-2 bg-purple-100 rounded-lg">
              <DollarSign className="h-4 w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{roommates?.reduce((sum, r) => sum + (parseFloat(r.rentAmount) || 0), 0) || 0}€</div>
            <p className="text-xs text-gray-500 mt-1">revenus mensuels des colocataires</p>
          </CardContent>
        </Card>
      </div>

      {/* Roommates Table */}
      <Card className="shadow-lg border-0">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b">
          <CardTitle className="text-xl text-gray-800">Liste des Colocataires</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {roommates && roommates.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Propriété</TableHead>
                  <TableHead>Chambre</TableHead>
                  <TableHead>Loyer</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Date d'entrée</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {roommates.map((roommate) => (
                  <TableRow key={roommate.id}>
                    <TableCell className="font-medium">{roommate.name}</TableCell>
                    <TableCell>{roommate.email}</TableCell>
                    <TableCell>{roommate.property}</TableCell>
                    <TableCell>{roommate.roomNumber}</TableCell>
                    <TableCell>{roommate.rentAmount}€</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(roommate.status)}>
                        {roommate.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(roommate.moveInDate).toLocaleDateString()}</TableCell>
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
          ) : (
            <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-white rounded-lg border-2 border-dashed border-gray-200">
              <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Users className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">Aucun colocataire</h3>
              <p className="text-gray-500 mb-4">Commencez par ajouter votre premier colocataire</p>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Ajouter un colocataire
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

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
