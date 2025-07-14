
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
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header responsive */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-4 sm:p-6 text-white shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Colocataires</h1>
            <p className="text-blue-100 mt-1 sm:mt-2 text-sm sm:text-base">Gérez vos colocataires et leurs informations</p>
          </div>
          <Button 
            onClick={() => setShowRoommateForm(true)}
            className="bg-white text-blue-600 hover:bg-blue-50 border-0 shadow-md w-full sm:w-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouveau colocataire
          </Button>
        </div>
      </div>

      {/* Metrics Grid responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Colocataires</CardTitle>
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-gray-900">{roommates?.length || 0}</div>
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
            <div className="text-xl sm:text-2xl font-bold text-gray-900">{roommates?.filter(r => r.status === 'Actif').length || 0}</div>
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
            <div className="text-xl sm:text-2xl font-bold text-gray-900">{latePayments}</div>
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
            <div className="text-xl sm:text-2xl font-bold text-gray-900">{roommates?.reduce((sum, r) => sum + (parseFloat(r.rentAmount) || 0), 0) || 0}€</div>
            <p className="text-xs text-gray-500 mt-1">revenus mensuels des colocataires</p>
          </CardContent>
        </Card>
      </div>

      {/* Roommates Table responsive */}
      <Card className="shadow-lg border-0">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b">
          <CardTitle className="text-lg sm:text-xl text-gray-800">Liste des Colocataires</CardTitle>
        </CardHeader>
        <CardContent className="p-3 sm:p-6">
          {roommates && roommates.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[120px]">Nom</TableHead>
                    <TableHead className="hidden sm:table-cell min-w-[150px]">Email</TableHead>
                    <TableHead className="min-w-[120px]">Propriété</TableHead>
                    <TableHead className="hidden md:table-cell">Chambre</TableHead>
                    <TableHead>Loyer</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="hidden lg:table-cell">Date d'entrée</TableHead>
                    <TableHead className="text-right min-w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {roommates.map((roommate) => (
                    <TableRow key={roommate.id}>
                      <TableCell className="font-medium">{roommate.name}</TableCell>
                      <TableCell className="hidden sm:table-cell text-sm">{roommate.email}</TableCell>
                      <TableCell className="text-sm">{roommate.property}</TableCell>
                      <TableCell className="hidden md:table-cell">{roommate.roomNumber}</TableCell>
                      <TableCell className="font-semibold">{roommate.rentAmount}€</TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(roommate.status)} className="text-xs">
                          {roommate.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-sm">{new Date(roommate.moveInDate).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-1">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8 sm:py-12 bg-gradient-to-br from-gray-50 to-white rounded-lg border-2 border-dashed border-gray-200">
              <div className="p-3 sm:p-4 bg-gray-100 rounded-full w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 flex items-center justify-center">
                <Users className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400" />
              </div>
              <h3 className="text-base sm:text-lg font-medium text-gray-700 mb-2">Aucun colocataire</h3>
              <p className="text-sm text-gray-500 mb-4">Commencez par ajouter votre premier colocataire</p>
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
