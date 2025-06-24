
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Calculator, TrendingUp, AlertCircle, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useOwnerData } from '@/hooks/useOwnerData';
import { useAuth } from '@/hooks/useAuth';
import RentalChargeForm from '@/components/RentalChargeForm';

interface AdminRentalChargesViewProps {
  currentProfile: any;
}

const AdminRentalChargesView: React.FC<AdminRentalChargesViewProps> = ({ currentProfile }) => {
  const { t } = useTranslation();
  const { charges } = useOwnerData(currentProfile);
  const { userProfile } = useAuth();
  const profile = currentProfile || userProfile;
  const [showChargeForm, setShowChargeForm] = useState(false);

  const totalCharges = charges.length;
  const monthlyCharges = charges.filter(c => c.month).length;
  const annualCharges = charges.filter(c => !c.month).length;
  const totalAmount = charges.reduce((sum, c) => sum + (c.total || 0), 0);

  const handleChargeSubmit = async (chargeData: any) => {
    console.log('Charge data:', chargeData);
    setShowChargeForm(false);
  };

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header responsive */}
      <div className="bg-gradient-to-r from-yellow-600 to-yellow-700 rounded-xl p-4 sm:p-6 text-white shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Charges Locatives</h1>
            <p className="text-yellow-100 mt-1 sm:mt-2 text-sm sm:text-base">Gérez vos charges et provisions</p>
          </div>
          <Button 
            className="bg-white text-yellow-600 hover:bg-yellow-50 border-0 shadow-md w-full sm:w-auto"
            onClick={() => setShowChargeForm(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle charge
          </Button>
        </div>
      </div>

      {/* Metrics Grid responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card className="border-l-4 border-l-yellow-500 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Charges</CardTitle>
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Calculator className="h-4 w-4 text-yellow-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-gray-900">{totalCharges}</div>
            <p className="text-xs text-gray-500 mt-1">{totalCharges} charges enregistrées</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Charges Mensuelles</CardTitle>
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-gray-900">{monthlyCharges}</div>
            <p className="text-xs text-gray-500 mt-1">{monthlyCharges} charges récurrentes</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Charges Annuelles</CardTitle>
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertCircle className="h-4 w-4 text-red-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-gray-900">{annualCharges}</div>
            <p className="text-xs text-gray-500 mt-1">{annualCharges} charges ponctuelles</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Montant Total</CardTitle>
            <div className="p-2 bg-blue-100 rounded-lg">
              <DollarSign className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-gray-900">{totalAmount}€</div>
            <p className="text-xs text-gray-500 mt-1">Charges totales</p>
          </CardContent>
        </Card>
      </div>

      {/* Charges Table responsive */}
      <Card className="shadow-lg border-0">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b">
          <CardTitle className="text-lg sm:text-xl text-gray-800">Liste des Charges</CardTitle>
        </CardHeader>
        <CardContent className="p-3 sm:p-6">
          {charges.length === 0 ? (
            <div className="text-center py-8 sm:py-12 bg-gradient-to-br from-gray-50 to-white rounded-lg border-2 border-dashed border-gray-200">
              <div className="p-3 sm:p-4 bg-gray-100 rounded-full w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 flex items-center justify-center">
                <Calculator className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400" />
              </div>
              <h3 className="text-base sm:text-lg font-medium text-gray-700 mb-2">Aucune charge trouvée</h3>
              <p className="text-sm text-gray-500 mb-4">Commencez par ajouter vos premières charges</p>
              <Button className="bg-yellow-600 hover:bg-yellow-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Ajouter une charge
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[120px]">Propriété</TableHead>
                    <TableHead className="hidden sm:table-cell">Mois</TableHead>
                    <TableHead className="hidden md:table-cell">Locataire</TableHead>
                    <TableHead className="hidden lg:table-cell">Électricité</TableHead>
                    <TableHead className="hidden lg:table-cell">Eau</TableHead>
                    <TableHead className="hidden lg:table-cell">Chauffage</TableHead>
                    <TableHead>Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {charges.map((charge) => (
                    <TableRow key={charge.id}>
                      <TableCell className="font-medium">{charge.propertyName}</TableCell>
                      <TableCell className="hidden sm:table-cell">{charge.month}</TableCell>
                      <TableCell className="hidden md:table-cell">{charge.tenant}</TableCell>
                      <TableCell className="hidden lg:table-cell">{charge.electricity}€</TableCell>
                      <TableCell className="hidden lg:table-cell">{charge.water}€</TableCell>
                      <TableCell className="hidden lg:table-cell">{charge.heating}€</TableCell>
                      <TableCell className="font-semibold">{charge.total}€</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showChargeForm} onOpenChange={setShowChargeForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nouvelle Charge</DialogTitle>
          </DialogHeader>
          <RentalChargeForm
            isOpen={true}
            onClose={() => setShowChargeForm(false)}
            onSubmit={handleChargeSubmit}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminRentalChargesView;
